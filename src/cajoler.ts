/**
 * A dependency-free "cajoler" tool
 *
 * new Cajoler(key: string, html:
 */
import { BrowserStorage } from './browser-storage/browser-storage'

type ButtonKey = 'yes' | 'no' | 'maybe'
type MaybeButtonKey = ButtonKey | ''

interface ButtonOptions {
  callback?: () => void
  label?: string
}

type Position = 'top' | 'bottom'

type CajolerOptions = {
  [x in ButtonKey]?: ButtonOptions
} & {
  key?: string
  nudgePrompt?: string | ((previousChoice: MaybeButtonKey) => string)
  delay?: number //   default:  1,000, how long to wait to show alert
  autoCloseDelay?: number // default: 60,000, how long to leave the dialog up before automatically closing
  onAutoClose?:  () => void
  showTheNudge?: (previousChoice: MaybeButtonKey) => boolean
  position?: Position
  cssClass?: string
}

const defaults = {
  key: 'cajoler',
  nudgePrompt: '',
  yes: {
    label: 'OK'
  },
  no: {
    label: ''
  },
  maybe: {
    label: ''
  },
  delay: 1000,
  autoCloseDelay: 60 * 1000,
  position: 'top',
  cssClass: 'cajoler',

  // If we already have stored something, we don't do it again
  showTheNudge: (previousChoice: MaybeButtonKey): boolean =>
    previousChoice === ''
}

function button(
  tabIndex: number,
  options: ButtonOptions,
  defaultOptions: { label: string; callback?: () => void },
  close: () => void
) {
  const b = document.createElement('BUTTON')
  b.innerHTML = options.label || defaultOptions.label
  b.tabIndex = tabIndex
  b.addEventListener('click', function(_e: MouseEvent) {
    options.callback && options.callback()
    close()
  })
  return b
}

function show(html: string, options: CajolerOptions): void {
  const container = document.createElement('DIV')
  container.classList.add(options.cssClass || defaults.cssClass)
  container.classList.add(options.position || defaults.position)
  const content = document.createElement('DIV')
  content.classList.add('content')
  content.addEventListener('click', (_e: MouseEvent) => close())
  container.append(content)

  content.innerHTML = html

  const actions = document.createElement('DIV')
  actions.classList.add('actions')
  container.append(actions)

  if (options.no?.label)
    actions.append(button(3, options.no, defaults.no, close))

  if (options.maybe?.label)
    actions.append(button(2, options.maybe, defaults.maybe, close))

  actions.append(button(1, options.yes || {}, defaults.yes, close))

  setTimeout(() => {
    const body = document.getElementsByTagName('body')[0]
    body.appendChild(container)
  }, options.delay || defaults.delay)

  const autoClose = setTimeout(() => {
    close()
    if (options.onAutoClose) options.onAutoClose()
  }, options.autoCloseDelay || defaults.autoCloseDelay)

  function close() {
    clearTimeout(autoClose)
    const body = document.getElementsByTagName('body')[0]
    container.classList.add('closed')
    setTimeout(() => body.removeChild(container), 2000)
  }
}

export const cajoler = function(options: CajolerOptions = {}): void {
  const store = new BrowserStorage()
  const key = options.key || defaults.key
  const storeKey = `cajole-${key}`
  const previousValue = store.read(storeKey) as MaybeButtonKey

  const filter = options.showTheNudge || defaults.showTheNudge
  if (!filter(previousValue)) return

  options.yes = chainOntoCallbackProp(
    options.yes || defaults.yes,
    'callback',
    () => store.write(storeKey, 'yes')
  )
  options.no = chainOntoCallbackProp(
    options.no || defaults.no,
    'callback',
    () => store.write(storeKey, 'no')
  )
  // "maybe" button doesn't remember the setting... we'll ask next time.

  const nudge = options.nudgePrompt || defaults.nudgePrompt
  const html =
    typeof nudge === 'function' ? nudge(previousValue) : nudge

  show(html, options)
}

/**
 * Given an object with a property `prop`, returns a new object
 * with a new `prop`.
 * - if `prop`'s already a function, chains onto it with callback2
 * - if `prop` is not a function, will simply call callback2
 * @param {O} o
 * @param {string} prop
 * @param {Function} callback2
 * @returns {O}
 */
function chainOntoCallbackProp<O extends { [k: string]: any }>(
  o: O,
  prop: string,
  callback2: Function
): O {
  const originalCallback = o[prop] as Function
  return {
    ...o,
    [prop]: (...args: any[]) => {
      if (originalCallback) originalCallback(...args)
      return callback2(...args)
    }
  }
}
