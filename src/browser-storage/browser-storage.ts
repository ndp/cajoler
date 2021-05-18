import {
  localStorageAvailable,
  strategyLocalStorage
} from './strategyLocalStorage'
import { strategyCookie } from './strategyCookie'

export class BrowserStorage implements StorageProxy {
  strategy: StorageProxy

  constructor() {
    this.strategy = localStorageAvailable()
      ? strategyLocalStorage
      : strategyCookie
  }

  read(key: string): string {
    return this.strategy.read(this.storageKey(key))
  }

  write(key: string, value: string): string {
    return this.strategy.write(this.storageKey(key), value)
  }

  storageKey(key: string): string {
    return `remember-${key}`
  }
}
