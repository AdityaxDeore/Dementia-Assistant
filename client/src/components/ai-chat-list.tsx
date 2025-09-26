import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
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
      blue: 'bg-gradient-to-br from-sky-400 to-blue-500',
      orange: 'bg-gradient-to-br from-amber-400 to-orange-500',
      purple: 'bg-gradient-to-br from-violet-400 to-purple-500',
      indigo: 'bg-gradient-to-br from-indigo-400 to-blue-600',
      green: 'bg-gradient-to-br from-emerald-400 to-green-500',
    };
    return colors[color as keyof typeof colors] || 'bg-gradient-to-br from-sky-400 to-blue-500';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <p className="text-sm text-gray-500">Choose your AI buddy</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search buddies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>
      </div>
      
      {/* Scrollable Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="p-2">
          {filteredPersonalities.map((personality) => {
            const isSelected = selectedPersonalityId === personality.id;
            const unreadCount = getUnreadCount(personality.id);
            const lastMessage = getLastMessage(personality.id);
            
            return (
              <div
                key={personality.id}
                onClick={() => onSelectPersonality(personality)}
                className={`flex items-center gap-4 p-4 m-2 cursor-pointer transition-all duration-200 rounded-xl hover:bg-gray-50 active:scale-[0.98] ${
                  isSelected ? 'bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md border border-indigo-100' : ''
                }`}
              >
                {/* Avatar with status */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-14 h-14 ring-2 ring-white shadow-md">
                    <AvatarFallback className={`${getPersonalityColor(personality.color)} text-white text-xl font-semibold`}>
                      {personality.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Chat content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {personality.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {unreadCount > 0 && (
                        <Badge className="bg-indigo-500 text-white text-xs px-2 py-1 min-w-[1.25rem] h-6">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400 font-medium">
                        active
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                    {personality.description}
                  </p>
                  
                  <p className={`text-sm truncate mb-2 ${
                    unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'
                  }`}>
                    {lastMessage}
                  </p>
                  
                  {/* Specialties tags */}
                  <div className="flex gap-1 flex-wrap">
                    {personality.specialties.slice(0, 2).map((specialty) => (
                      <Badge 
                        key={specialty} 
                        variant="outline" 
                        className="text-xs px-2 py-0.5 bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        {specialty}
                      </Badge>
                    ))}
                    {personality.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-white border-gray-200 text-gray-600">
                        +{personality.specialties.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Empty state */}
        {filteredPersonalities.length === 0 && (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">No buddies found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}