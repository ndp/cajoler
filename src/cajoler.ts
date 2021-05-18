/**
 * A dependency-free "cajoler" tool
 *
 * new Cajoler(key: string, html:
 */
import { Remember } from './remember/remember'


interface CajolerOptions {
  yesCallback?: () => void // What to do if the user clicks "Yes" to dismiss.
  yesVerb?: string // default: 'OK'  Confirmation button text.
  maybeCallback?: () => void // override text of the Maybe Later button
  maybeVerb?: string // default: '' (do not show a button)
  noCallback?: () => void // override text of the No button
  noVerb?: string // default: '' (do not show a button)
  delay?: number // default: 1000, how long to wait to show alert
}

const defaults = {
  yesVerb: 'OK',
  noVerb:  '',
  maybeVerb:  '',
  delay:   1000,
}

type Cajoler = {
  (key: string, html: string, options: CajolerOptions): void
}

function button (verb: 'yes' | 'no' | 'maybe', options: CajolerOptions, close: () => void) {
  const labelProp = `${verb}Verb` as 'yesVerb' | 'noVerb' | 'maybeVerb'
  const cb = `${verb}Callback` as 'yesCallback' | 'noCallback' | 'maybeCallback'

  const b = document.createElement('BUTTON')
  b.innerHTML = options[labelProp] || defaults[labelProp]
  b.addEventListener('click', function (_e: MouseEvent) {
    options[cb] && options[cb]
    close()
  })
  return b
}

function show (html: string, options: CajolerOptions): void {
  const container = document.createElement('DIV')
  container.classList.add('cajoler')
  const content = document.createElement('DIV')
  content.classList.add('content')
  container.append(content)

  content.innerHTML = html

  const actions = document.createElement('DIV')
  actions.classList.add('actions')
  container.append(actions)

  if (options.noVerb)
    actions.append(button('no', options, close))

  if (options.maybeVerb)
    actions.append(button('maybe', options, close))

  actions.append(button('yes', options, close))

  setTimeout(() => {
    const body = document.getElementsByTagName('body')[0]
    body.appendChild(container)
  }, options.delay || defaults.delay)

  function close () {
    const body = document.getElementsByTagName('body')[0]
    body.removeChild(container)
  }
}

export const cajoler: Cajoler = function (
  key,
  html,
  options = {}
): void {

  const store = new Remember()

  let storeKey = `stasher-${key}`

  // If we already have stored something, we don't do it again
  if (store.read(storeKey) !== '') return

  const yesCallback = options.yesCallback
  options.yesCallback = () => {
    if (yesCallback) yesCallback()
    store.write(storeKey, 'yes')
  }

  const noCallback = options.noCallback
  options.noCallback = () => {
    if (noCallback) noCallback()
    store.write(storeKey, 'no')
  }

  // maybe does not remember the setting... we'll ask next time.

  show(html, options)
}
