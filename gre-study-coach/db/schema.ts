import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const profile = sqliteTable("profile", {
  id: text("id").primaryKey(),
  targetScore: integer("target_score").notNull().default(335),
  baselineQuant: integer("baseline_quant"),
  baselineVerbal: integer("baseline_verbal"),
  weeklyHours: integer("weekly_hours").notNull().default(18),
  streak: integer("streak").notNull().default(0),
  xp: integer("xp").notNull().default(0),
  lastActive: text("last_active"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const mastery = sqliteTable("mastery", {
  skill: text("skill").primaryKey(),
  domain: text("domain").notNull(),
  attempts: integer("attempts").notNull().default(0),
  correct: integer("correct").notNull().default(0),
  rating: real("rating").notNull().default(0.48),
  lastSeen: text("last_seen"),
});

export const lessonProgress = sqliteTable("lesson_progress", {
  skill: text("skill").primaryKey(),
  views: integer("views").notNull().default(0),
  completed: integer("completed").notNull().default(0),
  lastReviewed: text("last_reviewed"),
});

export const studyTime = sqliteTable("study_time", {
  skill: text("skill").primaryKey(),
  seconds: integer("seconds").notNull().default(0),
  sessions: integer("sessions").notNull().default(0),
  updatedAt: text("updated_at"),
});

export const answerLog = sqliteTable(
  "answer_log",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    questionId: text("question_id").notNull(),
    domain: text("domain").notNull(),
    skill: text("skill").notNull(),
    correct: integer("correct").notNull(),
    seconds: integer("seconds").notNull(),
    confidence: integer("confidence").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("idx_answer_log_created_at").on(table.createdAt),
    index("idx_answer_log_skill_created").on(table.skill, table.createdAt),
  ],
);
