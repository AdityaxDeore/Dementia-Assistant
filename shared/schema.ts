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

export const mentors = pgTable("mentors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  year: integer("year").notNull(), // 2, 3, 4
  region: text("region").notNull(),
  domains: text("domains").notNull(), // JSON array of expertise domains
  bio: text("bio"),
  maxMentees: integer("max_mentees").default(3).notNull(),
  currentMentees: integer("current_mentees").default(0).notNull(),
  isActive: integer("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mentees = pgTable("mentees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  year: integer("year").default(1).notNull(), // typically 1 for freshers
  region: text("region").notNull(),
  interests: text("interests").notNull(), // JSON array of learning interests
  goals: text("goals"), // what they want to achieve
  hasActiveMentor: integer("has_active_mentor").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mentorships = pgTable("mentorships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mentorId: varchar("mentor_id").notNull(),
  menteeId: varchar("mentee_id").notNull(),
  status: text("status").notNull(), // 'pending', 'active', 'completed', 'cancelled'
  startDate: date("start_date"),
  endDate: date("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueMentorship: unique().on(table.mentorId, table.menteeId),
}));

export const mentorTasks = pgTable("mentor_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mentorshipId: varchar("mentorship_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  status: text("status").default("pending").notNull(), // 'pending', 'in_progress', 'completed'
  priority: text("priority").default("medium").notNull(), // 'low', 'medium', 'high'
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reactions = pgTable("reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  targetType: text("target_type").notNull(), // 'post', 'comment', 'journal', 'resource'
  targetId: varchar("target_id").notNull(),
  type: text("type").notNull(), // 'like', 'heart', 'helpful', 'support', 'thumbsup'
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueReaction: unique().on(table.userId, table.targetType, table.targetId, table.type),
}));

export const reactionStreaks = pgTable("reaction_streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastReactionDate: date("last_reaction_date"),
  totalReactions: integer("total_reactions").default(0).notNull(),
  reactionsByType: text("reactions_by_type").default('{}').notNull(), // JSON object
  weeklyReactions: integer("weekly_reactions").default(0).notNull(),
  monthlyReactions: integer("monthly_reactions").default(0).notNull(),
  streakResetDate: date("streak_reset_date"),
  achievements: text("achievements").default('{}').notNull(), // JSON object
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

// Mentor-Mentee API schemas
export const apiMentorRegistrationSchema = z.object({
  name: z.string().min(1).max(100),
  year: z.number().int().min(2).max(4),
  region: z.string().min(1).max(50),
  domains: z.array(z.string()).min(1).max(5),
  bio: z.string().max(500).optional(),
  maxMentees: z.number().int().min(1).max(10).default(3),
});

export const apiMenteeRegistrationSchema = z.object({
  name: z.string().min(1).max(100),
  year: z.number().int().min(1).max(2).default(1),
  region: z.string().min(1).max(50),
  interests: z.array(z.string()).min(1).max(5),
  goals: z.string().max(1000).optional(),
});

export const apiMentorshipRequestSchema = z.object({
  mentorId: z.string(),
  menteeId: z.string(),
});

export const apiTaskCreationSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const apiTaskUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  feedback: z.string().max(500).optional(),
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

export const insertMentorSchema = createInsertSchema(mentors).pick({
  userId: true,
  name: true,
  year: true,
  region: true,
  domains: true,
  bio: true,
  maxMentees: true,
});

export const insertMenteeSchema = createInsertSchema(mentees).pick({
  userId: true,
  name: true,
  year: true,
  region: true,
  interests: true,
  goals: true,
});

export const insertMentorshipSchema = createInsertSchema(mentorships).pick({
  mentorId: true,
  menteeId: true,
  status: true,
  startDate: true,
});

export const insertMentorTaskSchema = createInsertSchema(mentorTasks).pick({
  mentorshipId: true,
  title: true,
  description: true,
  dueDate: true,
  priority: true,
});

export const insertReactionSchema = createInsertSchema(reactions).pick({
  userId: true,
  targetType: true,
  targetId: true,
  type: true,
});

export const insertReactionStreakSchema = createInsertSchema(reactionStreaks).pick({
  userId: true,
  currentStreak: true,
  longestStreak: true,
  lastReactionDate: true,
  totalReactions: true,
  reactionsByType: true,
  weeklyReactions: true,
  monthlyReactions: true,
  streakResetDate: true,
  achievements: true,
});

// API types
export type ApiMoodEntry = z.infer<typeof apiMoodEntrySchema>;
export type ApiCreateGoal = z.infer<typeof apiCreateGoalSchema>;
export type ApiUpdateGoal = z.infer<typeof apiUpdateGoalSchema>;
export type ApiMentorRegistration = z.infer<typeof apiMentorRegistrationSchema>;
export type ApiMenteeRegistration = z.infer<typeof apiMenteeRegistrationSchema>;
export type ApiMentorshipRequest = z.infer<typeof apiMentorshipRequestSchema>;
export type ApiTaskCreation = z.infer<typeof apiTaskCreationSchema>;
export type ApiTaskUpdate = z.infer<typeof apiTaskUpdateSchema>;

// Database types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertMentor = z.infer<typeof insertMentorSchema>;
export type Mentor = typeof mentors.$inferSelect;
export type InsertMentee = z.infer<typeof insertMenteeSchema>;
export type Mentee = typeof mentees.$inferSelect;
export type InsertMentorship = z.infer<typeof insertMentorshipSchema>;
export type Mentorship = typeof mentorships.$inferSelect;
export type InsertMentorTask = z.infer<typeof insertMentorTaskSchema>;
export type MentorTask = typeof mentorTasks.$inferSelect;
export type InsertReaction = z.infer<typeof insertReactionSchema>;
export type Reaction = typeof reactions.$inferSelect;
export type InsertReactionStreak = z.infer<typeof insertReactionStreakSchema>;
export type ReactionStreak = typeof reactionStreaks.$inferSelect;
