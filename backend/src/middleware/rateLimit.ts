import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter for development
// In production, use Redis or a proper rate limiting library

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limiting middleware for password reset requests
 * Limits by IP: 3 request per hour, 6 requests per 24 hours
 * Limits by email: 1 request per hour, 2 requests per 24 hours
 */
export const passwordResetRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  // Check hourly limit: 1 per hour
  const hourlyKey = `ip:hourly:${ip}`;
  const hourlyEntry = rateLimitStore.get(hourlyKey);
  if (hourlyEntry && now <= hourlyEntry.resetTime && hourlyEntry.count >= 3) {
    return res.status(429).json({
      success: false,
      message: 'Bu IP adresinden çok fazla şifre sıfırlama isteği yapıldı. Lütfen daha sonra tekrar deneyin.'
    });
  }

  // Check daily limit: 2 per 24 hours
  const dailyKey = `ip:daily:${ip}`;
  const dailyEntry = rateLimitStore.get(dailyKey);
  if (dailyEntry && now <= dailyEntry.resetTime && dailyEntry.count >= 6) {
    return res.status(429).json({
      success: false,
      message: 'Bu IP adresinden çok fazla şifre sıfırlama isteği yapıldı. Lütfen daha sonra tekrar deneyin.'
    });
  }

  // If limits not exceeded, increment counters
  if (!hourlyEntry || now > hourlyEntry.resetTime) {
    rateLimitStore.set(hourlyKey, { count: 1, resetTime: now + 60 * 60 * 1000 }); // 1 hour
  } else {
    hourlyEntry.count++;
  }

  if (!dailyEntry || now > dailyEntry.resetTime) {
    rateLimitStore.set(dailyKey, { count: 1, resetTime: now + 24 * 60 * 60 * 1000 }); // 24 hours
  } else {
    dailyEntry.count++;
  }

  next();
};

/**
 * Check email-based rate limiting for forgot password
 * @param email - Email address
 * @returns true if allowed, false if rate limited
 */
export const checkEmailRateLimit = (email: string): boolean => {
  const now = Date.now();

  // Check hourly limit: 1 per hour
  const hourlyKey = `email:hourly:${email}`;
  const hourlyEntry = rateLimitStore.get(hourlyKey);
  if (hourlyEntry && now <= hourlyEntry.resetTime && hourlyEntry.count >= 1) {
    return false;
  }

  // Check daily limit: 2 per 24 hours
  const dailyKey = `email:daily:${email}`;
  const dailyEntry = rateLimitStore.get(dailyKey);
  if (dailyEntry && now <= dailyEntry.resetTime && dailyEntry.count >= 2) {
    return false;
  }

  // If limits not exceeded, increment counters
  if (!hourlyEntry || now > hourlyEntry.resetTime) {
    rateLimitStore.set(hourlyKey, { count: 1, resetTime: now + 60 * 60 * 1000 }); // 1 hour
  } else {
    hourlyEntry.count++;
  }

  if (!dailyEntry || now > dailyEntry.resetTime) {
    rateLimitStore.set(dailyKey, { count: 1, resetTime: now + 24 * 60 * 60 * 1000 }); // 24 hours
  } else {
    dailyEntry.count++;
  }

  return true;
};

// Clean up expired entries periodically (simple implementation)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean every minute