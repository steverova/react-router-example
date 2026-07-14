CREATE TABLE `clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`entity_type` text DEFAULT 'legal_entity' NOT NULL,
	`legal_name` text NOT NULL,
	`trade_name` text,
	`tax_id` text,
	`country` text,
	`address` text,
	`postal_code` text,
	`email` text NOT NULL,
	`phone` text,
	`notes` text,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT '"2026-07-14T03:14:05.100Z"',
	`updated_at` integer DEFAULT '"2026-07-14T03:14:05.100Z"'
);
--> statement-breakpoint
CREATE TABLE `credentials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`provider` text NOT NULL,
	`provider_user_id` text,
	`password_hash` text,
	`created_at` integer DEFAULT '"2026-07-14T03:14:05.110Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_provider_user` ON `credentials` (`provider`,`provider_user_id`);--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`ip_address` text NOT NULL,
	`success` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-07-14T03:14:05.113Z"'
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer DEFAULT '"2026-07-14T03:14:05.120Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_entity_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`project_manager_id` integer,
	`owner_id` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`start_date` text,
	`target_end_date` text,
	`hours_budget` real,
	`created_at` integer DEFAULT '"2026-07-14T03:14:05.106Z"',
	`updated_at` integer DEFAULT '"2026-07-14T03:14:05.106Z"'
);
--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`family_id` text NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`revoked_at` integer,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-07-14T03:14:05.117Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_token_hash` ON `refresh_tokens` (`token_hash`);--> statement-breakpoint
CREATE INDEX `idx_user_id` ON `refresh_tokens` (`user_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-07-14T03:14:05.123Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_user_id` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified_at` integer,
	`role` text DEFAULT 'user' NOT NULL,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT '"2026-07-14T03:14:05.093Z"',
	`updated_at` integer DEFAULT '"2026-07-14T03:14:05.093Z"'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_public_id_unique` ON `users` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);