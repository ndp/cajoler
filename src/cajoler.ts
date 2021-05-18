/**
 * A dependency-free "cajoler" tool
 *
 * new Cajoler(key: string, html:
 */
import { Remember } from './remember/remember'

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
  const store = new Remember()
  const storeKey = `cajole-${key}`
  const previousValue = store.read(storeKey)

  const showFilter = options.showFilter || defaults.showFilter
  if (showFilter(previousValue) == false) return

  options.yes = addRememberCallback(options.yes || {}, 'yes')
  options.no = addRememberCallback(options.no || {}, 'no')
  // "maybe" does not remember the setting... we'll ask next time.

  show(html, options)

  function addRememberCallback(options: ButtonOptions, value: string) {
    const originalCallback = options.callback
    return {
      ...options,
      callback: () => {
        if (originalCallback) originalCallback()
        store.write(storeKey, value)
      }
    }
  }
}
