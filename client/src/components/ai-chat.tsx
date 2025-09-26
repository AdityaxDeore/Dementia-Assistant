import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type AIPersonality } from "@shared/ai-personalities";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personalityId?: string;
}

interface AIChatProps {
  personality: AIPersonality;
  onBack?: () => void;
  messages: Message[];
  onMessagesUpdate: (messages: Message[]) => void;
  userMoodEmoji?: string | null;
}

export function AIChat({ personality, onBack, messages, onMessagesUpdate, userMoodEmoji }: AIChatProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Initialize with welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: getWelcomeMessage(personality),
        sender: 'ai',
        timestamp: new Date(),
        personalityId: personality.id
      };
      onMessagesUpdate([welcomeMessage]);
    }
  }, [personality.id, messages.length, onMessagesUpdate]);

  const getWelcomeMessage = (personality: AIPersonality): string => {
    const welcomeMessages = {
      alex: "Hi! I'm Alex, your calm wellness coach. I'm here to help you find peace and balance. Take a deep breath - you're in a safe space. How are you feeling today?",
      maya: "Hey there! 🌟 I'm Maya, your motivational buddy! I'm absolutely thrilled to meet you and can't wait to help you crush your goals! What's something exciting you're working on?",
      sage: "Hello! I'm Sage, your analytical companion. I enjoy helping people think through challenges systematically. What situation would you like to work through together?",
      luna: "Good evening... I'm Luna, your gentle nighttime companion. 🌙 I'm here to help you unwind and find peaceful rest. How has your day been treating you?",
      rio: "Hey! 😊 I'm Rio, your friendly social buddy! I love helping people connect and communicate better. What's on your mind about your social world today?"
    };
    return welcomeMessages[personality.id as keyof typeof welcomeMessages] || 
           `Hi! I'm ${personality.name}. ${personality.description} How can I support you today?`;
  };

  const getPersonalityColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      orange: 'bg-orange-500', 
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      green: 'bg-green-500',
    };
    return colors[color as keyof typeof colors] || 'bg-blue-500';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      personalityId: personality.id
    };

    const updatedMessages = [...messages, userMessage];
    onMessagesUpdate(updatedMessages);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      console.log('Attempting to send message to AI...');
      let response;
      let provider = 'gemini';

      // 1. Try Gemini first
      try {
        console.log('Trying Gemini API...');
        response = await fetch('/api/chat/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentInput, personalityId: personality.id }),
        });

        if (!response.ok) {
          console.warn(`Gemini API responded with status ${response.status}. Falling back to OpenAI.`);
          throw new Error('Gemini API failed'); // Trigger fallback
        }
        console.log('✅ Gemini API call successful.');
      } catch (geminiError) {
        // 2. Fallback to OpenAI
        console.log('Gemini failed, trying OpenAI API...');
        provider = 'openai';
        try {
          response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: currentInput, personalityId: personality.id }),
          });

          if (!response.ok) {
            console.error(`OpenAI API also failed with status ${response.status}.`);
            throw new Error('Both Gemini and OpenAI APIs failed');
          }
          console.log('✅ OpenAI API call successful.');
        } catch (openAIError) {
          console.error('❌ Both AI providers failed.');
          throw openAIError; // Let the final catch block handle it
        }
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
        personalityId: personality.id
      };

      onMessagesUpdate([...updatedMessages, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback response based on personality
      const fallbackResponses = {
        alex: "I'm having trouble connecting right now, but I want you to know you're not alone. Take a deep breath and try again in a moment. If you're in crisis, please reach out to emergency services.",
        maya: "Oops! I'm having some technical difficulties, but don't let that stop your momentum! ✨ Try again in a moment - I believe in you!",
        sage: "I'm experiencing a connection issue. Let's approach this systematically: wait a moment and try again. If this persists, consider alternative support resources.",
        luna: "I'm having trouble connecting right now... 🌙 Rest easy knowing this is temporary. Try again when you're ready, and remember to be gentle with yourself.",
        rio: "Hey, I'm having some connection troubles! 😅 No worries though - try reaching out again in a bit. I'll be here when you need me!"
      };

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponses[personality.id as keyof typeof fallbackResponses] || 
                "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
        personalityId: personality.id
      };
      onMessagesUpdate([...updatedMessages, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    // Clear current session messages and restart with welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: getWelcomeMessage(personality),
      sender: 'ai',
      timestamp: new Date(),
      personalityId: personality.id
    };
    onMessagesUpdate([welcomeMessage]);
  };

  return (
    <div className="flex flex-col h-full bg-white" data-testid="card-ai-chat">
      {/* Header - Fixed Instagram style */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <Avatar className="w-12 h-12 ring-2 ring-white shadow-lg">
            <AvatarFallback className={`${getPersonalityColor(personality.color)} text-white text-xl`}>
              {personality.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{personality.name}</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-500">
              {personality.description} • Active now
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Clear conversation"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
        
        {/* Specialties */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {personality.specialties.map((specialty) => (
            <Badge key={specialty} variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-600">
              {specialty}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'ai' && (
                <Avatar className="w-10 h-10 mt-1 flex-shrink-0">
                  <AvatarFallback className={`${getPersonalityColor(personality.color)} text-white`}>
                    {personality.avatar}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}
                data-testid={`message-${message.sender}`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className={`text-xs mt-2 block ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              {message.sender === 'user' && (
                <Avatar className="w-10 h-10 mt-1 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600">
                    {userMoodEmoji ? (
                      <span className="text-lg">{userMoodEmoji}</span>
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-10 h-10 mt-1">
                <AvatarFallback className={`${getPersonalityColor(personality.color)} text-white`}>
                  {personality.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input - Fixed at bottom Instagram style */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${personality.name}...`}
              className="rounded-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 pr-12 py-3 resize-none"
              data-testid="input-chat-message"
            />
          </div>
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isTyping}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 w-12 h-12 p-0 shadow-lg transition-all duration-200 hover:scale-105 disabled:scale-100"
            data-testid="button-send-message"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}