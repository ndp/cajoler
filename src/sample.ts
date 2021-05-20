import { cajoler } from './cajoler'
cajoler(
  'https',
  '<h2>Switch to a secure connection?</h2><p>Sites without the "s" in "https:" are susceptible to "wire-tapping" attacks. Curious or mallicious observers can easily see what you are doing. Although Amp-what has no personal information, it does support Https. </p>',
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
