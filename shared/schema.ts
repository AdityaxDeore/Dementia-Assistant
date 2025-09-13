import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, date, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  moodValue: integer("mood_value").notNull(), // 1-5 scale
  date: date("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueUserDate: unique().on(table.userId, table.date),
}));

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'wellness', 'academic', 'personal'
  progress: integer("progress").default(0).notNull(), // 0-100
  isCompleted: integer("is_completed").default(0).notNull(), // 0 or 1 (boolean)
  targetDate: date("target_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// API-specific validation schemas with proper constraints
export const apiMoodEntrySchema = z.object({
  moodValue: z.number().int().min(1).max(5),
  notes: z.string().max(1000).optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD format
});

export const apiCreateGoalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
  category: z.enum(["wellness", "academic", "personal"]),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

export const apiUpdateGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  category: z.enum(["wellness", "academic", "personal"]).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  isCompleted: z.number().int().min(0).max(1).optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

// Database insert schemas (keeping existing for storage layer)
export const insertMoodEntrySchema = createInsertSchema(moodEntries).pick({
  userId: true,
  moodValue: true,
  date: true,
  notes: true,
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  userId: true,
  title: true,
  description: true,
  category: true,
  progress: true,
  isCompleted: true,
  targetDate: true,
});

// API types
export type ApiMoodEntry = z.infer<typeof apiMoodEntrySchema>;
export type ApiCreateGoal = z.infer<typeof apiCreateGoalSchema>;
export type ApiUpdateGoal = z.infer<typeof apiUpdateGoalSchema>;

// Database types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
