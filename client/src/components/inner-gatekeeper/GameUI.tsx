import React from 'react';
import { GameState } from './GameState';

interface GameUIProps {
  gameState: GameState;
  isPaused: boolean;
  onPause: () => void;
  onRestart: () => void;
  feedback: string;
}

export const GameUI: React.FC<GameUIProps> = ({
  gameState,
  isPaused,
  onPause,
  onRestart,
  feedback
}) => {
  const getHealthColor = (health: number) => {
    if (health > 70) return '#4ade80'; // green
    if (health > 40) return '#fbbf24'; // yellow
    return '#ef4444'; // red
  };

  const getPeaceColor = (peace: number) => {
    if (peace > 70) return '#60a5fa'; // blue
    if (peace > 40) return '#a78bfa'; // purple
    return '#f87171'; // red
  };

  const getWeatherEmoji = (weather: string) => {
    switch (weather) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'stormy': return '⛈️';
      default: return '☀️';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'peaceful': return '😌';
      case 'concerned': return '😐';
      case 'worried': return '😟';
      case 'stressed': return '😰';
      case 'anxious': return '😨';
      default: return '😌';
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/20 to-transparent p-4">
      {/* Top Bar */}
      <div className="flex justify-between items-start mb-4">
        {/* Health and Peace Bars */}
        <div className="space-y-2">
          {/* Castle Health */}
          <div className="flex items-center space-x-2">
            <span className="text-white font-semibold min-w-[100px]">🏰 Castle:</span>
            <div className="w-32 h-4 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500 rounded-full"
                style={{ 
                  width: `${gameState.castleHealth}%`,
                  backgroundColor: getHealthColor(gameState.castleHealth)
                }}
              />
            </div>
            <span className="text-white font-mono text-sm">{gameState.castleHealth}%</span>
          </div>

          {/* Inner Peace */}
          <div className="flex items-center space-x-2">
            <span className="text-white font-semibold min-w-[100px]">🧘 Peace:</span>
            <div className="w-32 h-4 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500 rounded-full"
                style={{ 
                  width: `${gameState.innerPeace}%`,
                  backgroundColor: getPeaceColor(gameState.innerPeace)
                }}
              />
            </div>
            <span className="text-white font-mono text-sm">{gameState.innerPeace}%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="text-right space-y-1">
          <div className="text-white text-sm">
            <span className="font-semibold">Score:</span> {gameState.score}
          </div>
          <div className="text-white text-sm">
            <span className="font-semibold">Level:</span> {gameState.level}
          </div>
          <div className="text-white text-sm">
            <span className="font-semibold">Visitors:</span> {gameState.totalVisitors}
          </div>
          <div className="text-white text-sm">
            <span className="font-semibold">Accuracy:</span> {
              gameState.totalVisitors > 0 
                ? Math.round((gameState.correctChoices / gameState.totalVisitors) * 100)
                : 0
            }%
          </div>
        </div>
      </div>

      {/* Weather and Mood Indicator */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-black/40 rounded-lg px-3 py-1">
            <span className="text-2xl">{getWeatherEmoji(gameState.weather)}</span>
            <span className="text-white text-sm capitalize">{gameState.weather}</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-black/40 rounded-lg px-3 py-1">
            <span className="text-2xl">{getMoodEmoji(gameState.gatekeeperMood)}</span>
            <span className="text-white text-sm capitalize">{gameState.gatekeeperMood}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onPause}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 backdrop-blur-sm"
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button
            onClick={onRestart}
            className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 backdrop-blur-sm"
          >
            🔄 Restart
          </button>
        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-black/80 text-white px-6 py-3 rounded-lg backdrop-blur-sm animate-pulse">
          {feedback}
        </div>
      )}

      {/* Game Over Overlay */}
      {(gameState.castleHealth <= 0 || gameState.innerPeace <= 0) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-red-600">Game Over</h2>
            <div className="space-y-2 mb-6">
              <p className="text-gray-700">Final Score: <span className="font-bold">{gameState.score}</span></p>
              <p className="text-gray-700">Level Reached: <span className="font-bold">{gameState.level}</span></p>
              <p className="text-gray-700">Visitors Handled: <span className="font-bold">{gameState.totalVisitors}</span></p>
              <p className="text-gray-700">
                Accuracy: <span className="font-bold">
                  {gameState.totalVisitors > 0 
                    ? Math.round((gameState.correctChoices / gameState.totalVisitors) * 100)
                    : 0}%
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={onRestart}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Victory Overlay */}
      {gameState.level > 10 && gameState.castleHealth > 80 && gameState.innerPeace > 80 && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-green-600">Victory! 🎉</h2>
            <p className="text-gray-700 mb-4">
              You've mastered the art of inner gatekeeping!
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-gray-700">Final Score: <span className="font-bold">{gameState.score}</span></p>
              <p className="text-gray-700">Level Reached: <span className="font-bold">{gameState.level}</span></p>
              <p className="text-gray-700">Perfect Balance Achieved! 🧘‍♂️</p>
            </div>
            <button
              onClick={onRestart}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              🌟 Play Again
            </button>
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && gameState.castleHealth > 0 && gameState.innerPeace > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Game Paused</h2>
            <p className="text-gray-600 mb-6">Take a moment to breathe...</p>
            <div className="space-y-2">
              <button
                onClick={onPause}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                ▶️ Resume Game
              </button>
              <button
                onClick={onRestart}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                🔄 Restart Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};