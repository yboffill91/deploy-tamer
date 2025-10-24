// src/lib/cache.ts
class CacheService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 24 * 60 * 60 * 1000; // 24h
  private listeners = new Map<string, Set<() => void>>();

  set<T>(key: string, data: T) {
    this.cache.set(key, { data, timestamp: Date.now() });
    this.notify(key);
    console.log("actualización de", key, data);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  subscribe(key: string, callback: () => void) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    return () => this.unsubscribe(key, callback);
  }

  private unsubscribe(key: string, callback: () => void) {
    this.listeners.get(key)?.delete(callback);
  }

  private notify(key: string) {
    this.listeners.get(key)?.forEach((callback) => callback());
  }

  clear(key: string) {
    this.cache.delete(key);
  }
}

export const cacheService = new CacheService();
