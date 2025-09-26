import { useState, useEffect } from "react";
import { AIChatList } from "@/components/ai-chat-list";
import { AIChat } from "@/components/ai-chat";
import { BackButton } from "@/components/ui/back-button";
import { AI_PERSONALITIES, type AIPersonality } from "@shared/ai-personalities";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personalityId?: string;
}

type ConversationHistory = Record<string, Message[]>;

export default function AIBuddyPage() {
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality | null>(null);
  const [conversations, setConversations] = useState<ConversationHistory>({});
  const [lastMessages, setLastMessages] = useState<Record<string, string>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

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

  // Desktop layout (side-by-side)
  const DesktopLayout = () => (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Chat List */}
      <div className="w-80 flex-shrink-0">
        <AIChatList
          onSelectPersonality={handleSelectPersonality}
          selectedPersonalityId={selectedPersonality?.id}
          lastMessages={lastMessages}
          unreadCounts={unreadCounts}
        />
      </div>
      
      {/* Chat Area */}
      <div className="flex-1">
        {selectedPersonality ? (
          <AIChat
            personality={selectedPersonality}
            messages={getCurrentMessages()}
            onMessagesUpdate={handleMessagesUpdate}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-muted">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Choose an AI Buddy</h3>
              <p className="text-muted-foreground max-w-md">
                Select a personality from the left to start chatting. Each AI buddy has their own unique approach to supporting your mental wellness journey.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile layout (full screen switching)
  const MobileLayout = () => (
    <div className="h-[calc(100vh-8rem)]">
      {selectedPersonality ? (
        <AIChat
          personality={selectedPersonality}
          onBack={handleBack}
          messages={getCurrentMessages()}
          onMessagesUpdate={handleMessagesUpdate}
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
    <div className="space-y-6" data-testid="page-ai-buddy">
      <BackButton to="/dashboard" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Wellness Buddies</h1>
        <p className="text-muted-foreground">
          Chat with different AI personalities, each designed to support you in unique ways. 
          Choose the buddy that matches your current needs and mood.
        </p>
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