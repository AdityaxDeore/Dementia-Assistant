"use client";

import { useState, useEffect } from "react";

interface CastleProps {
  health: number;
  weather: string;
  gatekeeperMood: string;
}

export function Castle({ health, weather, gatekeeperMood }: CastleProps) {
  const [cracks, setCracks] = useState<Array<{id: string, x: number, y: number, severity: number}>>([]);

  // Update castle damage visualization
  useEffect(() => {
    const healthPercent = health;
    const numCracks = Math.floor((100 - healthPercent) / 10);
    
    if (numCracks > cracks.length) {
      // Add new cracks
      const newCracks = [];
      for (let i = cracks.length; i < numCracks; i++) {
        newCracks.push({
          id: `crack-${i}`,
          x: 20 + Math.random() * 60, // Random position on castle
          y: 30 + Math.random() * 50,
          severity: Math.random() * 0.5 + 0.5 // 0.5 to 1.0
        });
      }
      setCracks(prev => [...prev, ...newCracks]);
    } else if (numCracks < cracks.length) {
      // Remove cracks (healing)
      setCracks(prev => prev.slice(0, numCracks));
    }
  }, [health, cracks.length]);

  const getWeatherEffects = () => {
    switch (weather) {
      case 'sunny':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 right-8 w-16 h-16 bg-yellow-300 rounded-full opacity-80 animate-pulse"></div>
            {/* Sun rays */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-8 right-12 w-0.5 h-8 bg-yellow-200 origin-bottom animate-pulse"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                  transformOrigin: 'center bottom'
                }}
              ></div>
            ))}
          </div>
        );
      case 'cloudy':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-gray-300 rounded-full opacity-60 animate-float"
                style={{
                  top: `${10 + i * 5}%`,
                  left: `${20 + i * 15}%`,
                  width: `${60 + i * 10}px`,
                  height: `${30 + i * 5}px`,
                  animationDelay: `${i * 0.5}s`
                }}
              ></div>
            ))}
          </div>
        );
      case 'rainy':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-4 bg-blue-300 opacity-60 animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
              ></div>
            ))}
          </div>
        );
      case 'stormy':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Heavy rain */}
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-6 bg-blue-400 opacity-80 animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1}s`,
                  animationDuration: `${0.3 + Math.random() * 0.3}s`
                }}
              ></div>
            ))}
            {/* Lightning */}
            <div className="absolute inset-0 bg-white opacity-0 animate-lightning"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const getGatekeeperExpression = () => {
    switch (gatekeeperMood) {
      case 'peaceful':
        return '😌';
      case 'concerned':
        return '😟';
      case 'worried':
        return '😰';
      case 'stressed':
        return '😨';
      case 'anxious':
        return '😱';
      default:
        return '😐';
    }
  };

  const getCastleColor = () => {
    if (health >= 80) return 'text-stone-600';
    if (health >= 60) return 'text-stone-700';
    if (health >= 40) return 'text-stone-800';
    if (health >= 20) return 'text-red-900';
    return 'text-red-950';
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-2xl overflow-hidden">
      {/* Weather Effects */}
      {getWeatherEffects()}
      
      {/* Background landscape */}
      <div className="absolute bottom-0 w-full h-32 bg-green-300 dark:bg-green-800"></div>
      
      {/* Castle Structure */}
      <div className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 ${getCastleColor()}`}>
        {/* Castle base */}
        <div className="relative">
          {/* Main castle body */}
          <div className="w-48 h-32 bg-stone-400 dark:bg-stone-600 rounded-t-lg relative">
            {/* Castle gate */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-amber-700 dark:bg-amber-800 rounded-t-full">
              {/* Gate details */}
              <div className="absolute inset-2 bg-amber-800 dark:bg-amber-900 rounded-t-full"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-600 rounded-full"></div>
            </div>
            
            {/* Windows */}
            <div className="absolute top-4 left-4 w-3 h-4 bg-yellow-200 dark:bg-yellow-400 rounded-sm"></div>
            <div className="absolute top-4 right-4 w-3 h-4 bg-yellow-200 dark:bg-yellow-400 rounded-sm"></div>
            <div className="absolute top-12 left-8 w-3 h-4 bg-yellow-200 dark:bg-yellow-400 rounded-sm"></div>
            <div className="absolute top-12 right-8 w-3 h-4 bg-yellow-200 dark:bg-yellow-400 rounded-sm"></div>
          </div>
          
          {/* Castle towers */}
          <div className="absolute -top-8 left-2 w-8 h-16 bg-stone-500 dark:bg-stone-700 rounded-t-lg">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-red-600 dark:bg-red-700 rounded-t-full"></div>
          </div>
          <div className="absolute -top-8 right-2 w-8 h-16 bg-stone-500 dark:bg-stone-700 rounded-t-lg">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-red-600 dark:bg-red-700 rounded-t-full"></div>
          </div>
          
          {/* Central tower */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-12 h-20 bg-stone-500 dark:bg-stone-700 rounded-t-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-red-600 dark:bg-red-700 rounded-t-full"></div>
            {/* Inner Peace indicator - simplified for now */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-2 border-cyan-400">
              <div 
                className="w-full h-full rounded-full bg-cyan-400 transition-all duration-1000"
                style={{ 
                  opacity: 0.5,
                  transform: 'scale(0.5)'
                }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Damage cracks */}
        {cracks.map(crack => (
          <div
            key={crack.id}
            className="absolute bg-black opacity-60 animate-pulse"
            style={{
              left: `${crack.x}%`,
              top: `${crack.y}%`,
              width: `${crack.severity * 3}px`,
              height: `${crack.severity * 20}px`,
              transform: `rotate(${crack.severity * 30}deg)`
            }}
          ></div>
        ))}
      </div>
      
      {/* Gatekeeper character */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="relative">
          {/* Character body */}
          <div className="w-8 h-12 bg-blue-500 dark:bg-blue-600 rounded-t-full mx-auto"></div>
          {/* Character head */}
          <div className="w-6 h-6 bg-pink-200 dark:bg-pink-300 rounded-full mx-auto -mt-2 relative">
            <div className="absolute inset-1 text-xs flex items-center justify-center">
              {getGatekeeperExpression()}
            </div>
          </div>
          {/* Character arms */}
          <div className="absolute top-2 -left-2 w-3 h-6 bg-pink-200 dark:bg-pink-300 rounded-full transform -rotate-12"></div>
          <div className="absolute top-2 -right-2 w-3 h-6 bg-pink-200 dark:bg-pink-300 rounded-full transform rotate-12"></div>
          {/* Character legs */}
          <div className="absolute top-8 left-1 w-2 h-6 bg-blue-800 dark:bg-blue-900 rounded-full"></div>
          <div className="absolute top-8 right-1 w-2 h-6 bg-blue-800 dark:bg-blue-900 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}