import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import { User, MoodEntry, Goal, JournalEntry, CrisisReport } from "./models";
import OpenAI from "openai";
import { z } from "zod";

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

// OpenAI configuration
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// Validation schemas
const userRegistrationSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const userLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const moodEntrySchema = z.object({
  moodValue: z.number().int().min(1).max(5),
  notes: z.string().max(1000).optional(),
  date: z.string().optional(),
  emotions: z.array(z.string()).optional(),
  triggers: z.array(z.string()).optional(),
  copingStrategies: z.array(z.string()).optional(),
  energy: z.number().int().min(1).max(5).optional(),
  sleep: z.number().min(0).max(24).optional(),
  stress: z.number().int().min(1).max(5).optional(),
});

const goalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.enum(["wellness", "academic", "personal", "social", "career"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
  targetDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const journalEntrySchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  mood: z.number().int().min(1).max(5).optional(),
  tags: z.array(z.string()).optional(),
  isPrivate: z.boolean().optional(),
  emotions: z.array(z.string()).optional(),
  gratitude: z.array(z.string()).optional(),
  concerns: z.array(z.string()).optional(),
});

const crisisReportSchema = z.object({
  type: z.enum(["emergency", "ragging", "harassment", "mental_health", "other"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  description: z.string().min(1).max(2000),
  location: z.string().optional(),
  isAnonymous: z.boolean().optional(),
  contactInfo: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    emergencyContact: z.string().optional(),
  }).optional(),
});

// Middleware to verify JWT token
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS
  app.use(cors());

  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validationResult = userRegistrationSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid registration data", 
          details: validationResult.error.issues 
        });
      }

      const { username, email, password, firstName, lastName } = validationResult.data;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (existingUser) {
        return res.status(409).json({ 
          error: "Username or email already exists" 
        });
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
        firstName,
        lastName
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validationResult = userLoginSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid login data", 
          details: validationResult.error.issues 
        });
      }

      const { username, password } = validationResult.data;

      // Find user by username or email
      const user = await User.findOne({
        $or: [{ username }, { email: username }]
      });

      if (!user || !user.isActive) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // AI Chat endpoint
  app.post("/api/chat", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { message, conversationHistory = [], personalityId = 'alex' } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Import personality system prompts
      const { getPersonalitySystemPrompt } = await import("@shared/ai-personalities");
      const systemPrompt = getPersonalitySystemPrompt(personalityId);

      const messages = [
        {
          role: "system",
          content: systemPrompt
        },
        ...conversationHistory.slice(-10),
        { role: "user", content: message }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        max_tokens: 200,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0].message.content;
      
      res.json({ 
        response: aiResponse,
        timestamp: new Date().toISOString(),
        personalityId
      });

    } catch (error: any) {
      console.error('Chat API error:', error);
      
      if (error?.status === 401 || error?.message?.includes('API key')) {
        // Provide personality-specific fallback responses
        const { personalityId = 'alex' } = req.body;
        const userMessage = req.body.message || '';
        const lowerMessage = userMessage.toLowerCase();
        
        let fallbackResponse = "I understand you're reaching out for support. While I'm experiencing some technical difficulties right now, I want you to know that your feelings are valid.";
        
        // Personality-specific fallback responses
        if (personalityId === 'alex') {
          if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
            fallbackResponse = "I hear that you're feeling stressed. That's completely normal - many students experience this. Try taking three deep breaths with me: in for 4, hold for 4, out for 6. You're stronger than you think. 💙";
          } else if (lowerMessage.includes('breathing')) {
            fallbackResponse = "For anxiety, try the 4-7-8 breathing technique: breathe in for 4, hold for 7, breathe out for 8. This activates your body's relaxation response. You're in a safe space here.";
          }
        } else if (personalityId === 'maya') {
          if (lowerMessage.includes('goal') || lowerMessage.includes('motivation')) {
            fallbackResponse = "You've got this! 🌟 Every big goal starts with a single step. What's one small thing you can do today to move forward? I believe in your potential!";
          } else {
            fallbackResponse = "Hey superstar! ✨ I know I'm having some tech troubles, but your determination is stronger than any obstacle! Keep pushing forward - you're amazing!";
          }
        } else if (personalityId === 'sage') {
          if (lowerMessage.includes('problem') || lowerMessage.includes('decision')) {
            fallbackResponse = "Let's approach this systematically. First, can you identify the core issue? Then we can break it down into manageable components and evaluate your options logically.";
          } else {
            fallbackResponse = "I'm experiencing a technical issue, but let's think through this step by step. What's the main challenge you're facing? We can work through it together methodically.";
          }
        } else if (personalityId === 'luna') {
          if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
            fallbackResponse = "Rest is so important for your wellbeing... 🌙 Try creating a calming bedtime routine: dim lights, gentle stretches, maybe some journaling. You deserve peaceful sleep.";
          } else {
            fallbackResponse = "I'm having some connection troubles, but I want you to know you're not alone in this quiet moment... Take time to breathe and be gentle with yourself. 🌙";
          }
        } else if (personalityId === 'rio') {
          if (lowerMessage.includes('friend') || lowerMessage.includes('social')) {
            fallbackResponse = "Social connections are so important! 😊 Remember, authentic relationships start with being yourself. What's one small way you could reach out to someone today?";
          } else {
            fallbackResponse = "Hey friend! 😊 I'm having some tech hiccups, but I'm still here for you in spirit! Remember, you're worthy of great friendships and connections!";
          }
        }
        
        return res.json({ 
          response: fallbackResponse,
          timestamp: new Date().toISOString(),
          fallback: true,
          personalityId
        });
      }
      
      res.status(500).json({ 
        error: "I'm having trouble responding right now. Please try again or contact support if this continues.",
        fallback: true
      });
    }
  });

  // Mood tracking endpoints
  app.post("/api/mood", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validationResult = moodEntrySchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid mood entry data", 
          details: validationResult.error.issues 
        });
      }

      const moodData = validationResult.data;
      const userId = req.user!.userId;
      const entryDate = moodData.date ? new Date(moodData.date) : new Date();

      // Check if entry already exists for this date
      const existingEntry = await MoodEntry.findOne({
        userId,
        date: {
          $gte: new Date(entryDate.setHours(0, 0, 0, 0)),
          $lt: new Date(entryDate.setHours(23, 59, 59, 999))
        }
      });

      let moodEntry;
      if (existingEntry) {
        // Update existing entry
        Object.assign(existingEntry, moodData);
        moodEntry = await existingEntry.save();
      } else {
        // Create new entry
        moodEntry = new MoodEntry({
          userId,
          ...moodData,
          date: entryDate
        });
        await moodEntry.save();
      }

      res.json({ moodEntry, success: true });
    } catch (error: any) {
      console.error('Mood tracking error:', error);
      res.status(500).json({ error: "Failed to save mood entry" });
    }
  });

  app.get("/api/mood/history", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 30;
      
      const entries = await MoodEntry.find({ userId })
        .sort({ date: -1 })
        .limit(limit);

      // Calculate streak
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let streak = 0;
      let checkDate = new Date(today);
      
      const entryDates = new Set(
        entries.map(entry => {
          const date = new Date(entry.date);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        })
      );
      
      while (entryDates.has(checkDate.getTime())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      res.json({ entries, streak });
    } catch (error: any) {
      console.error('Mood history error:', error);
      res.status(500).json({ error: "Failed to fetch mood history" });
    }
  });

  // Goals endpoints
  app.get("/api/goals", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
      
      res.json({ goals });
    } catch (error) {
      console.error('Goals fetch error:', error);
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validationResult = goalSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid goal data", 
          details: validationResult.error.issues 
        });
      }

      const goalData = validationResult.data;
      const userId = req.user!.userId;
      
      const goal = new Goal({
        userId,
        ...goalData,
        targetDate: goalData.targetDate ? new Date(goalData.targetDate) : undefined
      });

      await goal.save();

      res.json({ goal, success: true });
    } catch (error) {
      console.error('Goal creation error:', error);
      res.status(500).json({ error: "Failed to create goal" });
    }
  });

  app.patch("/api/goals/:goalId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { goalId } = req.params;
      const userId = req.user!.userId;
      
      const goal = await Goal.findOne({ _id: goalId, userId });
      if (!goal) {
        return res.status(404).json({ error: "Goal not found" });
      }

      // Update goal
      Object.assign(goal, req.body);
      
      // Auto-complete if progress is 100
      if (goal.progress >= 100) {
        goal.isCompleted = true;
      }
      
      await goal.save();

      res.json({ goal, success: true });
    } catch (error) {
      console.error('Goal update error:', error);
      res.status(500).json({ error: "Failed to update goal" });
    }
  });

  app.delete("/api/goals/:goalId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { goalId } = req.params;
      const userId = req.user!.userId;
      
      const result = await Goal.deleteOne({ _id: goalId, userId });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Goal not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Goal deletion error:', error);
      res.status(500).json({ error: "Failed to delete goal" });
    }
  });

  // Journal endpoints
  app.get("/api/journal", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      
      const entries = await JournalEntry.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await JournalEntry.countDocuments({ userId });
      
      res.json({ 
        entries, 
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Journal fetch error:', error);
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.post("/api/journal", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validationResult = journalEntrySchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid journal entry data", 
          details: validationResult.error.issues 
        });
      }

      const entryData = validationResult.data;
      const userId = req.user!.userId;
      
      const journalEntry = new JournalEntry({
        userId,
        ...entryData
      });

      await journalEntry.save();

      res.json({ journalEntry, success: true });
    } catch (error) {
      console.error('Journal creation error:', error);
      res.status(500).json({ error: "Failed to create journal entry" });
    }
  });

  // Crisis support endpoints
  app.post("/api/crisis-report", async (req: Request, res: Response) => {
    try {
      const validationResult = crisisReportSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid crisis report data", 
          details: validationResult.error.issues 
        });
      }

      const reportData = validationResult.data;
      const userId = req.headers.authorization ? (req as AuthenticatedRequest).user?.userId : undefined;
      
      const crisisReport = new CrisisReport({
        userId: reportData.isAnonymous ? undefined : userId,
        ...reportData
      });

      await crisisReport.save();

      res.json({ 
        crisisReport: {
          id: crisisReport._id,
          type: crisisReport.type,
          severity: crisisReport.severity,
          status: crisisReport.status,
          createdAt: crisisReport.createdAt
        }, 
        success: true 
      });
    } catch (error) {
      console.error('Crisis report error:', error);
      res.status(500).json({ error: "Failed to submit crisis report" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}