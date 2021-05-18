/**
 * A dependency-free "cajoler" tool
 *
 * new Cajoler(key: string, html:
 */
import { Remember } from './remember/remember'


interface CajolerOptions {
  dismissPrompt?: string; // default: 'OK'  Confirmation button text.
  onDismissOK?: () => void;
  // showCancel: boolean; // default: false Whether to show a cancel button.
  // cancelText: string;  // default: 'Cancel' Cancel button text.
  okStopBuggingMe?: () => void;
}

type Cajoler = {
  (key: string, html: string, options: CajolerOptions): void
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

  const confirm = document.createElement('BUTTON')
  confirm.innerHTML = options.dismissPrompt || 'OK'
  confirm.addEventListener('click', function (_e: MouseEvent) {
    options.onDismissOK && options.onDismissOK()
    close()
  })
  actions.append(confirm)

  setTimeout(() => {
    const body = document.getElementsByTagName('body')[0]
    body.appendChild(container)
  }, 2000)

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
  const stasher = new Remember()
  let stasherKey = `stasher-${key}`
  console.log('stasherKey', stasherKey, stasher.read(stasherKey))
  if (stasher.read(stasherKey) !== '') return

  const onOK = options.onDismissOK
  options.onDismissOK = () => {
    if (onOK) onOK()
    stasher.write(stasherKey, 'X')
  }

  show(html, options)

}
