import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AI_PERSONALITIES, type AIPersonality } from "@shared/ai-personalities";

interface AIChatListProps {
  onSelectPersonality: (personality: AIPersonality) => void;
  selectedPersonalityId?: string;
  lastMessages?: Record<string, string>;
  unreadCounts?: Record<string, number>;
}

export function AIChatList({ 
  onSelectPersonality, 
  selectedPersonalityId,
  lastMessages = {},
  unreadCounts = {}
}: AIChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPersonalities = AI_PERSONALITIES.filter(personality =>
    personality.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    personality.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getLastMessage = (personalityId: string) => {
    return lastMessages[personalityId] || "Start a conversation...";
  };

  const getUnreadCount = (personalityId: string) => {
    return unreadCounts[personalityId] || 0;
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          AI Wellness Buddies
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search personalities or specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {filteredPersonalities.map((personality) => {
            const isSelected = selectedPersonalityId === personality.id;
            const unreadCount = getUnreadCount(personality.id);
            const lastMessage = getLastMessage(personality.id);
            
            return (
              <div
                key={personality.id}
                onClick={() => onSelectPersonality(personality)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                  isSelected ? 'bg-muted' : ''
                }`}
              >
                {/* Avatar with personality color */}
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className={`${getPersonalityColor(personality.color)} text-white text-lg`}>
                      {personality.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                </div>

                {/* Chat content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">
                      {personality.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <Badge variant="default" className="text-xs px-2 py-0.5 min-w-[1.25rem] h-5">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        now
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-1">
                    {personality.description}
                  </p>
                  
                  <p className={`text-xs truncate ${
                    unreadCount > 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'
                  }`}>
                    {lastMessage}
                  </p>
                  
                  {/* Specialties tags */}
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {personality.specialties.slice(0, 2).map((specialty) => (
                      <Badge 
                        key={specialty} 
                        variant="outline" 
                        className="text-xs px-2 py-0"
                      >
                        {specialty}
                      </Badge>
                    ))}
                    {personality.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +{personality.specialties.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredPersonalities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No AI buddies found</p>
            <p className="text-xs">Try a different search term</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}