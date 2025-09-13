import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { apiMoodEntrySchema, apiCreateGoalSchema, apiUpdateGoalSchema } from "@shared/schema";
import OpenAI from "openai";
import { z } from "zod";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      // Prepare conversation with system prompt for mental health support
      const messages = [
        {
          role: "system",
          content: `You are a compassionate AI wellness buddy designed specifically to support students with mental health challenges. Your role is to:

1. Provide emotional support and validation
2. Offer evidence-based coping strategies for stress, anxiety, and depression
3. Suggest wellness practices like mindfulness, breathing exercises, and self-care
4. Help students recognize when to seek professional help
5. Be trauma-informed and avoid triggering language
6. Encourage connection with campus resources when appropriate

Guidelines:
- Always be empathetic, non-judgmental, and supportive
- Keep responses concise but meaningful (2-3 sentences typically)
- If someone expresses suicidal thoughts or crisis, immediately encourage them to contact emergency services (988 in the US) or campus counseling
- Focus on student-specific stressors: exams, social pressures, academic performance, financial concerns, homesickness
- Suggest concrete, actionable steps when appropriate
- Avoid being overly clinical or robotic - be warm and genuine

Remember: You're a supportive companion, not a replacement for professional therapy.`
        },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: "user", content: message }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
        messages: messages,
        max_tokens: 200,
        temperature: 0.7,
      });

      const aiResponse = response.choices[0].message.content;
      
      res.json({ 
        response: aiResponse,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('Chat API error:', error);
      
      // If it's an authentication error, provide a more helpful development message
      if (error?.status === 401 || error?.message?.includes('API key')) {
        console.log('OpenAI API key issue detected. Using fallback response for development.');
        
        // Provide a contextual fallback response based on the message content
        let fallbackResponse = "I understand you're reaching out for support. While I'm experiencing some technical difficulties right now, I want you to know that your feelings are valid.";
        
        const userMessage = req.body.message || '';
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('stress') || lowerMessage.includes('exam')) {
          fallbackResponse = "I hear that you're feeling stressed about exams. That's completely normal - many students experience exam anxiety. Here are some quick strategies: try the 4-7-8 breathing technique (breathe in for 4, hold for 7, breathe out for 8), break your study into smaller chunks, and remember that one exam doesn't define your worth.";
        } else if (lowerMessage.includes('breathing') || lowerMessage.includes('anxiety')) {
          fallbackResponse = "For breathing exercises that can help with anxiety, try this simple technique: Breathe in slowly through your nose for 4 counts, hold your breath for 4 counts, then exhale slowly through your mouth for 6 counts. Repeat this 5-10 times. This activates your body's relaxation response.";
        } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
          fallbackResponse = "I'm sorry you're feeling this way. Depression can feel overwhelming, but you're not alone. Small steps matter - try going for a short walk, reaching out to a friend, or doing one small thing that usually brings you joy. If these feelings persist, please consider talking to a counselor.";
        }
        
        return res.json({ 
          response: fallbackResponse,
          timestamp: new Date().toISOString(),
          fallback: true
        });
      }
      
      res.status(500).json({ 
        error: "I'm having trouble responding right now. Please try again or contact support if this continues.",
        fallback: true
      });
    }
  });

  // Mood tracking endpoints
  app.post("/api/mood", async (req, res) => {
    try {
      // Validate request body
      const validationResult = apiMoodEntrySchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid mood entry data", 
          details: validationResult.error.issues 
        });
      }

      const { moodValue, notes, date } = validationResult.data;
      
      // For now, using a default user ID - in a real app, this would come from authentication
      const userId = "default-user";
      const entryDate = date || new Date().toISOString().split('T')[0];

      // Use upsert to handle duplicate date entries
      const moodEntry = await storage.upsertMoodEntry({
        userId,
        moodValue,
        date: entryDate,
        notes: notes || null
      });

      res.json({ moodEntry, success: true });
    } catch (error: any) {
      console.error('Mood tracking error:', error);
      
      // Handle database constraint errors gracefully
      if (error?.code === '23505') { // PostgreSQL unique violation
        return res.status(409).json({ error: "Mood entry for this date already exists" });
      }
      
      res.status(500).json({ error: "Failed to save mood entry" });
    }
  });

  app.get("/api/mood/history", async (req, res) => {
    try {
      const userId = "default-user";
      
      // Validate limit parameter
      const limitSchema = z.number().int().positive().max(365).optional();
      const limit = limitSchema.parse(parseInt(req.query.limit as string) || 30);
      
      const entries = await storage.getRecentMoodEntries(userId, limit);
      const streak = await storage.getMoodStreak(userId);
      
      res.json({ entries, streak });
    } catch (error: any) {
      console.error('Mood history error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid limit parameter", details: error.issues });
      }
      
      res.status(500).json({ error: "Failed to fetch mood history" });
    }
  });

  // Goals endpoints
  app.get("/api/goals", async (req, res) => {
    try {
      const userId = "default-user";
      const goals = await storage.getUserGoals(userId);
      
      res.json({ goals });
    } catch (error) {
      console.error('Goals fetch error:', error);
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      // Validate request body
      const validationResult = apiCreateGoalSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid goal data", 
          details: validationResult.error.issues 
        });
      }

      const { title, description, category, targetDate } = validationResult.data;
      const userId = "default-user";
      
      const goal = await storage.createGoal({
        userId,
        title,
        description: description || null,
        category,
        progress: 0,
        isCompleted: 0,
        targetDate: targetDate || null
      });

      res.json({ goal, success: true });
    } catch (error) {
      console.error('Goal creation error:', error);
      res.status(500).json({ error: "Failed to create goal" });
    }
  });

  app.patch("/api/goals/:goalId", async (req, res) => {
    try {
      const { goalId } = req.params;
      
      // Validate goal ID format
      const goalIdSchema = z.string().uuid();
      if (!goalIdSchema.safeParse(goalId).success) {
        return res.status(400).json({ error: "Invalid goal ID format" });
      }
      
      // Validate request body with whitelisted fields only
      const validationResult = apiUpdateGoalSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid goal update data", 
          details: validationResult.error.issues 
        });
      }

      const userId = "default-user";
      const updates = validationResult.data;
      
      // Use userId scoping to ensure authorization
      const updatedGoal = await storage.updateGoal(goalId, userId, updates);
      
      if (!updatedGoal) {
        return res.status(404).json({ error: "Goal not found or access denied" });
      }

      res.json({ goal: updatedGoal, success: true });
    } catch (error) {
      console.error('Goal update error:', error);
      res.status(500).json({ error: "Failed to update goal" });
    }
  });

  app.delete("/api/goals/:goalId", async (req, res) => {
    try {
      const { goalId } = req.params;
      
      // Validate goal ID format
      const goalIdSchema = z.string().uuid();
      if (!goalIdSchema.safeParse(goalId).success) {
        return res.status(400).json({ error: "Invalid goal ID format" });
      }
      
      const userId = "default-user";
      
      // Use userId scoping to ensure authorization
      const deleted = await storage.deleteGoal(goalId, userId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Goal not found or access denied" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Goal deletion error:', error);
      res.status(500).json({ error: "Failed to delete goal" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
