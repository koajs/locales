koa-locales
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][cov-image]][cov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

koa locales, i18n solution for koa:

1. All locales resources location on `options.dirs`.
2. resources file supports: `*.js`, `*.json`, `*.yml`, `*.yaml` and `*.properties`, see [examples](test/locales/).
3. Api: `__(key[, value, ...])`, `__n(key, count[, value, ...])`.
4. Auto detect request locale from `query`, `cookie` and `header: Accept-Language`.

## Installation

```bash
$ npm install koa-locales --save
```

## Quick start

```js
const koa = require('koa');
const locales = require('koa-locales');

const app = koa();
const options = {
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
  - {String} functionnName: locale function (with plurals management) name patch on koa context. Optional, default is `__n`.
  - {String} dirs: locales resources store directories. Optional, default is `['$PWD/locales']`.
  - {String} defaultLocale: default locale. Optional, default is `en-US`.
  - {String} queryField: locale field name on query. Optional, default is `locale`.
  - {String} cookieField: locale field name on cookie. Optional, default is `locale`.
  - {String} cookieDomain: domain on cookie. Optional, default is `''`.
  - {Object} localeAlias: locale value map. Optional, default is `{}`.
  - {String|Number} cookieMaxAge: set locale cookie value max age. Optional, default is `1y`, expired after one year.

```js
locales({
  app: app,
  dirs: [__dirname + '/app/locales'],
  defaultLocale: 'zh-CN',
});
```

#### Aliases

The key `options.localeAlias` allows to not repeat dictionary files, as you can configure to use the same file for *es_ES* for *es*, or *en_UK* for *en*.

```js
locales({
  localeAlias: {
    es: es_ES,
    en: en_UK,
  },
});
```

### `context.__(key[, value1[, value2, ...]])`

Get current request locale text.

```js
async function home(ctx) {
  ctx.body = {
    message: ctx.__('Hello, %s', 'fengmk2'),
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

### `context.__n(key, count[, value1[, value2, ...]])`

Get current request locale text with plural.

Works with package [make-plural](https://github.com/eemeli/make-plural/tree/master/packages/plurals) package. Support approximately 200 languages.

```js
async function home(ctx) {
  ctx.body = {
    message: ctx.__n({one: 'I have one apple.', other: 'I have {0} apples.', 2, 2),
  };
}
```

**Note:**  
The `count` parameter is not part of the displayed values. To have the number 
`count` displayed, one must add this parameter to the list of values.


Examples:

```js
// With english locale
__n({one: 'I have one cat.', other: 'I have not one cat.'}, 0)
=>
'I have not one cat.'

// With french locale
// Note that the parameter 0 is put two times:
// The first one is used as the count parameter and the second is displayed as
// first value ({0}).
__n({one: "J'ai {0} chat.", other: "J'ai {0} chats."}, 0, 0)
=>
"J'ai 0 chat."

// If the targeted plural is not found (here 'one'), 'other' is selected.
__n({other: '{a} {a} {b} {b} {b}'}, 1, {a: 'foo', b: 'bar'})
=>
'foo foo bar bar bar'
```

Russian json file (from [i18n](https://github.com/mashpie/i18n-node#i18n__n)
example):
```json
{
  "cat_key": {
    "one": "%d кошка",
    "few": "%d кошки",
    "many": "%d кошек",
    "other": "%d кошка",
  }
}
```
Use:
```js
__n('cat_key', 0, 0);
=>
'0 кошек'

__n('cat_key', 1, 1); 
=>
'1 кошка'

__n('cat_key', 2, 2);
=>
'2 кошки'

__n('cat_key', 5, 5); 
=>
'5 кошек'

__n('cat_key', 6, 6);
=>
'6 кошек'

__n('cat_key', 21, 21);
=>
'21 кошка'
```

### `context.__getLocale()`

Get locale from query / cookie and header.

### `context.__setLocale()`

Set locale and cookie.

### `context.__getLocaleOrigin()`

Where does locale come from, could be `query`, `cookie`, `header` and `default`.

### `app.__(locale, key[, value1[, value2, ...]])`

Get the given locale text on application level.

```js
console.log(app.__('zh', 'Hello'));
// stdout '你好' for Chinese
```

## Usage on template

```js
this.state.__ = this.__.bind(this);
```

[Nunjucks] example:

```html
{{ __('Hello, %s', user.name) }}
```

[Pug] example:

```pug
p= __('Hello, %s', user.name)
```

[Koa-pug] integration:

You can set the property *locals* on the KoaPug instance, where the default locals are stored.

```js
app.use(async (ctx, next) => {
  koaPug.locals.__ = ctx.__.bind(ctx);
  await next();
});
```

### `app.__n(locale, key, count[, value1[, value2, ...]])`

Get the given locale text with plural management on application level.

```js
console.log(app.__n('zh', {other: 'Hello'}, 0));
// stdout '你好' for Chinese
```

## Usage on template

```js
this.state.__n = this.__n.bind(this);
```

[Nunjucks] example:

```html
{{ __n({other: 'Hello, %s'}, 2, user.name) }}
```

[Pug] example:

```pug
p= __n({other: 'Hello, %s'}, 2, user.name)
```

[Koa-pug] integration:

You can set the property *locals* on the KoaPug instance, where the default locals are stored.

```js
app.use(async (ctx, next) => {
  koaPug.locals.__n = ctx.__n.bind(ctx);
  await next();
});
```

## Debugging

If you are interested on knowing what locale was chosen and why you can enable the debug messages from [debug].

There is two level of verbosity:

```sh
$ DEBUG=koa-locales node .
```
With this line it only will show one line per request, with the chosen language and the origin where the locale come from (queryString, header or cookie).

```sh
$ DEBUG=koa-locales:silly node .
```
Use this level if something doesn't work as you expect. This is going to debug everything, including each translated line of text.

## License

[MIT](LICENSE)


[nunjucks]: https://www.npmjs.com/package/nunjucks
[debug]: https://www.npmjs.com/package/debug
[pug]: https://www.npmjs.com/package/pug
[koa-pug]: https://www.npmjs.com/package/koa-pug

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
