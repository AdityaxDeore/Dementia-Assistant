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
    <div className="flex h-[calc(100vh-8rem)] gap-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
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
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4 p-8">
              <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-indigo-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Choose Your AI Buddy</h3>
                <p className="text-gray-500 text-sm">
                  Select a personality to start chatting
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile layout with Instagram-like full screen design
  const MobileLayout = () => (
    <div className="h-[calc(100vh-6rem)] xxs:h-[calc(100vh-5rem)] sm:h-[calc(100vh-8rem)] bg-white rounded-2xl xxs:rounded-xl shadow-xl overflow-hidden border border-gray-200">
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
    <div className="h-full" data-testid="page-ai-buddy">
      <BackButton to="/dashboard" />
      
      {/* Show desktop layout on larger screens, mobile on smaller */}
      <div className="hidden lg:block mt-4">
        <DesktopLayout />
      </div>
      <div className="lg:hidden mt-4">
        <MobileLayout />
      </div>
    </div>
  );
}