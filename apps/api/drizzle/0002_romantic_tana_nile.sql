ALTER TABLE `users` ADD `polar_customer_id` text;--> statement-breakpoint
ALTER TABLE `users` ADD `plan` text;--> statement-breakpoint
ALTER TABLE `users` ADD `plan_type` text;--> statement-breakpoint
ALTER TABLE `users` ADD `plan_status` text DEFAULT 'none';--> statement-breakpoint
ALTER TABLE `users` ADD `plan_ends_at` integer;