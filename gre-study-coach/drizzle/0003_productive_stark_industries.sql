CREATE TABLE `study_time` (
	`skill` text PRIMARY KEY NOT NULL,
	`seconds` integer DEFAULT 0 NOT NULL,
	`sessions` integer DEFAULT 0 NOT NULL,
	`updated_at` text
);
