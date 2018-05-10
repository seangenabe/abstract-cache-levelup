export type LevelUp = any

export type AbstractCacheKey = string | { id: string; segment: string }
export interface Doc<T> {
  value: T
  stored: number
  ttl: number
}

export class AbstractCacheLevelUp<T = any, TLevelOpts = any> {
  private db: LevelUp
  private segment: string
  public await: true

  constructor(opts: AbstractCacheLevelUpOptions<TLevelOpts>) {
    this.await = true
    const { db, segment = 'abstractCacheLevel', location, options } = opts
    if (!db) {
      const level = require('level')
      this.db = level(location, options)
    } else {
      this.db = db
    }
    this.segment = segment
  }

  createKeyObj(key: AbstractCacheKey) {
    return { key, segment: this.segment }
  }

  async set(key: AbstractCacheKey, value: T, ttl: number) {
    const doc: Doc<T> = {
      value,
      stored: Date.now(),
      ttl
    }
    await this.db.put(this.createKeyObj(key), doc)
  }

  async get(key: AbstractCacheKey): Promise<any> {
    try {
      const doc = (await this.db.get(this.createKeyObj(key))) as Doc<T>
      const now = Date.now()
      const expires = doc.ttl + doc.stored
      const ttl = expires - now
      if (expires < now) {
        await this.delete(key)
        return null
      }
      return {
        item: doc.value,
        stored: doc.stored,
        ttl
      }
    } catch (err) {
      if (err.notFound) {
        return null
      }
      throw err
    }
  }

  async has(key) {
    const doc = await this.get(key)
    return doc != null
  }

  async delete(key) {
    await this.db.delete(this.createKeyObj(key))
  }

  async start() {
    await this.db.open()
  }

  async stop() {
    await this.db.close()
  }
}

export default AbstractCacheLevelUp

export interface AbstractCacheLevelUpOptions<TLevelOpts> {
  db?: LevelUp
  segment?: string
  location?: string
  options?: TLevelOpts
}
