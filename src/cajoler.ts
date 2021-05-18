/**
 * A dependency-free "cajoler" tool
 *
 * new Cajoler(key: string, html:
 */
import { BrowserStorage } from './browser-storage/browser-storage'

interface ButtonOptions {
  callback?: () => void
  verb?: string
}

interface CajolerOptions {
  yes?: ButtonOptions // What to do if the user clicks "Yes" to dismiss.
  no?: ButtonOptions
  maybe?: ButtonOptions
  delay?: number // default: 1000, how long to wait to show alert
  showFilter?: (previousButton: string) => boolean
}

const defaults = {
  yes: {
    verb: 'OK'
  },
  no: {
    verb: ''
  },
  maybe: {
    verb: ''
  },
  delay: 1000,

  // If we already have stored something, we don't do it again
  showFilter: (previousValue: string): boolean => previousValue === ''
}

type Cajoler = {
  (key: string, html: string, options: CajolerOptions): void
}

function button(
  tabIndex: number,
  options: ButtonOptions,
  defaultOptions: { verb: string; callback?: () => void },
  close: () => void
) {
  const b = document.createElement('BUTTON')
  b.innerHTML = options.verb || defaultOptions.verb
  b.tabIndex = tabIndex
  b.addEventListener('click', function(_e: MouseEvent) {
    options.callback && options.callback()
    close()
  })
  return b
}

function show(html: string, options: CajolerOptions): void {
  const container = document.createElement('DIV')
  container.classList.add('cajoler')
  const content = document.createElement('DIV')
  content.classList.add('content')
  content.addEventListener('click', (_e: MouseEvent) => close())
  container.append(content)

  content.innerHTML = html

  const actions = document.createElement('DIV')
  actions.classList.add('actions')
  container.append(actions)

  if (options.no?.verb)
    actions.append(button(3, options.no, defaults.no, close))

  if (options.maybe?.verb)
    actions.append(button(2, options.maybe, defaults.maybe, close))

  actions.append(button(1, options.yes || {}, defaults.yes, close))

  setTimeout(() => {
    const body = document.getElementsByTagName('body')[0]
    body.appendChild(container)
  }, options.delay || defaults.delay)

  function close() {
    const body = document.getElementsByTagName('body')[0]
    container.classList.add('closed')
    setTimeout(() => body.removeChild(container), 2000)
  }
}

export const cajoler: Cajoler = function(key, html, options = {}): void {
  const store = new BrowserStorage()
  const storeKey = `cajole-${key}`
  const previousValue = store.read(storeKey)

  const showFilter = options.showFilter || defaults.showFilter
  if (showFilter(previousValue) === false) return

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
