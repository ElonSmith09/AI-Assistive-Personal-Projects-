CREATE TABLE `answer_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_id` text NOT NULL,
	`domain` text NOT NULL,
	`skill` text NOT NULL,
	`correct` integer NOT NULL,
	`seconds` integer NOT NULL,
	`confidence` integer NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mastery` (
	`skill` text PRIMARY KEY NOT NULL,
	`domain` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`correct` integer DEFAULT 0 NOT NULL,
	`rating` real DEFAULT 0.48 NOT NULL,
	`last_seen` text
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` text PRIMARY KEY NOT NULL,
	`target_score` integer DEFAULT 335 NOT NULL,
	`baseline_quant` integer,
	`baseline_verbal` integer,
	`weekly_hours` integer DEFAULT 18 NOT NULL,
	`streak` integer DEFAULT 0 NOT NULL,
	`xp` integer DEFAULT 0 NOT NULL,
	`last_active` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
