# Google Gemini AI Integration

## Overview

The StudentMindscape AI buddy system now supports **Google Gemini AI** with personality-based responses and multimodal capabilities. The system automatically falls back to OpenAI if Gemini is unavailable.

## Features

- ✨ **Personality-Based AI**: Each AI buddy (Alex, Maya, Sage, Luna, Rio) has unique conversation styles
- 🖼️ **Multimodal Support**: Can handle text and image responses
- 🔄 **Automatic Fallback**: Falls back to OpenAI if Gemini API is unavailable
- 💾 **File Generation**: Saves binary files (images, etc.) when AI generates them
- 🎭 **Human-like Conversations**: Natural, casual responses with emojis and personality

## Installation

### 1. Install Dependencies

```bash
# Install required packages
npm install @google/genai mime --legacy-peer-deps
npm install -D @types/node --legacy-peer-deps
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key for configuration

### 3. Environment Configuration

Create a `.env` file (copy from `.env.example`):

```bash
# Google Gemini API Key (Primary)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# OpenAI API Key (Fallback)
OPENAI_API_KEY=your_openai_api_key_here
```

## AI Personality System

### Personality Modes

| Personality | Style | Emojis | Use Case |
|------------|-------|--------|----------|
| **Alex** | Calm, empathetic wellness coach | 💙, 🌱, 🕊️ | Anxiety, stress relief, mindfulness |
| **Maya** | Enthusiastic motivational buddy | ✨, 🌟, 🚀, 💪 | Goal setting, motivation, positivity |
| **Sage** | Analytical, thoughtful companion | 🤔, 📝, 🎯, 🔍 | Problem solving, academic help |
| **Luna** | Gentle nighttime companion | 🌙, ⭐, 🌸, 💜 | Sleep issues, reflection, calm |
| **Rio** | Friendly social buddy | 😊, 🤗, 💫, 🌈 | Social situations, relationships |

### Personality Examples

**Alex (Wellness Coach)**:
- User: "I'm feeling stressed about exams"
- Alex: "I hear you're feeling stressed 💙 Let's take a deep breath together. You're safe here and we can work through this."

**Maya (Motivational Buddy)**:
- User: "I'm feeling stressed about exams" 
- Maya: "You've got this! ✨ Exam stress is totally normal but you're stronger than you think! What's your biggest challenge right now?"

**Sage (Analytical Companion)**:
- User: "I'm feeling stressed about exams"
- Sage: "Let's think about this step by step 🤔 What specific aspects of the exams are causing the most stress? We can break this down systematically."

## API Endpoints

### Gemini AI Chat Endpoint

**POST** `/api/chat/gemini`

```json
{
  "message": "User message here",
  "conversationHistory": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ],
  "personalityId": "alex"
}
```

**Response:**
```json
{
  "response": "AI response with personality",
  "timestamp": "2025-09-25T16:30:00.000Z",
  "provider": "gemini"
}
```

### Fallback System

If Gemini fails, the system automatically tries:
1. **Gemini AI** (Primary) - Personality-based responses
2. **OpenAI GPT** (Fallback) - Generic cognitive care support
3. **Static Responses** (Emergency fallback) - Predefined helpful messages

## File Generation

When Gemini generates images or other binary files:

```typescript
// Files are automatically saved with format:
`gemini_response_0.png`
`gemini_response_1.jpg`
// etc.
```

## Code Architecture

### Server Side (`server/routes.ts`)

```typescript
// Google Gemini AI configuration
const geminiAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Personality-based system instructions
const personalityInstructions = {
  alex: "You are Alex, a calm and empathetic wellness coach...",
  maya: "You are Maya, an enthusiastic and motivational buddy...",
  // etc.
};
```

### Client Side (`components/ai-chat.tsx`)

```typescript
// Try Gemini first, fallback to OpenAI
try {
  response = await fetch('/api/chat/gemini', { ... });
} catch (error) {
  response = await fetch('/api/chat', { ... }); // OpenAI fallback
}
```

## Usage in Application

1. **User selects AI personality** from the buddy list (Alex, Maya, Sage, Luna, Rio)
2. **Client sends message** to `/api/chat/gemini` with `personalityId`
3. **Gemini processes** with personality-specific instructions
4. **Response streams back** with appropriate personality and emojis
5. **Auto-fallback** to OpenAI if Gemini fails
6. **Files saved** automatically if AI generates images/media

## Development Notes

- **Streaming Response**: Uses `generateContentStream` for real-time responses
- **Context Window**: Keeps last 8 messages for conversation context  
- **Error Handling**: Comprehensive fallback system ensures chat always works
- **File Handling**: Automatic binary file processing and saving
- **Type Safety**: Full TypeScript support with proper interfaces

## Troubleshooting

### Common Issues

1. **"Gemini AI service not available"**
   - Check if `GEMINI_API_KEY` is set in `.env`
   - Verify API key is valid on Google AI Studio
   - System will fallback to OpenAI automatically

2. **Dependency conflicts during installation**
   - Use `--legacy-peer-deps` flag
   - Ensure Node.js version compatibility

3. **Personality not working correctly**
   - Check `personalityId` is being sent in request
   - Verify personality exists in `personalityInstructions`

### Testing

```bash
# Test Gemini endpoint directly
curl -X POST http://localhost:5000/api/chat/gemini \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, I need help with stress",
    "personalityId": "alex"
  }'
```

## Security Considerations

- ✅ API keys stored in environment variables
- ✅ Request validation and sanitization
- ✅ Error messages don't expose internal details
- ✅ Fallback system prevents service disruption
- ✅ File uploads handled securely

## Future Enhancements

- 🔄 **Conversation Memory**: Persistent long-term context
- 🎨 **Image Generation**: Personality-based visual content
- 🔊 **Voice Responses**: Audio output for accessibility
- 📊 **Analytics**: Track personality effectiveness
- 🌍 **Multi-language**: Support for different languages

---

**Ready to use!** The AI buddy system now provides more natural, personality-driven conversations that better support dementia care needs.