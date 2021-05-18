// export const sum = (a: number, b: number) => {
//   if ('development' === process.env.NODE_ENV) {
//     console.log('boop');
//   }
//   return a + b;
// };

import { cajoler } from './cajoler'

cajoler('foox',
        'You are using in insecure connection. Amp-what supports HTTPS.', {
          dismissPrompt: 'Switch to https:'
})
