PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_clients` (
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
	`created_at` integer DEFAULT '"2026-07-14T03:20:46.807Z"',
	`updated_at` integer DEFAULT '"2026-07-14T03:20:46.807Z"'
);
--> statement-breakpoint
INSERT INTO `__new_clients`("id", "entity_type", "legal_name", "trade_name", "tax_id", "country", "address", "postal_code", "email", "phone", "notes", "status", "created_at", "updated_at") SELECT "id", "entity_type", "legal_name", "trade_name", "tax_id", "country", "address", "postal_code", "email", "phone", "notes", "status", "created_at", "updated_at" FROM `clients`;--> statement-breakpoint
DROP TABLE `clients`;--> statement-breakpoint
ALTER TABLE `__new_clients` RENAME TO `clients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_credentials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`provider` text NOT NULL,
	`provider_user_id` text,
	`password_hash` text,
	`created_at` integer DEFAULT '"2026-07-14T03:20:46.879Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_credentials`("id", "user_id", "provider", "provider_user_id", "password_hash", "created_at") SELECT "id", "user_id", "provider", "provider_user_id", "password_hash", "created_at" FROM `credentials`;--> statement-breakpoint
DROP TABLE `credentials`;--> statement-breakpoint
ALTER TABLE `__new_credentials` RENAME TO `credentials`;--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_provider_user` ON `credentials` (`provider`,`provider_user_id`);--> statement-breakpoint
CREATE TABLE `__new_login_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`ip_address` text NOT NULL,
	`success` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-07-14T03:20:46.882Z"'
);
--> statement-breakpoint
INSERT INTO `__new_login_attempts`("id", "email", "ip_address", "success", "created_at") SELECT "id", "email", "ip_address", "success", "created_at" FROM `login_attempts`;--> statement-breakpoint
DROP TABLE `login_attempts`;--> statement-breakpoint
ALTER TABLE `__new_login_attempts` RENAME TO `login_attempts`;--> statement-breakpoint
CREATE TABLE `__new_password_reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer DEFAULT '"2026-07-14T03:20:46.887Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_password_reset_tokens`("id", "user_id", "token_hash", "expires_at", "used_at", "created_at") SELECT "id", "user_id", "token_hash", "expires_at", "used_at", "created_at" FROM `password_reset_tokens`;--> statement-breakpoint
DROP TABLE `password_reset_tokens`;--> statement-breakpoint
ALTER TABLE `__new_password_reset_tokens` RENAME TO `password_reset_tokens`;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_code` text NOT NULL,
	`client_entity_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`project_manager_id` integer,
	`owner_id` integer,
	`status` text DEFAULT 'draft' NOT NULL,
	`start_date` text,
	`target_end_date` text,
	`hours_budget` real,
	`documentation_url` text,
	`repository_url` text,
	`contract_reference` text,
	`created_at` integer DEFAULT '"2026-07-14T03:20:46.876Z"',
	`updated_at` integer DEFAULT '"2026-07-14T03:20:46.876Z"'
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "project_code", "client_entity_id", "name", "description", "project_manager_id", "owner_id", "status", "start_date", "target_end_date", "hours_budget", "documentation_url", "repository_url", "contract_reference", "created_at", "updated_at") SELECT "id", "project_code", "client_entity_id", "name", "description", "project_manager_id", "owner_id", "status", "start_date", "target_end_date", "hours_budget", "documentation_url", "repository_url", "contract_reference", "created_at", "updated_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
CREATE UNIQUE INDEX `projects_project_code_unique` ON `projects` (`project_code`);--> statement-breakpoint
CREATE TABLE `__new_refresh_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`family_id` text NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`revoked_at` integer,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-07-14T03:20:46.884Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_refresh_tokens`("id", "user_id", "token_hash", "family_id", "user_agent", "ip_address", "revoked_at", "expires_at", "created_at") SELECT "id", "user_id", "token_hash", "family_id", "user_agent", "ip_address", "revoked_at", "expires_at", "created_at" FROM `refresh_tokens`;--> statement-breakpoint
DROP TABLE `refresh_tokens`;--> statement-breakpoint
ALTER TABLE `__new_refresh_tokens` RENAME TO `refresh_tokens`;--> statement-breakpoint
CREATE INDEX `idx_token_hash` ON `refresh_tokens` (`token_hash`);--> statement-breakpoint
CREATE INDEX `idx_user_id` ON `refresh_tokens` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-07-14T03:20:46.889Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sessions`("id", "user_id", "user_agent", "ip_address", "expires_at", "created_at") SELECT "id", "user_id", "user_agent", "ip_address", "expires_at", "created_at" FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
ALTER TABLE `__new_sessions` RENAME TO `sessions`;--> statement-breakpoint
CREATE INDEX `idx_sessions_user_id` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified_at` integer,
	`role` text DEFAULT 'user' NOT NULL,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT '"2026-07-14T03:20:46.804Z"',
	`updated_at` integer DEFAULT '"2026-07-14T03:20:46.804Z"'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "public_id", "name", "email", "email_verified_at", "role", "status", "created_at", "updated_at") SELECT "id", "public_id", "name", "email", "email_verified_at", "role", "status", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_public_id_unique` ON `users` (`public_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);