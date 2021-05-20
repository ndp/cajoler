# Cajoler

Encourage your visitors to do something, without being rude.

## Usage

```typescript
cajoler(
  'https',
  '<h2>Switch to a secure connection?</h2><p>Sites without the "s" in "https:" are susceptible to "wire-tapping" attacks. Curious or mallicious observers can easily see what you are doing. Although Amp-what has no personal information, it does support Https. </p>',
  {
    showFilter: previousButton =>
                  window.location.protocol === 'http:' && previousButton !== 'no',
    yes:        {
      verb:     'Use a Secure Connection',
      callback: () => (window.location.protocol = 'https:')
    },
    no:         {
      verb: 'Dismiss'
    }
  }
)
```

The whole interface is one call, `cajoler`, and the usage requires three parameters:

1. A key to identify the check/message. You may have multiple nudges if you want.
2. The text of the nudge. Provide this in HTML.
3. Options. These are expanded in more detail below.

### Options

* `yes` An object with
    - `verb`: the name of the button signifying an "Yes" answer
    - `callback`: a function to call when the user selects "Yes"
* `no` An object similar to `yes`, with
    - `verb`: the name of the button signifying an "Yes" answer
      ** A blank value indicates there is no "No" button. (Default)**
    - `callback`: a function to call when the user selects "No"
* `maybe` An object similar to `yes`, with
    - `verb`: the name of the button signifying an "Maybe" answer
      ** A blank value indicates there is no "Maybe" button. (Default) **
    - `callback`: a function to call when the user selects "Maybe"
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

### Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so
that it can be imported separately by your users and run through their bundler's loader.

### Publishing to NPM

We use [np](https://github.com/sindresorhus/np).
