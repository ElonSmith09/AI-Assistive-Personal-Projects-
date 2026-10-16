CREATE INDEX `idx_answer_log_created_at` ON `answer_log` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_answer_log_skill_created` ON `answer_log` (`skill`,`created_at`);