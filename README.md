koa-locales
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]
[![iojs version][iojs-image]][iojs-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/koa-locales.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-locales
[travis-image]: https://img.shields.io/travis/koajs/locales.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/locales
[coveralls-image]: https://img.shields.io/coveralls/koajs/locales.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/locales?branch=master
[gittip-image]: https://img.shields.io/gittip/fengmk2.svg?style=flat-square
[gittip-url]: https://www.gittip.com/fengmk2/
[david-image]: https://img.shields.io/david/koajs/locales.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/locales
[iojs-image]: https://img.shields.io/badge/io.js-%3E=_1.0-yellow.svg?style=flat-square
[iojs-url]: http://iojs.org/
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.12-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/koa-locales.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-locales

koa locales, i18n solution for koa:

1. All locales resources location on `options.dir`.
2. One api: `__(key[, value, ...])`
3. Auto detect request locale from `query`, `cookie` and `header: Accept-Language`

## Installation

```bash
$ npm install koa-locales --save
```

## Quick start

```js
var koa = require('koa');
var locales = require('koa-locales');

var app = koa();
app.use(locales({
  dir: __dirname + '/locales'
}));
```

## API Reference

### `locales(app, options)`

Patch locales functions to koa app.

- {Application} app: koa app instance.
- {Object} options: optional params
  - {String} functionName: locale function name patch on koa context. Optional, default is `__`.
  - {String} dir: locales resources store directory. Optional, default is `$PWD/locales`.
  - {String} defaultLocale: default locale. Optional, default is `en-US`.
  - {String} queryField: locale field name on query. Optional, default is `locale`.
  - {String} cookieField: locale field name on cookie. Optional, default is `locale`.
  - {String|Number} cookieMaxAge: set locale cookie value max age. Optional, default is `1y`, expired after one year.

```js
locales({
  app: app,
  dir: __dirname + '/app/locales',
  defaultLocale: 'zh-CN'
}));
```

### `context.__(key[, value1[, value2, ...]])`

Get current request locale text.

```js
function* home() {
  this.body = {
    message: this.__('Hello, %s', 'fengmk2')
  };
}
```

Examples:

```js
__('Hello, %s. %s', 'fengmk2', 'koa rock!')
=>
'Hello fengmk2. koa rock!'

__('{0} {0} {1} {1} {1}', ['foo', 'bar'])
=>
'foo foo bar bar bar'
```

## Usage on template

```js
this.locales.__ = this.__.bind(this);
```

[nunjucks] example:

```html
{{ __('Hello, %s', user.name) }}
```

## License

[MIT](LICENSE)


[nunjucks]: https://www.npmjs.com/package/nunjucks
