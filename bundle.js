(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cajoler.cjs.production.min.js');
  } else {
    module.exports = require('./cajoler.cjs.development.js');
  }

})));
