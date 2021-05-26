# Cajoler

> ca·jole /kəˈjōl/
> • verb •
> persuade (someone) to do something by sustained coaxing or flattery.

Encourage your visitors to do something, without being rude. 

Cajoler presents a clean dialog to the user and get their response.
I takes care of
* light-weight client-side storage
* simple presentation of a dialog without dependency on any web framework.

Some ideas for Cajoler:
* acknowledge that cookies exist
* confirm terms-of-use
* nudge to switch to https

Presents a modeless dialog when called, if certain criteria are met, and 
remembers the users' response in localStorage (or cookies if localStorage isn't available.)
By default, if the user chooses "No", they are no asked again, but when buttons
are shown or not is fully configurable.

Requires no server-side storage.

Appropriate for secondary functionality.

## Usage

```typescript
import { cajoler } from 'cajoler'

cajoler(
  {
    key: 'foo',
    nudgePrompt: '<h2>Switch to a secure connection?</h2><p>Sites without the "s" in "https:" are susceptible to "wire-tapping" attacks. Observers can easily see what you are doing.</p>',
    showFilter: previousButton =>
                  window.location.protocol === 'http:' && previousButton !== 'no',
    yes:        {
      label:    'Use a Secure Connection',
      callback: () => (window.location.protocol = 'https:')
    },
    no:         {
      label: 'Dismiss'
    }
  }
)
```

There is one call, `cajoler`, and receives options:

* `key`: A key to identify the check/message. You may have multiple nudges if you want, and the users' responses are remembered by this key. If not provided, a generic key is used. 
* `nudgePrompt`: The text of the nudge. Provide this in HTML, or a function that returns HTML. If the user clicked a button on a previous visit, the function receives it as a parameter. (If not, it receives an empty string.)
* `yes` A descriptor for the main positive button. It's an object with
    - `label`: the name of the button signifying an "Yes" answer
    - `callback`: a function to call when the user selects "Yes"
* `no` An object similar to `yes`, with
    - `label`: the name of the button signifying an "No" answer
      _A blank value indicates there is no "No" button. (Default)_
    - `callback`: a function to call when the user selects "No"
* `maybe` An object similar to `yes`, with
    - `label`: the name of the button signifying an "Maybe" answer
      _A blank value indicates there is no "Maybe" button. (Default)_
    - `callback`: a function to call when the user selects "Maybe"
* `position` Either `top` or `bottom`, determining where the alert is positioned.
* `cssClass` The CSS class use for the wrapper component. If you change this from the default of `cajoler`, you'll need to do all your own CSS.
* `delay` Milliseconds to wait before showing the alert. The default is 1000.
* `timeout` Milliseconds to show the dialog before automatically closing it. The default is 60,000.
* `showFilter`: A function that returns `true` if the cajoling message should be shown to the user. It is passed a value
  of the previous button the user chose. If the user has not chosen before, or local data has been deleted, the
  parameter will be an empty string.
  
### CSS

Styles can be imported¹ from `cajoler/src/cajoler.css`. To customize colors or anything else, simply use the cascade, and
override selectors. Everything is name-spaced inside `.cajoler`, and it's pretty easy to do your own thing. If you don't want to use this class name, override the option `cssClass` in the options.

¹ I used a configuration with webpack and `html-webpack-plugin` and `css-loader`, but you can do it your own way.

## Development

Build using TSDX.

### Commands

TSDX scaffolds your new library inside `/src`.

To run TSDX, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`
.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

### Continuous Integration

[![CI](https://github.com/ndp/cajoler/actions/workflows/main.yml/badge.svg)](https://github.com/ndp/cajoler/actions/workflows/main.yml)

#### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request
  using [`size-limit`](https://github.com/ai/size-limit)

### Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields
in `package.json` accordingly.

#### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

#### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library
with `npm run size` and visualize the bundle with `npm run analyze`.

### Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know
that you can take advantage of development-only optimizations:

```typescript
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant)
and [warning](https://github.com/palmerhq/tsdx#warning) functions.

### Publishing to NPM

We use [np](https://github.com/sindresorhus/np). Use a command such as `np --branch trunk major`
