koa-locales
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][cov-image]][cov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/koa-locales.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-locales
[travis-image]: https://img.shields.io/travis/koajs/locales.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/locales
[cov-image]: https://codecov.io/github/koajs/locales/coverage.svg?branch=master
[cov-url]: https://codecov.io/github/koajs/locales?branch=master
[david-image]: https://img.shields.io/david/koajs/locales.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/locales
[download-image]: https://img.shields.io/npm/dm/koa-locales.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-locales

koa locales, i18n solution for koa:

1. All locales resources location on `options.dirs`.
2. resources file supports: `*.js`, `*.json` and `*.properties`, see [examples](test/locales/).
3. One api: `__(key[, value, ...])`.
4. Auto detect request locale from `query`, `cookie` and `header: Accept-Language`.

## Installation

```bash
$ npm install koa-locales --save
```

## Quick start

```js
var koa = require('koa');
var locales = require('koa-locales');

var app = koa();
var options = {
  dirs: [__dirname + '/locales', __dirname + '/foo/locales'],
};
locales(app, options);
```

## API Reference

### `locales(app, options)`

Patch locales functions to koa app.

- {Application} app: koa app instance.
- {Object} options: optional params.
  - {String} functionName: locale function name patch on koa context. Optional, default is `__`.
  - {String} dirs: locales resources store directories. Optional, default is `['$PWD/locales']`.
  - {String} defaultLocale: default locale. Optional, default is `en-US`.
  - {String} queryField: locale field name on query. Optional, default is `locale`.
  - {String} cookieField: locale field name on cookie. Optional, default is `locale`.
  - {Object} localeAlias: locale cookie value map. Optional, default is {}.
  - {String|Number} cookieMaxAge: set locale cookie value max age. Optional, default is `1y`, expired after one year.

```js
locales({
  app: app,
  dirs: [__dirname + '/app/locales'],
  defaultLocale: 'zh-CN',
}));
```

### `context.__(key[, value1[, value2, ...]])`

Get current request locale text.

```js
function* home() {
  this.body = {
    message: this.__('Hello, %s', 'fengmk2'),
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

__('{a} {a} {b} {b} {b}', {a: 'foo', b: 'bar'})
=>
'foo foo bar bar bar'
```

## Usage on template

```js
this.state.__ = this.__.bind(this);
```

[nunjucks] example:

```html
{{ __('Hello, %s', user.name) }}
```

## License

[MIT](LICENSE)


[nunjucks]: https://www.npmjs.com/package/nunjucks
