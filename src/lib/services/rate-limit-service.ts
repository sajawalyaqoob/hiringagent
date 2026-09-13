export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export class RateLimitService {
  private static requestCounts = new Map<string, { count: number; resetAt: number }>();

  /**
   * Check rate limit for key (e.g. userId or IP)
   */
  static async check(
    key: string,
    limit: number = 30,
    windowSeconds: number = 60
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.requestCounts.get(key);

    if (!entry || now > entry.resetAt) {
      this.requestCounts.set(key, {
        count: 1,
        resetAt: now + windowSeconds * 1000,
      });
      return {
        success: true,
        limit,
        remaining: limit - 1,
        resetSeconds: windowSeconds,
      };
    }

    if (entry.count >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        resetSeconds: Math.ceil((entry.resetAt - now) / 1000),
      };
    }

    entry.count += 1;
    return {
      success: true,
      limit,
      remaining: limit - entry.count,
      resetSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
}
