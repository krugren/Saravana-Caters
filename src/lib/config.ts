import { db } from "@/db";
import { config } from "@/db/schema";
import { eq } from "drizzle-orm";

const cache = new Map<string, { value: any; expiresAt: number }>();
const CACHE_TTL = 60 * 1000;

export async function getConfig<T = any>(key: string, defaultValue?: T): Promise<T> {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }

  const result = await db.select().from(config).where(eq(config.key, key)).limit(1);
  if (result.length > 0) {
    const value = result[0].value as T;
    cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL });
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Configuration key not found: ${key}`);
}

export function clearConfigCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}
