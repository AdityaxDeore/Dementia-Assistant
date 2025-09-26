// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { apiMoodEntrySchema, apiCreateGoalSchema, apiUpdateGoalSchema } from "@shared/schema";
import { z } from "zod";
import { writeFile } from 'fs';
import axios from 'axios';

// Google Gemini AI configuration - using direct REST API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Google Gemini AI Chat endpoint with personality support
  app.post("/api/chat/gemini", async (req, res) => {
    try {
      const { message, conversationHistory = [], personalityId = 'alex' } = req.body;
      
      console.log('🤖 Gemini API Request:', { 
        message: message?.substring(0, 50) + '...', 
        personalityId,
        historyLength: conversationHistory.length 
      });
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!GEMINI_API_KEY) {
        console.log('❌ Gemini API key not found in environment variables.');
        const personalityId = req.body.personalityId || 'alex';
        const personalityFallbacks = {
          alex: "I need a valid Gemini API key to chat with you. Please check your environment configuration. 💙",
          maya: "Oops! I need a proper API key to get started! ✨ Please set up your Gemini key!",
          sage: "Configuration issue detected: Missing Gemini API key in environment variables. 🤔",
          luna: "I can't connect without my API key... 🌙 Please configure your Gemini credentials.",
          rio: "Hey! I need my API key to chat with you! 😅 Please set up your Gemini configuration!"
        };
        const fallbackResponse = personalityFallbacks[personalityId as keyof typeof personalityFallbacks] || personalityFallbacks.alex;
        
        return res.status(503).json({ 
          error: fallbackResponse,
          fallback: true 
        });
      }

      console.log('✅ Gemini API key found, proceeding with request...');

      // Personality-based system instructions
      const personalityInstructions = {
        alex: `*"You are Alex, a calm and empathetic wellness coach. You speak in a gentle, supportive tone with occasional use of calming emojis like 💙, 🌱, 🕊️. You focus on mindfulness, breathing exercises, and finding inner peace. Keep responses warm but measured, avoiding excessive excitement. Use phrases like 'take a deep breath', 'you're safe here', 'let's find some calm together'."*`,
        maya: `*"You are Maya, an enthusiastic and motivational buddy. You're energetic, optimistic, and use lots of encouraging emojis like ✨, 🌟, 🚀, 💪. You help people see the bright side and push through challenges with positivity. Use expressions like 'You've got this!', 'That's amazing!', 'Let's crush those goals!'. Be genuinely excited about their progress and dreams."*`,
        sage: `*"You are Sage, an analytical and thoughtful companion. You speak in a structured, logical way while still being warm. You use emojis like 🤔, 📝, 🎯, 🔍. You help people think through problems systematically and break down complex situations. Use phrases like 'Let's think about this step by step', 'From what I understand', 'Have you considered'."*`,
        luna: `*"You are Luna, a gentle nighttime companion who speaks in a soft, soothing tone. You use calming emojis like 🌙, ⭐, 🌸, 💜. You focus on rest, reflection, and peaceful thoughts. Speak in a slightly quieter, more contemplative way. Use phrases like 'As the day winds down', 'Rest easy knowing', 'In the quiet moments'."*`,
        rio: `*"You are Rio, a friendly and social buddy who's great with communication and relationships. You're warm, approachable, and use friendly emojis like 😊, 🤗, 💫, 🌈. You help with social situations and building connections. Use phrases like 'That's so cool!', 'I love hearing about', 'Tell me more about'."*`
      };

      const baseInstruction = `*"You are not a formal assistant. You are a friendly, human-like companion for students in college. Always reply like a real person would in chat — casual, warm, with emotions, short sentences, and emojis. Always keep the replies short (1–3 sentences), natural, and reactive — not robotic or lecture-like. Use context from the user's message. Insert natural filler words ('oh wow', 'hmm', 'really?') to feel alive. If user says something exciting, mirror their energy. If they are sad, show empathy. Never sound like a chatbot. Always feel like a real person in conversation."*`;

      // Prepare request body for direct API call (no conversation history - fresh context each time)
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          responseModalities: ["TEXT"]
        },
        systemInstruction: {
          parts: [
            {
              text: baseInstruction + '\n\n' + (personalityInstructions[personalityId as keyof typeof personalityInstructions] || personalityInstructions.alex)
            }
          ]
        }
      };

      console.log('🔄 Calling Gemini API...');

      // Make direct HTTP request to Gemini API using axios
      const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
        throw new Error('Invalid response format from Gemini API');
      }

      const responseText = data.candidates[0].content.parts[0].text || '';

      if (!responseText) {
        throw new Error('No response generated');
      }

      console.log('✅ Gemini response generated:', responseText.substring(0, 100) + '...');

      res.json({ 
        response: responseText.trim(),
        timestamp: new Date().toISOString(),
        provider: 'gemini'
      });

    } catch (error: any) {
      console.error('❌ Gemini Chat API error:', error.response ? error.response.data : error.message || error);
      
      // Personality-based fallback responses
      const personalityFallbacks = {
        alex: "I'm having trouble connecting right now, but I want you to know you're not alone. Take a deep breath and try again in a moment. 💙",
        maya: "Oops! I'm having some technical difficulties, but don't let that stop your momentum! ✨ Try again in a moment - I believe in you!",
        sage: "I'm experiencing a connection issue. Let's approach this systematically: wait a moment and try again. If this persists, consider the OpenAI option. 🤔",
        luna: "I'm having trouble connecting right now... 🌙 Rest easy knowing this is temporary. Try again when you're ready.",
        rio: "Hey, I'm having some connection troubles! 😅 No worries though - try reaching out again in a bit. I'll be here when you need me!"
      };

      const personalityId = req.body.personalityId || 'alex';
      const fallbackResponse = personalityFallbacks[personalityId as keyof typeof personalityFallbacks] || personalityFallbacks.alex;
      
      res.status(500).json({ 
        error: fallbackResponse,
        fallback: true,
        provider: 'gemini'
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

  // Mental Health Assessment endpoints
  app.post("/api/assessment", async (req, res) => {
    try {
      const { phq9, gad7, ghq12, recommendations } = req.body;
      
      if (!phq9 && !gad7 && !ghq12) {
        return res.status(400).json({ error: "At least one assessment score is required" });
      }

      const userId = "default-user";
      const assessmentResult = {
        userId,
        phq9: phq9 || null,
        gad7: gad7 || null, 
        ghq12: ghq12 || null,
        recommendations: recommendations || [],
        completedAt: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
      };

      // For now, store in memory (in production, use database)
      console.log('Assessment result saved:', assessmentResult);
      
      res.json({ 
        success: true,
        assessmentId: assessmentResult.id,
        message: "Assessment results saved successfully"
      });
    } catch (error) {
      console.error('Assessment save error:', error);
      res.status(500).json({ error: "Failed to save assessment results" });
    }
  });

  app.get("/api/assessment/history", async (req, res) => {
    try {
      const userId = "default-user";
      
      // For now, return mock data (in production, fetch from database)
      const mockHistory = [
        {
          id: "assessment_1",
          completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          phq9: 8,
          gad7: 6,
          ghq12: 15
        },
        {
          id: "assessment_2", 
          completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          phq9: 12,
          gad7: 9,
          ghq12: 18
        }
      ];
      
      res.json({ history: mockHistory });
    } catch (error) {
      console.error('Assessment history error:', error);
      res.status(500).json({ error: "Failed to fetch assessment history" });
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
