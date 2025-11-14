export const security = {
    jwtSecret: process.env.JWT_SECRET,
    tokenTTL: '15m',
    rateLimitLogin: {
      windowMs: 15 * 60 * 1000,
      max: 10
    }
  };