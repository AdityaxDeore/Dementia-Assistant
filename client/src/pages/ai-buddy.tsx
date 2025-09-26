import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { AIChatList } from "@/components/ai-chat-list";
import { AIChat } from "@/components/ai-chat";
import { BackButton } from "@/components/ui/back-button";
import { AI_PERSONALITIES, type AIPersonality } from "@shared/ai-personalities";
import { useLocation } from "wouter";
import { MessageCircle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personalityId?: string;
}

type ConversationHistory = Record<string, Message[]>;

export default function AIBuddyPage() {
  const [location] = useLocation();
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality | null>(null);
  const [conversations, setConversations] = useState<ConversationHistory>({});
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [userMoodEmoji, setUserMoodEmoji] = useState<string | null>(null);

  // Extract mood and emoji from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mood = urlParams.get('mood');
    const emoji = urlParams.get('emoji');
    
    if (emoji) {
      setUserMoodEmoji(decodeURIComponent(emoji));
    }
    
    // Auto-select a personality based on mood
    if (mood && !selectedPersonality) {
      const moodToPersonality = {
        '1': 'alex',  // Very Low -> Alex (calm)
        '2': 'luna',  // Low -> Luna (gentle)
        '3': 'sage',  // Medium -> Sage (analytical)
        '4': 'maya',  // Good -> Maya (motivational)
        '5': 'rio'    // Excellent -> Rio (social)
      };
      
      const personalityId = moodToPersonality[mood as keyof typeof moodToPersonality];
      if (personalityId) {
        const personality = AI_PERSONALITIES.find(p => p.id === personalityId);
        if (personality) {
          setSelectedPersonality(personality);
        }
      }
    }
  }, [location, selectedPersonality]);

  // Update last messages when conversations change (but don't save to localStorage)
  useEffect(() => {
    const lastMsgs: Record<string, string> = {};
    Object.keys(conversations).forEach(personalityId => {
      const msgs = conversations[personalityId];
      if (msgs.length > 0) {
        const lastMsg = msgs[msgs.length - 1];
        lastMsgs[personalityId] = lastMsg.sender === 'user' 
          ? `You: ${lastMsg.content.slice(0, 50)}${lastMsg.content.length > 50 ? '...' : ''}`
          : `${lastMsg.content.slice(0, 50)}${lastMsg.content.length > 50 ? '...' : ''}`;
      }
    });
    setLastMessages(lastMsgs);
  }, [conversations]);

  const handleSelectPersonality = (personality: AIPersonality) => {
    setSelectedPersonality(personality);
    // Clear unread count for this personality
    setUnreadCounts(prev => ({
      ...prev,
      [personality.id]: 0
    }));
    
    // Clear conversation history for fresh start with each personality
    setConversations(prev => ({
      ...prev,
      [personality.id]: []
    }));
  };

  const handleMessagesUpdate = (messages: Message[]) => {
    if (!selectedPersonality) return;
    
    setConversations(prev => ({
      ...prev,
      [selectedPersonality.id]: messages
    }));
  };

  const handleBack = () => {
    setSelectedPersonality(null);
  };

  const getCurrentMessages = (): Message[] => {
    if (!selectedPersonality) return [];
    return conversations[selectedPersonality.id] || [];
  };

  // Desktop layout with Instagram-like design - fixed height containers
  const DesktopLayout = () => (
    <div className="flex h-[calc(100vh-12rem)] gap-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Chat List - Instagram sidebar style */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <AIChatList
          onSelectPersonality={handleSelectPersonality}
          selectedPersonalityId={selectedPersonality?.id}
          lastMessages={lastMessages}
          unreadCounts={unreadCounts}
        />
      </div>
      
      {/* Chat Area - Instagram main content style */}
      <div className="flex-1 flex flex-col">
        {selectedPersonality ? (
          <AIChat
            personality={selectedPersonality}
            messages={getCurrentMessages()}
            onMessagesUpdate={handleMessagesUpdate}
            userMoodEmoji={userMoodEmoji}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
            <div className="text-center space-y-6 p-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-indigo-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold text-gray-800">Choose Your AI Buddy</h3>
                <p className="text-gray-500 max-w-md leading-relaxed">
                  Select a personality from the sidebar to start your wellness conversation. Each AI buddy is designed to support you in their unique way.
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile layout with Instagram-like full screen design
  const MobileLayout = () => (
    <div className="h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {selectedPersonality ? (
        <AIChat
          personality={selectedPersonality}
          onBack={handleBack}
          messages={getCurrentMessages()}
          onMessagesUpdate={handleMessagesUpdate}
          userMoodEmoji={userMoodEmoji}
        />
      ) : (
        <AIChatList
          onSelectPersonality={handleSelectPersonality}
          selectedPersonalityId={selectedPersonality?.id}
          lastMessages={lastMessages}
          unreadCounts={unreadCounts}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6 pb-6" data-testid="page-ai-buddy">
      <BackButton to="/dashboard" />
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Wellness Buddies
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect with AI personalities designed to support your mental wellness journey. 
            Each buddy offers unique expertise and a personalized approach to help you thrive.
          </p>
        </div>
        
        {/* Quick stats */}
        <div className="flex justify-center gap-8 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-indigo-600">{AI_PERSONALITIES.length}</div>
            <div className="text-xs text-gray-500 font-medium">AI Buddies</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-600">24/7</div>
            <div className="text-xs text-gray-500 font-medium">Available</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-purple-600">∞</div>
            <div className="text-xs text-gray-500 font-medium">Support</div>
          </div>
        </div>
      </div>
      
      {/* Show desktop layout on larger screens, mobile on smaller */}
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
      <div className="lg:hidden">
        <MobileLayout />
      </div>
    </div>
  );
}