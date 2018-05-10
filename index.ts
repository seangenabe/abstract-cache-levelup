import AbstractCacheLevelUp, { AbstractCacheLevelUpOptions } from './client'

export = function createAbstractCacheLevelUpClient<TLevelOpts = any>(
  opts: AbstractCacheLevelUpOptions<TLevelOpts>
) {
  return new AbstractCacheLevelUp(opts)
}
