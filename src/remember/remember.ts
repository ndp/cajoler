import { storageAvailable, strategyLocalStorage } from './strategyLocalStorage'
import { strategyCookie } from './strategyCookie'

export class Remember implements IRemember {
  strategy: IRemember

  constructor() {
    this.strategy = storageAvailable() ? strategyLocalStorage : strategyCookie
  }

  read(key: string): string {
    return this.strategy.read(this.storageKey(key))
  }

  write(key: string, value: string): string {
    return this.strategy.write(this.storageKey(key), value)
  }

  private storageKey(key: string): string {
    return `stasher-${key}`
  }
}
