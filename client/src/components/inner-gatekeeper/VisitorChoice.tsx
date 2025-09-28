"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Visitor } from "./GameState";
import { CheckCircle, XCircle, HelpCircle, Lightbulb } from "lucide-react";

interface VisitorChoiceProps {
  visitor: Visitor;
  onChoice: (choice: 'accept' | 'reject' | 'challenge') => void;
}

export function VisitorChoice({ visitor, onChoice }: VisitorChoiceProps) {
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);

  const getChoicePreview = (choice: 'accept' | 'reject' | 'challenge') => {
    const effect = visitor.effects[choice];
    if (!effect) return null;

    return (
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap z-10">
        <div className="flex items-center gap-2">
          <span>Castle: {effect.health > 0 ? '+' : ''}{effect.health}</span>
          <span>Peace: {effect.peace > 0 ? '+' : ''}{effect.peace}</span>
        </div>
        <div className="text-center mt-1 text-opacity-80">{effect.message}</div>
      </div>
    );
  };

  const getChoiceColor = (choice: 'accept' | 'reject' | 'challenge') => {
    switch (choice) {
      case 'accept':
        return visitor.type === 'positive' 
          ? 'from-green-400 to-green-600 hover:from-green-500 hover:to-green-700' 
          : 'from-red-400 to-red-600 hover:from-red-500 hover:to-red-700';
      case 'reject':
        return visitor.type === 'negative' 
          ? 'from-green-400 to-green-600 hover:from-green-500 hover:to-green-700' 
          : 'from-red-400 to-red-600 hover:from-red-500 hover:to-red-700';
      case 'challenge':
        return 'from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getChallengeInfo = () => {
    if (visitor.type !== 'complex') return null;
    
    const difficulty = visitor.effects.challenge.difficulty || 1;
    const stars = '⭐'.repeat(difficulty);
    
    return (
      <div className="text-xs text-center text-blue-600 dark:text-blue-400 mt-1">
        Difficulty: {stars}
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-xl bg-white dark:bg-gray-900">
      <CardContent className="p-6">
        {/* Visitor Information */}
        <div className="text-center mb-6">
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg border-4 border-white"
            style={{ backgroundColor: visitor.color }}
          >
            {visitor.emoji}
          </div>
          <h3 className="text-xl font-bold mb-2">{visitor.name}</h3>
          <p className="text-muted-foreground text-sm mb-4">{visitor.description}</p>
          
          {/* Visitor type badge */}
          <Badge 
            variant="secondary"
            className={cn(
              "text-xs",
              visitor.type === 'positive' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
              visitor.type === 'negative' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
              visitor.type === 'complex' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            )}
          >
            {visitor.type === 'positive' && '✨ Positive'}
            {visitor.type === 'negative' && '🌑 Negative'}
            {visitor.type === 'complex' && '💎 Complex'}
          </Badge>
        </div>

        {/* Choice Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Accept Button */}
            <div className="relative">
              <Button
                onClick={() => onChoice('accept')}
                onMouseEnter={() => setHoveredChoice('accept')}
                onMouseLeave={() => setHoveredChoice(null)}
                className={cn(
                  "w-full h-16 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95",
                  "bg-gradient-to-r shadow-lg",
                  getChoiceColor('accept')
                )}
              >
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-6 h-6 mb-1" />
                  <span>ACCEPT</span>
                </div>
              </Button>
              {hoveredChoice === 'accept' && getChoicePreview('accept')}
            </div>

            {/* Reject Button */}
            <div className="relative">
              <Button
                onClick={() => onChoice('reject')}
                onMouseEnter={() => setHoveredChoice('reject')}
                onMouseLeave={() => setHoveredChoice(null)}
                className={cn(
                  "w-full h-16 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95",
                  "bg-gradient-to-r shadow-lg",
                  getChoiceColor('reject')
                )}
              >
                <div className="flex flex-col items-center">
                  <XCircle className="w-6 h-6 mb-1" />
                  <span>REJECT</span>
                </div>
              </Button>
              {hoveredChoice === 'reject' && getChoicePreview('reject')}
            </div>
          </div>

          {/* Challenge Button (for complex visitors only) */}
          {visitor.type === 'complex' && (
            <div className="relative">
              <Button
                onClick={() => onChoice('challenge')}
                onMouseEnter={() => setHoveredChoice('challenge')}
                onMouseLeave={() => setHoveredChoice(null)}
                className={cn(
                  "w-full h-16 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95",
                  "bg-gradient-to-r shadow-lg",
                  getChoiceColor('challenge')
                )}
              >
                <div className="flex flex-col items-center">
                  <HelpCircle className="w-6 h-6 mb-1" />
                  <span>CHALLENGE</span>
                </div>
              </Button>
              {hoveredChoice === 'challenge' && getChoicePreview('challenge')}
              {getChallengeInfo()}
            </div>
          )}
        </div>

        {/* Choice Descriptions */}
        <div className="mt-6 text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span><strong>Accept:</strong> Let this thought enter your mind</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span><strong>Reject:</strong> Push this thought away</span>
          </div>
          {visitor.type === 'complex' && (
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span><strong>Challenge:</strong> Use mindfulness to transform this thought</span>
            </div>
          )}
        </div>

        {/* Wisdom Hint */}
        {visitor.insight && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300 italic">
                💡 {visitor.insight}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}