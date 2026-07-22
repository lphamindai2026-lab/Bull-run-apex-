import { pgTable, serial, text, timestamp, boolean, numeric, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('user').notNull(),
  twoFaEnabled: boolean('two_fa_enabled').default(false).notNull(),
  twoFaSecret: text('two_fa_secret'),
  stripeCustomerId: text('stripe_customer_id'),
  subscriptionStatus: text('subscription_status').default('free').notNull(),
  subscriptionTier: text('subscription_tier').default('free').notNull(),
  affiliateCode: text('affiliate_code'),
  referredBy: text('referred_by'),
  balance: numeric('balance').default('100000.00').notNull(),
  // Profile extras
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  timezone: text('timezone').default('UTC'),
  currency: text('currency').default('USD'),
  theme: text('theme').default('dark'),
  language: text('language').default('en'),
  // Notification prefs
  emailNotifications: boolean('email_notifications').default(true).notNull(),
  telegramNotifications: boolean('telegram_notifications').default(false).notNull(),
  discordNotifications: boolean('discord_notifications').default(false).notNull(),
  telegramChatId: text('telegram_chat_id'),
  // Feature flags
  betaFeatures: boolean('beta_features').default(false).notNull(),
  aiMemoryEnabled: boolean('ai_memory_enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const trades = pgTable('trades', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  symbol: text('symbol').notNull(),
  market: text('market').notNull(),
  type: text('type').notNull(),
  size: numeric('size').notNull(),
  leverage: integer('leverage').default(1).notNull(),
  entryPrice: numeric('entry_price').notNull(),
  exitPrice: numeric('exit_price'),
  stopLoss: numeric('stop_loss'),
  takeProfit: numeric('take_profit'),
  pnl: numeric('pnl'),
  status: text('status').default('OPEN').notNull(),
  emotion: text('emotion'),
  mistake: text('mistake'),
  aiFeedback: text('ai_feedback'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  closedAt: timestamp('closed_at'),
});

export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  symbol: text('symbol').notNull(),
  amount: numeric('amount').notNull(),
  avgBuyPrice: numeric('avg_buy_price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const alerts = pgTable('alerts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  symbol: text('symbol').notNull(),
  type: text('type').notNull(),
  triggerValue: numeric('trigger_value').notNull(),
  status: text('status').default('PENDING').notNull(),
  channel: text('channel').default('EMAIL').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const chatSessions = pgTable('chat_sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  model: text('model').default('Gemini 1.5 Pro'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').references(() => chatSessions.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').notNull(),
  content: text('content').notNull(),
  mediaUrl: text('media_url'),
  mediaType: text('media_type'), // 'image' | 'pdf' | 'csv' | 'excel'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiMemory = pgTable('ai_memory', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  key: text('key').notNull(),
  value: text('value').notNull(),
  category: text('category').default('general'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const feedbackItems = pgTable('feedback_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'bug' | 'feature' | 'suggestion' | 'review'
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').default('OPEN').notNull(),
  rating: integer('rating'), // 1-5 stars
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const featureFlags = pgTable('feature_flags', {
  id: serial('id').primaryKey(),
  name: text('name').unique().notNull(),
  enabled: boolean('enabled').default(false).notNull(),
  description: text('description'),
  rolloutPercent: integer('rollout_percent').default(100),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const appVersions = pgTable('app_versions', {
  id: serial('id').primaryKey(),
  version: text('version').notNull(),
  title: text('title').notNull(),
  changelog: text('changelog').notNull(),
  type: text('type').default('patch').notNull(), // 'major' | 'minor' | 'patch'
  isLatest: boolean('is_latest').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  category: text('category').default('general'),
  status: text('status').default('OPEN').notNull(),
  adminReply: text('admin_reply'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const systemLogs = pgTable('system_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  ipAddress: text('ip_address'),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').default('system').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
