import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Visitor, visitors, initialGameState } from './GameState';
import { Castle } from './Castle';
import { VisitorChoice } from './VisitorChoice';
import { GameUI } from './GameUI';

export const InnerGatekeeper: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [currentVisitor, setCurrentVisitor] = useState<Visitor | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [visitorQueue, setVisitorQueue] = useState<Visitor[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  // Generate random visitor
  const generateRandomVisitor = useCallback((): Visitor => {
    const randomIndex = Math.floor(Math.random() * visitors.length);
    return visitors[randomIndex];
  }, []);

  // Initialize visitor queue
  const initializeVisitorQueue = useCallback(() => {
    const queue: Visitor[] = [];
    for (let i = 0; i < 5; i++) {
      queue.push(generateRandomVisitor());
    }
    setVisitorQueue(queue);
  }, [generateRandomVisitor]);

  // Get next visitor from queue
  const getNextVisitor = useCallback(() => {
    if (visitorQueue.length === 0) {
      initializeVisitorQueue();
      return;
    }

    const nextVisitor = visitorQueue[0];
    setCurrentVisitor(nextVisitor);
    setVisitorQueue(prev => {
      const newQueue = prev.slice(1);
      // Add a new visitor to maintain queue
      newQueue.push(generateRandomVisitor());
      return newQueue;
    });
  }, [visitorQueue, generateRandomVisitor, initializeVisitorQueue]);

  // Update weather based on castle health and inner peace
  const updateWeather = useCallback((health: number, peace: number) => {
    const average = (health + peace) / 2;
    if (average > 80) return 'sunny';
    if (average > 60) return 'cloudy';
    if (average > 30) return 'rainy';
    return 'stormy';
  }, []);

  // Update gatekeeper mood
  const updateGatekeeperMood = useCallback((health: number, peace: number) => {
    const average = (health + peace) / 2;
    if (average > 80) return 'peaceful';
    if (average > 60) return 'concerned';
    if (average > 40) return 'worried';
    if (average > 20) return 'stressed';
    return 'anxious';
  }, []);

  // Handle visitor choice
  const handleVisitorChoice = useCallback((choice: 'accept' | 'reject' | 'challenge') => {
    if (!currentVisitor) return;

    let healthChange = 0;
    let peaceChange = 0;
    let scoreChange = 0;
    let isCorrect = false;
    let feedbackMessage = '';

    switch (choice) {
      case 'accept':
        healthChange = currentVisitor.effects.accept.health;
        peaceChange = currentVisitor.effects.accept.peace;
        scoreChange = currentVisitor.effects.accept.score;
        isCorrect = currentVisitor.bestChoice === 'accept';
        feedbackMessage = currentVisitor.effects.accept.message;
        break;
      case 'reject':
        healthChange = currentVisitor.effects.reject.health;
        peaceChange = currentVisitor.effects.reject.peace;
        scoreChange = currentVisitor.effects.reject.score;
        isCorrect = currentVisitor.bestChoice === 'reject';
        feedbackMessage = currentVisitor.effects.reject.message;
        break;
      case 'challenge':
        healthChange = currentVisitor.effects.challenge.health;
        peaceChange = currentVisitor.effects.challenge.peace;
        scoreChange = currentVisitor.effects.challenge.score;
        isCorrect = currentVisitor.bestChoice === 'challenge';
        feedbackMessage = currentVisitor.effects.challenge.message;
        break;
    }

    // Bonus points for correct choice
    if (isCorrect) {
      scoreChange += 10;
      feedbackMessage = `✅ ${feedbackMessage}`;
    } else {
      feedbackMessage = `❌ ${feedbackMessage}`;
    }

    setGameState(prev => {
      const newHealth = Math.max(0, Math.min(100, prev.castleHealth + healthChange));
      const newPeace = Math.max(0, Math.min(100, prev.innerPeace + peaceChange));
      const newScore = Math.max(0, prev.score + scoreChange);
      const newTotalVisitors = prev.totalVisitors + 1;
      const newCorrectChoices = prev.correctChoices + (isCorrect ? 1 : 0);
      const newLevel = Math.floor(newTotalVisitors / 10) + 1;

      return {
        ...prev,
        castleHealth: newHealth,
        innerPeace: newPeace,
        score: newScore,
        totalVisitors: newTotalVisitors,
        correctChoices: newCorrectChoices,
        level: newLevel,
        weather: updateWeather(newHealth, newPeace),
        gatekeeperMood: updateGatekeeperMood(newHealth, newPeace),
      };
    });

    setFeedback(feedbackMessage);
    
    // Clear current visitor and show feedback
    setCurrentVisitor(null);

    // Show feedback for 2 seconds, then get next visitor
    setTimeout(() => {
      setFeedback('');
      if (!isPaused) {
        getNextVisitor();
      }
    }, 2000);
  }, [currentVisitor, isPaused, getNextVisitor, updateWeather, updateGatekeeperMood]);

  // Start game
  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameState(initialGameState);
    initializeVisitorQueue();
    setTimeout(() => {
      getNextVisitor();
    }, 1000);
  }, [initializeVisitorQueue, getNextVisitor]);

  // Restart game
  const restartGame = useCallback(() => {
    setGameState(initialGameState);
    setCurrentVisitor(null);
    setIsPaused(false);
    setFeedback('');
    setGameStarted(false);
    setVisitorQueue([]);
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      const newPaused = !prev;
      if (!newPaused && !currentVisitor && feedback === '') {
        // Resume and get next visitor if none is current
        setTimeout(() => getNextVisitor(), 500);
      }
      return newPaused;
    });
  }, [currentVisitor, feedback, getNextVisitor]);

  // Auto-generate visitors when game is running
  useEffect(() => {
    if (!gameStarted || isPaused || currentVisitor || feedback || 
        gameState.castleHealth <= 0 || gameState.innerPeace <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      getNextVisitor();
    }, 3000); // 3 seconds between visitors

    return () => clearTimeout(timer);
  }, [gameStarted, isPaused, currentVisitor, feedback, gameState.castleHealth, gameState.innerPeace, getNextVisitor]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-100 to-transparent"></div>
      
      {/* Mountains */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-400 to-gray-300 opacity-30" 
           style={{
             clipPath: 'polygon(0 100%, 20% 60%, 40% 80%, 60% 40%, 80% 70%, 100% 50%, 100% 100%)'
           }}>
      </div>

      {!gameStarted ? (
        /* Start Screen */
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-4 text-center shadow-2xl">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              🏰 Inner Gatekeeper
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Welcome, Guardian! You are the protector of your mind castle. 
              Thoughts, feelings, and experiences will approach your gates. 
              Choose wisely whether to accept, reject, or challenge them.
            </p>
            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span className="text-gray-700"><strong>Accept:</strong> Welcome positive thoughts and beneficial experiences</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">❌</span>
                <span className="text-gray-700"><strong>Reject:</strong> Turn away harmful or destructive influences</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚔️</span>
                <span className="text-gray-700"><strong>Challenge:</strong> Face difficult thoughts with courage and wisdom</span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Goal:</strong> Maintain your castle's health and inner peace. 
                Make wise choices to protect your mental wellbeing while growing stronger.
              </p>
            </div>
            <button
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🚀 Begin Your Journey
            </button>
          </div>
        </div>
      ) : (
        /* Game Screen */
        <>
          {/* Game UI */}
          <GameUI 
            gameState={gameState}
            isPaused={isPaused}
            onPause={togglePause}
            onRestart={restartGame}
            feedback={feedback}
          />

          {/* Castle */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <Castle 
              health={gameState.castleHealth}
              weather={gameState.weather}
              gatekeeperMood={gameState.gatekeeperMood}
            />
          </div>

          {/* Visitor Choice */}
          {currentVisitor && !isPaused && (
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
              <VisitorChoice 
                visitor={currentVisitor}
                onChoice={handleVisitorChoice}
              />
            </div>
          )}

          {/* Visitor Queue Indicator */}
          {visitorQueue.length > 0 && (
            <div className="absolute top-32 right-4 bg-black/40 backdrop-blur-sm rounded-lg p-3">
              <h3 className="text-white font-semibold mb-2">Approaching:</h3>
              <div className="space-y-1">
                {visitorQueue.slice(0, 3).map((visitor, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-white/80">
                    <span>{visitor.emoji}</span>
                    <span className="truncate max-w-24">{visitor.name}</span>
                  </div>
                ))}
                {visitorQueue.length > 3 && (
                  <div className="text-xs text-white/60">
                    +{visitorQueue.length - 3} more...
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};