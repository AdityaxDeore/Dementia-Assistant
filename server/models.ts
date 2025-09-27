import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// User Interface and Model
export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    darkMode: boolean;
    notifications: boolean;
    privacy: 'public' | 'friends' | 'private';
  };
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  dateOfBirth: {
    type: Date
  },
  phoneNumber: {
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
    },
    relationship: {
      type: String,
      trim: true
    }
  },
  preferences: {
    darkMode: {
      type: Boolean,
      default: false
    },
    notifications: {
      type: Boolean,
      default: true
    },
    privacy: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'private'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);

// Mood Entry Interface and Model
export interface IMoodEntry extends Document {
  _id: string;
  userId: string;
  moodValue: number; // 1-5 scale
  date: Date;
  notes?: string;
  emotions?: string[]; // Array of emotion tags
  triggers?: string[]; // What triggered this mood
  copingStrategies?: string[]; // What helped
  energy: number; // 1-5 scale
  sleep: number; // Hours of sleep
  stress: number; // 1-5 scale
  createdAt: Date;
  updatedAt: Date;
}

const moodEntrySchema = new Schema<IMoodEntry>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  moodValue: {
    type: Number,
    required: [true, 'Mood value is required'],
    min: [1, 'Mood value must be between 1 and 5'],
    max: [5, 'Mood value must be between 1 and 5']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    trim: true
  },
  emotions: [{
    type: String,
    trim: true
  }],
  triggers: [{
    type: String,
    trim: true
  }],
  copingStrategies: [{
    type: String,
    trim: true
  }],
  energy: {
    type: Number,
    min: [1, 'Energy level must be between 1 and 5'],
    max: [5, 'Energy level must be between 1 and 5'],
    default: 3
  },
  sleep: {
    type: Number,
    min: [0, 'Sleep hours cannot be negative'],
    max: [24, 'Sleep hours cannot exceed 24'],
    default: 8
  },
  stress: {
    type: Number,
    min: [1, 'Stress level must be between 1 and 5'],
    max: [5, 'Stress level must be between 1 and 5'],
    default: 3
  }
}, {
  timestamps: true
});

// Compound index for user and date (unique constraint)
moodEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export const MoodEntry = mongoose.model<IMoodEntry>('MoodEntry', moodEntrySchema);

// Goal Interface and Model
export interface IGoal extends Document {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'wellness' | 'academic' | 'personal' | 'social' | 'career';
  priority: 'low' | 'medium' | 'high';
  progress: number; // 0-100
  isCompleted: boolean;
  targetDate?: Date;
  milestones: {
    title: string;
    isCompleted: boolean;
    completedAt?: Date;
  }[];
  tags: string[];
  reminders: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time?: string; // HH:MM format
    enabled: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true,
    maxlength: [200, 'Goal title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Goal description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['wellness', 'academic', 'personal', 'social', 'career'],
    default: 'personal'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  progress: {
    type: Number,
    min: [0, 'Progress cannot be negative'],
    max: [100, 'Progress cannot exceed 100'],
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  targetDate: {
    type: Date
  },
  milestones: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  reminders: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    time: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
    },
    enabled: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

export const Goal = mongoose.model<IGoal>('Goal', goalSchema);

// Journal Entry Interface and Model
export interface IJournalEntry extends Document {
  _id: string;
  userId: string;
  title: string;
  content: string;
  mood?: number; // 1-5 scale
  tags: string[];
  isPrivate: boolean;
  emotions: string[];
  gratitude?: string[];
  concerns?: string[];
  achievements?: string[];
  tomorrowGoals?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const journalEntrySchema = new Schema<IJournalEntry>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Journal title is required'],
    trim: true,
    maxlength: [200, 'Journal title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Journal content is required'],
    trim: true,
    maxlength: [10000, 'Journal content cannot exceed 10000 characters']
  },
  mood: {
    type: Number,
    min: [1, 'Mood value must be between 1 and 5'],
    max: [5, 'Mood value must be between 1 and 5']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPrivate: {
    type: Boolean,
    default: true
  },
  emotions: [{
    type: String,
    trim: true
  }],
  gratitude: [{
    type: String,
    trim: true
  }],
  concerns: [{
    type: String,
    trim: true
  }],
  achievements: [{
    type: String,
    trim: true
  }],
  tomorrowGoals: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

export const JournalEntry = mongoose.model<IJournalEntry>('JournalEntry', journalEntrySchema);

// Crisis Report Interface and Model
export interface ICrisisReport extends Document {
  _id: string;
  userId?: string; // Optional for anonymous reports
  type: 'emergency' | 'ragging' | 'harassment' | 'mental_health' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location?: string;
  isAnonymous: boolean;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string; // Admin/counselor ID
  followUpRequired: boolean;
  resolution?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    emergencyContact?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const crisisReportSchema = new Schema<ICrisisReport>({
  userId: {
    type: String,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['emergency', 'ragging', 'harassment', 'mental_health', 'other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  location: {
    type: String,
    trim: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed'],
    default: 'pending'
  },
  assignedTo: {
    type: String,
    ref: 'User'
  },
  followUpRequired: {
    type: Boolean,
    default: true
  },
  resolution: {
    type: String,
    trim: true
  },
  contactInfo: {
    phone: {
      type: String,
      match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    emergencyContact: {
      type: String
    }
  }
}, {
  timestamps: true
});

export const CrisisReport = mongoose.model<ICrisisReport>('CrisisReport', crisisReportSchema);

// Reaction Interface and Model
export interface IReaction extends Document {
  _id: string;
  userId: string;
  targetType: 'post' | 'comment' | 'journal' | 'resource';
  targetId: string;
  type: 'like' | 'heart' | 'helpful' | 'support' | 'thumbsup';
  createdAt: Date;
}

const reactionSchema = new Schema<IReaction>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  targetType: {
    type: String,
    required: true,
    enum: ['post', 'comment', 'journal', 'resource']
  },
  targetId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['like', 'heart', 'helpful', 'support', 'thumbsup'],
    default: 'like'
  }
}, {
  timestamps: true
});

// Compound index for user, target, and type (unique constraint)
reactionSchema.index({ userId: 1, targetType: 1, targetId: 1, type: 1 }, { unique: true });

export const Reaction = mongoose.model<IReaction>('Reaction', reactionSchema);

// Reaction Streak Interface and Model
export interface IReactionStreak extends Document {
  _id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastReactionDate: Date;
  totalReactions: number;
  reactionsByType: {
    like: number;
    heart: number;
    helpful: number;
    support: number;
    thumbsup: number;
  };
  weeklyReactions: number;
  monthlyReactions: number;
  streakResetDate?: Date;
  achievements: {
    firstReaction: boolean;
    streak3Days: boolean;
    streak7Days: boolean;
    streak30Days: boolean;
    streak100Days: boolean;
    socialButterflyWeekly: boolean; // 50+ reactions in a week
    helpfulMember: boolean; // 100+ helpful reactions
    supportiveUser: boolean; // 100+ support reactions
  };
  createdAt: Date;
  updatedAt: Date;
}

const reactionStreakSchema = new Schema<IReactionStreak>({
  userId: {
    type: String,
    required: true,
    unique: true,
    ref: 'User'
  },
  currentStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  longestStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastReactionDate: {
    type: Date
  },
  totalReactions: {
    type: Number,
    default: 0,
    min: 0
  },
  reactionsByType: {
    like: {
      type: Number,
      default: 0,
      min: 0
    },
    heart: {
      type: Number,
      default: 0,
      min: 0
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0
    },
    support: {
      type: Number,
      default: 0,
      min: 0
    },
    thumbsup: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  weeklyReactions: {
    type: Number,
    default: 0,
    min: 0
  },
  monthlyReactions: {
    type: Number,
    default: 0,
    min: 0
  },
  streakResetDate: {
    type: Date
  },
  achievements: {
    firstReaction: {
      type: Boolean,
      default: false
    },
    streak3Days: {
      type: Boolean,
      default: false
    },
    streak7Days: {
      type: Boolean,
      default: false
    },
    streak30Days: {
      type: Boolean,
      default: false
    },
    streak100Days: {
      type: Boolean,
      default: false
    },
    socialButterflyWeekly: {
      type: Boolean,
      default: false
    },
    helpfulMember: {
      type: Boolean,
      default: false
    },
    supportiveUser: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

export const ReactionStreak = mongoose.model<IReactionStreak>('ReactionStreak', reactionStreakSchema);

// Export all models
export const models = {
  User,
  MoodEntry,
  Goal,
  JournalEntry,
  CrisisReport,
  Reaction,
  ReactionStreak
};