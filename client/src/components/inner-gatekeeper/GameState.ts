export interface GameState {
  castleHealth: number; // 0-100
  innerPeace: number; // 0-100
  weather: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  gatekeeperMood: 'peaceful' | 'concerned' | 'worried' | 'stressed' | 'anxious';
  score: number;
  level: number;
  totalVisitors: number;
  correctChoices: number;
}

export interface Visitor {
  id: string;
  type: 'positive' | 'negative' | 'complex';
  name: string;
  description: string;
  emoji: string;
  color: string;
  effects: {
    accept: { health: number; peace: number; score: number; message: string };
    reject: { health: number; peace: number; score: number; message: string };
    challenge: { health: number; peace: number; score: number; message: string; difficulty: number };
  };
  bestChoice: 'accept' | 'reject' | 'challenge';
  insight?: string; // Appears after making choice
}

export const visitors: Visitor[] = [
  // Positive Visitors
  {
    id: 'encouragement',
    type: 'positive',
    name: 'Encouragement',
    description: 'A warm, supportive thought that lifts your spirits',
    emoji: '✨',
    color: '#FFD700',
    effects: {
      accept: { health: 15, peace: 20, score: 10, message: 'Your castle glows with renewed strength!' },
      reject: { health: -5, peace: -10, score: 0, message: 'Pushing away support weakens your foundation.' },
      challenge: { health: 10, peace: 15, score: 15, message: 'You embrace the encouragement fully!', difficulty: 2 }
    },
    bestChoice: 'accept',
    insight: 'Accepting encouragement builds resilience and self-worth.'
  },
  {
    id: 'joy',
    type: 'positive',
    name: 'Joy',
    description: 'Pure happiness seeking to brighten your day',
    emoji: '🌈',
    color: '#FF69B4',
    effects: {
      accept: { health: 10, peace: 25, score: 10, message: 'Rainbow light fills your castle with warmth!' },
      reject: { health: 0, peace: -15, score: 0, message: 'Rejecting joy dims your inner light.' },
      challenge: { health: 5, peace: 20, score: 12, message: 'You find joy in simple moments!', difficulty: 1 }
    },
    bestChoice: 'accept',
    insight: 'Joy is medicine for the soul - embrace it when it comes.'
  },
  {
    id: 'gratitude',
    type: 'positive',
    name: 'Gratitude',
    description: 'Appreciation for the good things in life',
    emoji: '🙏',
    color: '#32CD32',
    effects: {
      accept: { health: 12, peace: 18, score: 8, message: 'Gratitude strengthens your castle walls!' },
      reject: { health: -3, peace: -8, score: 0, message: 'Dismissing gratitude hardens your heart.' },
      challenge: { health: 8, peace: 15, score: 12, message: 'You cultivate deeper appreciation!', difficulty: 2 }
    },
    bestChoice: 'accept',
    insight: 'Gratitude transforms ordinary moments into blessings.'
  },

  // Negative Visitors
  {
    id: 'self-doubt',
    type: 'negative',
    name: 'Self-Doubt',
    description: 'Dark whispers questioning your worth and abilities',
    emoji: '🌑',
    color: '#2F2F2F',
    effects: {
      accept: { health: -20, peace: -25, score: 0, message: 'Dark cracks spread across your castle walls.' },
      reject: { health: 5, peace: 10, score: 5, message: 'You stand firm against the darkness!' },
      challenge: { health: 15, peace: 20, score: 15, message: 'You transform doubt into determination!', difficulty: 3 }
    },
    bestChoice: 'reject',
    insight: 'Self-doubt is often louder than it is true. Question the questioner.'
  },
  {
    id: 'anger',
    type: 'negative',
    name: 'Anger',
    description: 'Burning rage that threatens to consume everything',
    emoji: '🔥',
    color: '#DC143C',
    effects: {
      accept: { health: -25, peace: -30, score: 0, message: 'Flames scorch your castle walls!' },
      reject: { health: 0, peace: 5, score: 3, message: 'You cool the flames before they spread.' },
      challenge: { health: 10, peace: 15, score: 20, message: 'You channel anger into positive action!', difficulty: 4 }
    },
    bestChoice: 'challenge',
    insight: 'Anger is often pain wearing a mask. Look beneath the surface.'
  },
  {
    id: 'guilt',
    type: 'negative',
    name: 'Guilt',
    description: 'Heavy burden of past mistakes weighing you down',
    emoji: '⚖️',
    color: '#696969',
    effects: {
      accept: { health: -15, peace: -20, score: 0, message: 'Heavy chains bind your castle.' },
      reject: { health: 3, peace: 8, score: 5, message: 'You release the burden from your shoulders.' },
      challenge: { health: 12, peace: 18, score: 15, message: 'You find forgiveness and learn from mistakes!', difficulty: 3 }
    },
    bestChoice: 'challenge',
    insight: 'Guilt should teach, not torture. Learn the lesson and let go.'
  },

  // Complex Visitors
  {
    id: 'criticism',
    type: 'complex',
    name: 'Criticism',
    description: 'Sharp words that might hide valuable insights',
    emoji: '💎',
    color: '#4169E1',
    effects: {
      accept: { health: -10, peace: -15, score: 0, message: 'Harsh words cut into your walls.' },
      reject: { health: -5, peace: -5, score: 0, message: 'You miss potential growth.' },
      challenge: { health: 10, peace: 15, score: 25, message: 'You transform criticism into wisdom!', difficulty: 3 }
    },
    bestChoice: 'challenge',
    insight: 'Not all criticism is attack. Some comes wrapped in care.'
  },
  {
    id: 'worry',
    type: 'complex',
    name: 'Worry',
    description: 'Anxious thoughts about uncertain futures',
    emoji: '🌪️',
    color: '#9370DB',
    effects: {
      accept: { health: -12, peace: -18, score: 0, message: 'Worry clouds gather over your castle.' },
      reject: { health: -8, peace: -10, score: 0, message: 'Ignoring worry doesn\'t make it disappear.' },
      challenge: { health: 8, peace: 20, score: 20, message: 'You find peace in uncertainty!', difficulty: 4 }
    },
    bestChoice: 'challenge',
    insight: 'Worry is interest paid on trouble before it comes due.'
  },
  {
    id: 'loneliness',
    type: 'complex',
    name: 'Loneliness',
    description: 'The ache of disconnection from others',
    emoji: '🌙',
    color: '#483D8B',
    effects: {
      accept: { health: -8, peace: -12, score: 0, message: 'Shadows lengthen around your castle.' },
      reject: { health: -10, peace: -8, score: 0, message: 'Isolation deepens your solitude.' },
      challenge: { health: 12, peace: 18, score: 18, message: 'You find connection within yourself!', difficulty: 3 }
    },
    bestChoice: 'challenge',
    insight: 'Loneliness is not about being alone, but feeling disconnected.'
  }
];

// Export initial game state
export const initialGameState: GameState = {
  castleHealth: 100,
  innerPeace: 100,
  weather: 'sunny',
  gatekeeperMood: 'peaceful',
  score: 0,
  level: 1,
  totalVisitors: 0,
  correctChoices: 0
};

export const getWeatherFromHealth = (health: number, peace: number): GameState['weather'] => {
  const overall = (health + peace) / 2;
  if (overall >= 80) return 'sunny';
  if (overall >= 60) return 'cloudy';
  if (overall >= 40) return 'rainy';
  return 'stormy';
};

export const getGatekeeperMood = (health: number, peace: number): GameState['gatekeeperMood'] => {
  const overall = (health + peace) / 2;
  if (overall >= 80) return 'peaceful';
  if (overall >= 60) return 'concerned';
  if (overall >= 40) return 'worried';
  if (overall >= 20) return 'stressed';
  return 'anxious';
};