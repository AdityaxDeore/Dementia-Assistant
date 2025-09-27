import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";
import type { 
  User, InsertUser, 
  MoodEntry, InsertMoodEntry, 
  Goal, InsertGoal,
  Reaction, InsertReaction,
  ReactionStreak, InsertReactionStreak
} from "@shared/schema";
import { users, moodEntries, goals, reactions, reactionStreaks } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mood tracking methods
  createMoodEntry(moodEntry: InsertMoodEntry): Promise<MoodEntry>;
  upsertMoodEntry(moodEntry: InsertMoodEntry): Promise<MoodEntry>;
  getUserMoodEntries(userId: string): Promise<MoodEntry[]>;
  getRecentMoodEntries(userId: string, limit: number): Promise<MoodEntry[]>;
  getMoodStreak(userId: string): Promise<number>;
  
  // Goal methods
  createGoal(goal: InsertGoal): Promise<Goal>;
  getUserGoals(userId: string): Promise<Goal[]>;
  updateGoal(goalId: string, userId: string, updates: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(goalId: string, userId: string): Promise<boolean>;
  
  // Reaction methods
  addReaction(userId: string, targetType: string, targetId: string, type: string): Promise<{ success: boolean; reaction?: Reaction; streak?: any; newAchievements?: string[] }>;
  removeReaction(userId: string, targetType: string, targetId: string, type: string): Promise<boolean>;
  getReactionStreak(userId: string): Promise<ReactionStreak | null>;
  getReactionCounts(targetType: string, targetId: string): Promise<Record<string, number>>;
  getUserReactions(userId: string, targetType: string, targetId: string): Promise<Reaction[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Mood tracking methods
  async createMoodEntry(moodEntry: InsertMoodEntry): Promise<MoodEntry> {
    const [entry] = await db
      .insert(moodEntries)
      .values(moodEntry)
      .returning();
    return entry;
  }

  async upsertMoodEntry(moodEntry: InsertMoodEntry): Promise<MoodEntry> {
    const [entry] = await db
      .insert(moodEntries)
      .values(moodEntry)
      .onConflictDoUpdate({
        target: [moodEntries.userId, moodEntries.date],
        set: {
          moodValue: moodEntry.moodValue,
          notes: moodEntry.notes,
          createdAt: sql`now()`,
        },
      })
      .returning();
    return entry;
  }

  async getUserMoodEntries(userId: string): Promise<MoodEntry[]> {
    return await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.date));
  }

  async getRecentMoodEntries(userId: string, limit: number): Promise<MoodEntry[]> {
    return await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.date))
      .limit(limit);
  }

  async getMoodStreak(userId: string): Promise<number> {
    const entries = await this.getRecentMoodEntries(userId, 365); // Get up to a year
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    // Create a Set of entry dates for O(1) lookup
    const entryDates = new Set(
      entries.map(entry => {
        const date = new Date(entry.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    );
    
    // Check consecutive days starting from today
    let checkDate = new Date(today);
    while (entryDates.has(checkDate.getTime())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  }

  // Goal methods
  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [newGoal] = await db
      .insert(goals)
      .values(goal)
      .returning();
    return newGoal;
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(desc(goals.createdAt));
  }

  async updateGoal(goalId: string, userId: string, updates: Partial<InsertGoal>): Promise<Goal | undefined> {
    // Ensure progress is clamped between 0-100 if provided
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.progress !== undefined) {
      sanitizedUpdates.progress = Math.max(0, Math.min(100, sanitizedUpdates.progress));
    }
    
    const [updatedGoal] = await db
      .update(goals)
      .set({ ...sanitizedUpdates, updatedAt: new Date() })
      .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
      .returning();
    return updatedGoal || undefined;
  }

  async deleteGoal(goalId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(goals)
      .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  // Reaction methods
  async addReaction(userId: string, targetType: string, targetId: string, type: string): Promise<{ success: boolean; reaction?: Reaction; streak?: any; newAchievements?: string[] }> {
    try {
      // Add the reaction
      const [reaction] = await db
        .insert(reactions)
        .values({ userId, targetType, targetId, type })
        .returning();

      // Update reaction streak
      const streakData = await this.updateReactionStreak(userId, new Date().toISOString().split('T')[0]);

      return {
        success: true,
        reaction,
        streak: streakData,
        newAchievements: streakData.newAchievements || []
      };
    } catch (error) {
      throw error;
    }
  }

  async removeReaction(userId: string, targetType: string, targetId: string, type: string): Promise<boolean> {
    const result = await db
      .delete(reactions)
      .where(and(
        eq(reactions.userId, userId),
        eq(reactions.targetType, targetType),
        eq(reactions.targetId, targetId),
        eq(reactions.type, type)
      ));
    return (result.rowCount ?? 0) > 0;
  }

  async getReactionStreak(userId: string): Promise<ReactionStreak | null> {
    const [streak] = await db
      .select()
      .from(reactionStreaks)
      .where(eq(reactionStreaks.userId, userId));
    
    if (!streak) {
      // Create initial streak record
      const [newStreak] = await db
        .insert(reactionStreaks)
        .values({
          userId,
          currentStreak: 0,
          longestStreak: 0,
          totalReactions: 0,
          reactionsByType: JSON.stringify({ like: 0, heart: 0, helpful: 0, support: 0, thumbsup: 0 }),
          weeklyReactions: 0,
          monthlyReactions: 0,
          achievements: JSON.stringify({
            firstReaction: false,
            streak3Days: false,
            streak7Days: false,
            streak30Days: false,
            streak100Days: false,
            socialButterflyWeekly: false,
            helpfulMember: false,
            supportiveUser: false
          })
        })
        .returning();
      return newStreak;
    }
    
    return streak;
  }

  async getReactionCounts(targetType: string, targetId: string): Promise<Record<string, number>> {
    const results = await db
      .select({
        type: reactions.type,
        count: count()
      })
      .from(reactions)
      .where(and(
        eq(reactions.targetType, targetType),
        eq(reactions.targetId, targetId)
      ))
      .groupBy(reactions.type);

    const counts: Record<string, number> = {};
    results.forEach(result => {
      counts[result.type] = result.count;
    });
    
    return counts;
  }

  async getUserReactions(userId: string, targetType: string, targetId: string): Promise<Reaction[]> {
    return await db
      .select()
      .from(reactions)
      .where(and(
        eq(reactions.userId, userId),
        eq(reactions.targetType, targetType),
        eq(reactions.targetId, targetId)
      ));
  }

  // Helper method to update reaction streak
  private async updateReactionStreak(userId: string, reactionDate: string): Promise<any> {
    const streak = await this.getReactionStreak(userId);
    if (!streak) return null;

    const today = new Date(reactionDate);
    const lastReactionDate = streak.lastReactionDate ? new Date(streak.lastReactionDate) : null;
    
    let newCurrentStreak = streak.currentStreak;
    let newLongestStreak = streak.longestStreak;
    const newAchievements: string[] = [];
    
    // Calculate streak
    if (!lastReactionDate) {
      newCurrentStreak = 1;
    } else {
      const daysDiff = Math.floor((today.getTime() - lastReactionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        newCurrentStreak = streak.currentStreak + 1;
      } else if (daysDiff === 0) {
        // Same day, keep current streak
        newCurrentStreak = streak.currentStreak;
      } else {
        // Streak broken
        newCurrentStreak = 1;
      }
    }
    
    // Update longest streak
    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }
    
    // Parse existing data
    const reactionsByType = JSON.parse(streak.reactionsByType);
    const achievements = JSON.parse(streak.achievements);
    
    // Check for new achievements
    if (!achievements.firstReaction && streak.totalReactions === 0) {
      achievements.firstReaction = true;
      newAchievements.push('First Reaction');
    }
    
    if (!achievements.streak3Days && newCurrentStreak >= 3) {
      achievements.streak3Days = true;
      newAchievements.push('3-Day Streak');
    }
    
    if (!achievements.streak7Days && newCurrentStreak >= 7) {
      achievements.streak7Days = true;
      newAchievements.push('Weekly Warrior');
    }
    
    if (!achievements.streak30Days && newCurrentStreak >= 30) {
      achievements.streak30Days = true;
      newAchievements.push('Monthly Master');
    }
    
    if (!achievements.streak100Days && newCurrentStreak >= 100) {
      achievements.streak100Days = true;
      newAchievements.push('Streak Legend');
    }
    
    // Update the streak record
    const [updatedStreak] = await db
      .update(reactionStreaks)
      .set({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastReactionDate: reactionDate,
        totalReactions: streak.totalReactions + 1,
        achievements: JSON.stringify(achievements),
        updatedAt: new Date()
      })
      .where(eq(reactionStreaks.userId, userId))
      .returning();
    
    return {
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      totalReactions: updatedStreak.totalReactions,
      newAchievements
    };
  }
}

export const storage = new DatabaseStorage();