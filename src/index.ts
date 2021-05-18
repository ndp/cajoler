import { cajoler } from './cajoler'

// export { cajoler } from './cajoler'

cajoler(
  'https',
  'You are using an insecure connection. Amp-what supports HTTPS.',
  {
    showFilter: previousButton =>
      window.location.protocol === 'http:' && previousButton !== 'no',
    yes: {
      verb: 'Use a Secure Connection',
      callback: () => (window.location.protocol = 'https:')
    },
    no: {
      verb: 'Dismiss'
    }
  }
)
