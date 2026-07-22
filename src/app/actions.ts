'use server';

import { db } from '@/db';
import { users, trades, alerts, chatSessions, chatMessages, supportTickets, systemLogs, announcements, portfolios, feedbackItems } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { hashPassword, getCurrentUser, setSessionCookie, clearSessionCookie } from '@/lib/auth';
import { queryTradingAI } from '@/lib/ai';
import { revalidatePath } from 'next/cache';

// Helper: Log actions to the audit trail
async function logSystemAction(userId: number | null, action: string, details: string) {
  try {
    await db.insert(systemLogs).values({
      userId,
      action,
      details,
      ipAddress: '127.0.0.1',
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
}

// ==========================================
// AUTHENTICATION ACTIONS
// ==========================================

export async function registerAction(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const referralCode = formData.get('referralCode') as string || null;

    if (!email || !password || !name) {
      return { success: false, error: 'Name, email, and password are required.' };
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, trimmedEmail)).limit(1);
    if (existing.length > 0) {
      return { success: false, error: 'Email is already registered.' };
    }

    const pwhash = hashPassword(password);
    const generatedAffCode = 'APEX-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Determine initial balance: +$5000 if referred
    let initialBalance = '100000.00';
    let referredBy: string | null = null;
    if (referralCode) {
      const referrers = await db.select().from(users).where(eq(users.affiliateCode, referralCode)).limit(1);
      if (referrers.length > 0) {
        referredBy = referralCode;
        initialBalance = '105000.00'; // Referral bonus
      }
    }

    const [newUser] = await db.insert(users).values({
      name,
      email: trimmedEmail,
      passwordHash: pwhash,
      affiliateCode: generatedAffCode,
      referredBy,
      balance: initialBalance,
    }).returning();

    await setSessionCookie(newUser.id);
    await logSystemAction(newUser.id, 'REGISTER', `User registered successfully. Balance: $${initialBalance}`);

    revalidatePath('/');
    return { success: true, message: 'Account created successfully!' };
  } catch (err: any) {
    console.error('Registration error:', err);
    return { success: false, error: err.message || 'An error occurred during registration.' };
  }
}

import { assertRateLimit, sanitizeInput } from '@/lib/security';

export async function loginAction(formData: FormData) {
  try {
    // 1. Rate Limiting Protection (Max 10 login hits per minute per IP)
    if (!assertRateLimit('login-ip-limit', 10, 60000)) {
      return { success: false, error: 'Too many authentication attempts. Please try again in a minute.' };
    }

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const twoFaCode = formData.get('twoFaCode') as string || null;

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
    const results = await db.select().from(users).where(eq(users.email, sanitizedEmail)).limit(1);
    
    if (results.length === 0) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const user = results[0];
    if (user.passwordHash !== hashPassword(password)) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // 2. Intercept for Multi-Factor Authentication (2FA) Verification Check
    if (user.twoFaEnabled) {
      if (!twoFaCode) {
        return { success: true, requiresTwoFa: true, message: 'Two-Factor Pin required to decrypt key session.' };
      }
      // Validate 2FA TOTP simulation code (e.g. '123456')
      if (twoFaCode !== '123456') {
        return { success: false, error: 'Invalid 2FA security validation pin.' };
      }
    }

    await setSessionCookie(user.id);
    await logSystemAction(user.id, 'LOGIN', 'User logged in' + (user.twoFaEnabled ? ' via 2FA' : ''));

    revalidatePath('/');
    return { success: true, message: 'Logged in successfully!' };
  } catch (err: any) {
    console.error('Login error:', err);
    return { success: false, error: err.message || 'An error occurred during login.' };
  }
}

export async function logoutAction() {
  const user = await getCurrentUser();
  if (user) {
    await logSystemAction(user.id, 'LOGOUT', 'User logged out');
  }
  await clearSessionCookie();
  revalidatePath('/');
  return { success: true };
}

export async function toggle2FaAction() {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const currentStatus = user.twoFaEnabled;
  const newStatus = !currentStatus;

  await db.update(users)
    .set({ twoFaEnabled: newStatus, twoFaSecret: newStatus ? 'APEX-2FA-SECRET-KEY-2026' : null })
    .where(eq(users.id, user.id));

  await logSystemAction(user.id, '2FA_TOGGLE', `Two-Factor Authentication toggled to ${newStatus}`);
  revalidatePath('/');
  return { success: true, enabled: newStatus };
}

// ==========================================
// SIMULATED TRADING TERMINAL ACTIONS
// ==========================================

export async function openSimTradeAction(
  symbol: string,
  market: string,
  type: 'BUY' | 'SELL',
  size: number,
  entryPrice: number,
  leverage: number,
  stopLoss: number | null,
  takeProfit: number | null,
  emotion: string,
  notes: string
) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Please log in to execute trades.' };

  const userRecord = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  const currentBalance = parseFloat(userRecord[0].balance);

  // Require margin collateral
  const positionNotional = size * entryPrice;
  const marginRequired = positionNotional / leverage;

  if (currentBalance < marginRequired) {
    return {
      success: false,
      error: `Insufficient simulated funds. Margin required: $${marginRequired.toFixed(2)}, Active Balance: $${currentBalance.toFixed(2)}`
    };
  }

  // Deduct margin from balance temporarily or track it
  // For simulation simplicity, keep balance and adjust on position CLOSE,
  // but ensure they can't exceed current account balance limits.
  const [newTrade] = await db.insert(trades).values({
    userId: user.id,
    symbol,
    market,
    type,
    size: size.toString(),
    entryPrice: entryPrice.toString(),
    leverage,
    stopLoss: stopLoss ? stopLoss.toString() : null,
    takeProfit: takeProfit ? takeProfit.toString() : null,
    emotion,
    notes,
    status: 'OPEN',
  }).returning();

  await logSystemAction(user.id, 'TRADE_OPEN', `Opened ${type} on ${symbol} (Size: ${size}, Lev: ${leverage}x)`);
  revalidatePath('/');
  return { success: true, trade: newTrade };
}

export async function closeSimTradeAction(tradeId: number, exitPrice: number, mistake: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const tradeResults = await db.select().from(trades).where(and(eq(trades.id, tradeId), eq(trades.userId, user.id))).limit(1);
  if (tradeResults.length === 0) return { success: false, error: 'Trade setup not found.' };

  const trade = tradeResults[0];
  if (trade.status === 'CLOSED') return { success: false, error: 'Trade already closed.' };

  const size = parseFloat(trade.size);
  const entry = parseFloat(trade.entryPrice);
  const leverage = trade.leverage;
  const type = trade.type;

  // P&L calculation
  let pnlFactor = type === 'BUY' ? (exitPrice - entry) : (entry - exitPrice);
  const pnl = pnlFactor * size * leverage;

  // Retrieve user record to adjust balance
  const userRecords = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  const currentBalance = parseFloat(userRecords[0].balance);
  const newBalance = (currentBalance + pnl).toFixed(2);

  // Generate automated AI feedback on trade closed
  const prompt = `Review this completed trade: 
  Asset: ${trade.symbol} (${trade.market})
  Type: ${trade.type} with ${leverage}x leverage
  Entry: $${entry}, Exit: $${exitPrice}
  P&L Result: $${pnl.toFixed(2)}
  User Emotion logged: ${trade.emotion}
  User Mistake logged: ${mistake}
  Notes: ${trade.notes || 'None'}`;

  const aiResult = await queryTradingAI(prompt, 'journal');

  // Update Trade
  await db.update(trades)
    .set({
      exitPrice: exitPrice.toString(),
      pnl: pnl.toString(),
      status: 'CLOSED',
      mistake,
      aiFeedback: aiResult.content,
      closedAt: new Date(),
    })
    .where(eq(trades.id, tradeId));

  // Update User balance
  await db.update(users)
    .set({ balance: newBalance })
    .where(eq(users.id, user.id));

  // Update or insert into Portfolio asset holding
  const portfolioResults = await db.select().from(portfolios).where(and(eq(portfolios.userId, user.id), eq(portfolios.symbol, trade.symbol))).limit(1);
  if (portfolioResults.length > 0) {
    const port = portfolioResults[0];
    const currentAmount = parseFloat(port.amount);
    let newAmount = type === 'BUY' ? (currentAmount + size) : (currentAmount - size);
    if (newAmount <= 0) {
      await db.delete(portfolios).where(eq(portfolios.id, port.id));
    } else {
      await db.update(portfolios)
        .set({ amount: newAmount.toString() })
        .where(eq(portfolios.id, port.id));
    }
  } else if (type === 'BUY') {
    // If buying, add holding
    await db.insert(portfolios).values({
      userId: user.id,
      symbol: trade.symbol,
      amount: size.toString(),
      avgBuyPrice: entry.toString(),
    });
  }

  await logSystemAction(user.id, 'TRADE_CLOSE', `Closed trade ${tradeId}. Profit/Loss: $${pnl.toFixed(2)}. Balance: $${newBalance}`);
  revalidatePath('/');
  return { success: true, pnl };
}

// ==========================================
// PRICE ALERTS ACTIONS
// ==========================================

export async function createAlertAction(symbol: string, type: string, triggerValue: number, channel: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const [newAlert] = await db.insert(alerts).values({
    userId: user.id,
    symbol,
    type,
    triggerValue: triggerValue.toString(),
    channel,
    status: 'PENDING'
  }).returning();

  await logSystemAction(user.id, 'ALERT_CREATE', `Created alert on ${symbol} when ${type} ${triggerValue}`);
  revalidatePath('/');
  return { success: true, alert: newAlert };
}

export async function deleteAlertAction(alertId: number) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  await db.delete(alerts).where(and(eq(alerts.id, alertId), eq(alerts.userId, user.id)));
  revalidatePath('/');
  return { success: true };
}

// ==========================================
// DATABASE-BACKED MULTI-MODEL AI CHAT
// ==========================================

export async function getChatSessionsAction() {
  const user = await getCurrentUser();
  if (!user) return [];
  return await db.select().from(chatSessions).where(eq(chatSessions.userId, user.id)).orderBy(desc(chatSessions.createdAt));
}

export async function createChatSessionAction(title: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const id = 'session_' + Math.random().toString(36).substring(2, 15);
  await db.insert(chatSessions).values({
    id,
    userId: user.id,
    title: title || 'New AI Discussion',
  });

  revalidatePath('/');
  return { success: true, sessionId: id };
}

export async function getChatMessagesAction(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) return [];
  return await db.select().from(chatMessages)
    .where(and(eq(chatMessages.sessionId, sessionId), eq(chatMessages.userId, user.id)))
    .orderBy(chatMessages.createdAt);
}

export async function deleteChatSessionAction(sessionId: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  await db.delete(chatSessions).where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, user.id)));
  revalidatePath('/');
  return { success: true };
}

export async function sendChatMessageAction(sessionId: string, content: string, modelName: string = 'Gemini 1.5 Pro') {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // 1. Save user query
  await db.insert(chatMessages).values({
    sessionId,
    userId: user.id,
    role: 'user',
    content,
  });

  // 2. Query customized premium trading AI
  const promptContext = `[Model Chosen: ${modelName}] User asks: ${content}`;
  const aiResult = await queryTradingAI(promptContext);

  // 3. Save AI response
  await db.insert(chatMessages).values({
    sessionId,
    userId: user.id,
    role: 'assistant',
    content: aiResult.content,
  });

  await logSystemAction(user.id, 'AI_CHAT_MESSAGE', `Sent message in session ${sessionId} utilizing model ${modelName}`);
  revalidatePath('/');
  return { success: true, response: aiResult.content };
}

// ==========================================
// PORTFOLIO & BILLING ACTIONS
// ==========================================

export async function updateSubscriptionAction(tier: 'pro' | 'institutional' | 'free') {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  await db.update(users)
    .set({
      subscriptionStatus: tier === 'free' ? 'free' : 'active',
      subscriptionTier: tier,
    })
    .where(eq(users.id, user.id));

  await logSystemAction(user.id, 'BILLING_UPGRADE', `Upgraded to subscription tier: ${tier}`);
  revalidatePath('/');
  return { success: true, tier };
}

export async function applyReferralCodeAction(code: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const referrers = await db.select().from(users).where(eq(users.affiliateCode, code.trim())).limit(1);
  if (referrers.length === 0) {
    return { success: false, error: 'Referral code not found in our quantitative registry.' };
  }

  const userRecord = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (userRecord[0].referredBy) {
    return { success: false, error: 'You have already utilized a referral multiplier.' };
  }

  // Set code and reward +$5,000 extra simulation funds
  const currentBalance = parseFloat(userRecord[0].balance);
  const newBalance = (currentBalance + 5000.00).toFixed(2);

  await db.update(users)
    .set({
      referredBy: code,
      balance: newBalance,
    })
    .where(eq(users.id, user.id));

  await logSystemAction(user.id, 'REFERRAL_APPLY', `Applied referral code ${code}. Earned $5,000 simulator bonus!`);
  revalidatePath('/');
  return { success: true, message: 'Code successfully validated! Added $5,000 to your simulation account.' };
}

// ==========================================
// HELP DESK / TICKETS ACTIONS
// ==========================================

export async function submitTicketAction(subject: string, message: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const [ticket] = await db.insert(supportTickets).values({
    userId: user.id,
    subject,
    message,
    status: 'OPEN',
  }).returning();

  await logSystemAction(user.id, 'SUPPORT_TICKET_CREATE', `Submitted ticket with subject: ${subject}`);
  revalidatePath('/');
  return { success: true, ticket };
}

// ==========================================
// ADMIN WORKFLOWS & CONTROLS
// ==========================================

export async function adminResolveTicketAction(ticketId: number) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Requires institutional administrator privileges.' };
  }

  await db.update(supportTickets)
    .set({ status: 'RESOLVED' })
    .where(eq(supportTickets.id, ticketId));

  await logSystemAction(user.id, 'ADMIN_RESOLVE_TICKET', `Resolved ticket ${ticketId}`);
  revalidatePath('/');
  return { success: true };
}

export async function adminPostAnnouncementAction(title: string, content: string, category: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Requires institutional administrator privileges.' };
  }

  await db.insert(announcements).values({
    title,
    content,
    category,
  });

  await logSystemAction(user.id, 'ADMIN_POST_ANNOUNCEMENT', `Posted global announcement: ${title}`);
  revalidatePath('/');
  return { success: true };
}

export async function adminChangeUserRoleAction(targetUserId: number, newRole: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Requires institutional administrator privileges.' };
  }

  await db.update(users)
    .set({ role: newRole })
    .where(eq(users.id, targetUserId));

  await logSystemAction(user.id, 'ADMIN_USER_ROLE_CHANGE', `Changed user ${targetUserId} role to ${newRole}`);
  revalidatePath('/');
  return { success: true };
}

// ==========================================
// SETTINGS ACTIONS
// ==========================================

export async function updateProfileAction(name: string, bio: string, timezone: string, currency: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  await db.update(users)
    .set({ name: name.trim() || user.name, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  await logSystemAction(user.id, 'PROFILE_UPDATE', 'User updated profile');
  revalidatePath('/');
  return { success: true };
}

export async function updateBalanceAction(newBalance: number) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  if (newBalance <= 0 || newBalance > 10000000) {
    return { success: false, error: 'Balance must be between $1 and $10,000,000.' };
  }

  await db.update(users)
    .set({ balance: newBalance.toFixed(2) })
    .where(eq(users.id, user.id));

  await logSystemAction(user.id, 'BALANCE_ADJUSTMENT', `Sim balance adjusted to $${newBalance.toFixed(2)}`);
  revalidatePath('/');
  return { success: true, newBalance };
}

export async function updateNotificationsAction(email: boolean, telegram: boolean, discord: boolean) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  await db.update(users)
    .set({ emailNotifications: email, telegramNotifications: telegram, discordNotifications: discord })
    .where(eq(users.id, user.id));

  await logSystemAction(user.id, 'NOTIFICATIONS_UPDATE', 'Notification preferences updated');
  revalidatePath('/');
  return { success: true };
}

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'You must be logged in to change your password.' };

  // Validate inputs
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: 'All three password fields are required.' };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: 'New password and confirm password do not match.' };
  }
  if (newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }
  if (newPassword === currentPassword) {
    return { success: false, error: 'New password must be different from your current password.' };
  }

  // Fetch user record with stored hash
  const rows = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  if (rows.length === 0) return { success: false, error: 'Account not found.' };

  const storedHash = rows[0].passwordHash;

  // Verify current password
  if (storedHash !== hashPassword(currentPassword)) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  // Hash new password and save
  const newHash = hashPassword(newPassword);
  await db.update(users)
    .set({ passwordHash: newHash, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  await logSystemAction(user.id, 'PASSWORD_CHANGE', 'User changed their password successfully');
  revalidatePath('/settings');
  return { success: true, message: 'Password changed successfully. Use your new password next time you log in.' };
}

export async function submitFeedbackAction(type: string, subject: string, message: string, rating?: number) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  await db.insert(feedbackItems).values({
    userId: user.id,
    type,
    subject,
    message,
    rating: rating ?? null,
    status: 'OPEN',
  });

  await logSystemAction(user.id, 'FEEDBACK_SUBMIT', `Submitted ${type} feedback: ${subject}`);
  revalidatePath('/');
  return { success: true };
}
