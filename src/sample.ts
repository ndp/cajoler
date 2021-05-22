import { cajoler } from './cajoler'

cajoler({
  key: 'https',
  nudgePrompt: '<h2>Switch to a secure connection?</h2>',
  showTheNudge: previousButton =>
    window.location.protocol === 'http:' && previousButton !== 'no',
  yes: {
    verb: 'Use a Secure Connection',
    callback: () => (window.location.protocol = 'https:')
  },
  no: {
    verb: 'Dismiss'
  }
})
