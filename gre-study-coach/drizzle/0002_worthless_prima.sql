CREATE TABLE `lesson_progress` (
	`skill` text PRIMARY KEY NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`last_reviewed` text
);
