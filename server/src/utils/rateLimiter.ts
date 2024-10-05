import { Context, Next } from 'hono';

interface RateLimitData {
  tokens: number;
  lastRefill: number;
}

const isValidIP = (ip: string): boolean => {
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:))|(([0-9a-fA-F]{1,4}:){1,7}:)|(([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

//mapping IP addresses to their rate limits for each route
type RateLimitStore = Map<string, Map<string, RateLimitData>>;

// In-memory rate limit store
const rateLimitStore: RateLimitStore = new Map();


const getClientIP = (c: Context): string | null => {
  const xForwardedFor = c.req.header('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIP = c.req.header('x-real-ip');
  if (xRealIP) {
    return xRealIP;
  }


  return c.req.raw.headers.get('CF-Connecting-IP') || null;
};


export const rateLimiter = (maxRequests: number, windowSeconds: number) => {
  const refillRate = maxRequests / windowSeconds;

  return async (c: Context, next: Next) => {
    const routeKey = c.req.path;
    const ip = getClientIP(c);

    if (!ip || !isValidIP(ip)) {
      return c.text('Unable to identify IP, it might be Invalid Ip address.', 400);
    }


    if (!rateLimitStore.has(ip)) {
      rateLimitStore.set(ip, new Map<string, RateLimitData>());
    }

    const userLimits = rateLimitStore.get(ip)!;
    const currentTime = Date.now();
    const userRateLimit = userLimits.get(routeKey) || { tokens: maxRequests, lastRefill: currentTime };


    const tokensToAdd = ((currentTime - userRateLimit.lastRefill) / 1000) * refillRate;
    userRateLimit.tokens = Math.min(maxRequests, userRateLimit.tokens + tokensToAdd);
    userRateLimit.lastRefill = currentTime;

    if (userRateLimit.tokens >= 1) {

      userRateLimit.tokens -= 1;
      userLimits.set(routeKey, userRateLimit);
      await next();
    } else {

      return c.text('Too many requests, please try again later.', 429);
    }
  };
};

