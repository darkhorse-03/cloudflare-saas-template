CREATE TABLE `email_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`to` text NOT NULL,
	`subject` text NOT NULL,
	`provider` text DEFAULT 'resend' NOT NULL,
	`status` text DEFAULT 'sent' NOT NULL,
	`message_id` text,
	`error` text,
	`email_type` text,
	`sent_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `email_logs_userId_idx` ON `email_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `email_logs_status_idx` ON `email_logs` (`status`);--> statement-breakpoint
CREATE INDEX `email_logs_sentAt_idx` ON `email_logs` (`sent_at`);--> statement-breakpoint
CREATE INDEX `email_logs_emailType_idx` ON `email_logs` (`email_type`);