CREATE TABLE "ai_memory" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"category" text DEFAULT 'general',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"type" text NOT NULL,
	"trigger_value" numeric NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"channel" text DEFAULT 'EMAIL' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category" text DEFAULT 'system' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"version" text NOT NULL,
	"title" text NOT NULL,
	"changelog" text NOT NULL,
	"type" text DEFAULT 'patch' NOT NULL,
	"is_latest" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"user_id" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"media_url" text,
	"media_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"model" text DEFAULT 'Gemini 1.5 Pro',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"description" text,
	"rollout_percent" integer DEFAULT 100,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feature_flags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "feedback_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"type" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"amount" numeric NOT NULL,
	"avg_buy_price" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"category" text DEFAULT 'general',
	"status" text DEFAULT 'OPEN' NOT NULL,
	"admin_reply" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" text NOT NULL,
	"ip_address" text,
	"details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trades" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"market" text NOT NULL,
	"type" text NOT NULL,
	"size" numeric NOT NULL,
	"leverage" integer DEFAULT 1 NOT NULL,
	"entry_price" numeric NOT NULL,
	"exit_price" numeric,
	"stop_loss" numeric,
	"take_profit" numeric,
	"pnl" numeric,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"emotion" text,
	"mistake" text,
	"ai_feedback" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"closed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"two_fa_enabled" boolean DEFAULT false NOT NULL,
	"two_fa_secret" text,
	"stripe_customer_id" text,
	"subscription_status" text DEFAULT 'free' NOT NULL,
	"subscription_tier" text DEFAULT 'free' NOT NULL,
	"affiliate_code" text,
	"referred_by" text,
	"balance" numeric DEFAULT '100000.00' NOT NULL,
	"bio" text,
	"avatar_url" text,
	"timezone" text DEFAULT 'UTC',
	"currency" text DEFAULT 'USD',
	"theme" text DEFAULT 'dark',
	"language" text DEFAULT 'en',
	"email_notifications" boolean DEFAULT true NOT NULL,
	"telegram_notifications" boolean DEFAULT false NOT NULL,
	"discord_notifications" boolean DEFAULT false NOT NULL,
	"telegram_chat_id" text,
	"beta_features" boolean DEFAULT false NOT NULL,
	"ai_memory_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ai_memory" ADD CONSTRAINT "ai_memory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_items" ADD CONSTRAINT "feedback_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trades" ADD CONSTRAINT "trades_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;