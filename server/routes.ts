import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

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

  const httpServer = createServer(app);

  return httpServer;
}
