// export const sum = (a: number, b: number) => {
//   if ('development' === process.env.NODE_ENV) {
//     console.log('boop');
//   }
//   return a + b;
// };

import { cajoler } from './cajoler'

cajoler(
  'foox',
  'You are using an insecure connection. Amp-what supports HTTPS.',
  {
    yes:   {
      verb: 'Switch to a Secure Connection'
    },
    maybe: {
      verb: 'Ask Me Later'
    },
    no:    {
      verb: 'Dismiss'
    }
  }
)
