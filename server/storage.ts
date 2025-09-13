import { type User, type InsertUser, type MoodEntry, type InsertMoodEntry, type Goal, type InsertGoal, users, moodEntries, goals } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();
