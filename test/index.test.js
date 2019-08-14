'use strict';

const assert = require('assert');
const koa = require('koa');
const request = require('supertest');
const pedding = require('pedding');
const mm = require('mm');
const locales = require('..');

describe('koa-locales.test.js', function () {
  afterEach(mm.restore);

  describe('default options', function () {
    const app = createApp();

    it('should use default locale: en-US', function (done) {
      request(app.callback())
        .get('/')
        .expect({
          email: 'Email',
          hello: 'Hello fengmk2, how are you today?',
          message: 'Hello fengmk2, how are you today? How was your 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          empty_value: 'emptyValue',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
          object: 'foo bar foo bar {z}',
          'gender': 'model.user.fields.gender',
          'name': 'model.user.fields.name',
        })
        .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=[^;]+ GMT$/)
        .expect(200, done);
    });

    it('should not set locale cookie after header sent', function (done) {
      request(app.callback())
        .get('/headerSent')
        .expect('foo')
        .expect(200, function (err) {
          assert(!err, err && err.message);
          setTimeout(done, 50);
        });
    });
  });

  describe('options.cookieDomain', function () {
    const app = createApp({
      cookieDomain: '.foo.com',
    });

    it('should use default locale: en-US', function (done) {
      request(app.callback())
        .get('/')
        .expect({
          email: 'Email',
          hello: 'Hello fengmk2, how are you today?',
          message: 'Hello fengmk2, how are you today? How was your 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          empty_value: 'emptyValue',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
          object: 'foo bar foo bar {z}',
          'gender': 'model.user.fields.gender',
          'name': 'model.user.fields.name',
        })
        .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=[^;]+; domain=.foo.com$/)
        .expect(200, done);
    });
  });

  describe('custom options', function () {
    const app = createApp({
      dirs: [__dirname + '/locales', __dirname + '/other-locales'],
    });
    const cookieFieldMapApp = createApp({
      dirs: [__dirname + '/locales', __dirname + '/other-locales'],
      localeAlias: {
        'en': 'en-US',
        'de-de': 'de',
      },
    });
    const appNotWriteCookie = createApp({
      dirs: [__dirname + '/locales', __dirname + '/other-locales'],
      writeCookie: false,
    });

    it('should use default locale: en-US', function (done) {
      request(app.callback())
        .get('/')
        .expect({
          email: 'Email',
          hello: 'Hello fengmk2, how are you today?',
          message: 'Hello fengmk2, how are you today? How was your 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          empty_value: 'emptyValue',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
          object: 'foo bar foo bar {z}',
          'gender': 'model.user.fields.gender',
          'name': 'model.user.fields.name',
        })
        .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=\w+/)
        .expect(200, done);
    });

    it('should gettext work on app.__(locale, key, value)', function (done) {
      request(app.callback())
        .get('/app_locale_zh')
        .expect({
          email: '邮箱1',
        })
        .expect(200, done);
    });

    describe('query.locale', function () {
      it('should use query locale: zh-CN', function (done) {
        request(app.callback())
          .get('/?locale=zh-CN')
          .expect({
            email: '邮箱1',
            hello: 'fengmk2，今天过得如何？',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: '',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': '性别',
            'name': '姓名',
          })
          .expect('Set-Cookie', /^locale=zh\-cn; path=\/; expires=\w+/)
          .expect(200, done);
      });

      it('should use query locale: de on *.properties format', function (done) {
        request(app.callback())
          .get('/?locale=de')
          .expect({
            email: 'Emailde',
            hello: 'Hallo fengmk2, wie geht es dir heute?',
            message: 'Hallo fengmk2, wie geht es dir heute? Wie war dein 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: 'emptyValue',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': 'model.user.fields.gender',
            'name': 'model.user.fields.name',
          })
          .expect('Set-Cookie', /^locale=de; path=\/; expires=\w+/)
          .expect(200, done);
      });

      it('should use query locale and change cookie locale', function (done) {
        request(app.callback())
          .get('/?locale=zh-CN')
          .set('cookie', 'locale=zh-TW')
          .expect({
            email: '邮箱1',
            hello: 'fengmk2，今天过得如何？',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: '',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': '性别',
            'name': '姓名',
          })
          .expect('Set-Cookie', /^locale=zh\-cn; path=\/; expires=\w+/)
          .expect(200, done);
      });

      it('should ignore invalid locale value', function (done) {
        request(app.callback())
          .get('/?locale=xss')
          .expect({
            email: 'Email',
            hello: 'Hello fengmk2, how are you today?',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: 'emptyValue',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': 'model.user.fields.gender',
            'name': 'model.user.fields.name',
          })
          .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=\w+/)
          .expect(200, done);
      });

      it('should use localeAlias', function (done) {
        request(cookieFieldMapApp.callback())
          .get('/?locale=de-de')
          .expect({
            email: 'Emailde',
            hello: 'Hallo fengmk2, wie geht es dir heute?',
            message: 'Hallo fengmk2, wie geht es dir heute? Wie war dein 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: 'emptyValue',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': 'model.user.fields.gender',
            'name': 'model.user.fields.name',
          })
          .expect('Set-Cookie', /^locale=de; path=\/; expires=\w+/)
          .expect(200, done);
      });

      it('should use query locale and response without set-cookie', function (done) {
        request(appNotWriteCookie.callback())
          .get('/?locale=zh-CN')
          .expect({
            email: '邮箱1',
            hello: 'fengmk2，今天过得如何？',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: '',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': '性别',
            'name': '姓名',
          })
          .expect(function (res) {
            if (res.headers['set-cookie'] || res.headers['Set-Cookie']) {
              throw new Error('should not write cookie');
            }
          })
          .expect(200, done);
      });

    });

    describe('cookie.locale', function () {
      it('should use cookie locale: zh-CN', function (done) {
        request(app.callback())
          .get('/?locale=')
          .set('cookie', 'locale=zh-cn')
          .expect({
            email: '邮箱1',
            hello: 'fengmk2，今天过得如何？',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: '',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': '性别',
            'name': '姓名',
          })
          .expect(function (res) {
            assert(!res.headers['set-cookie']);
          })
          .expect(200, done);
      });
    });

    describe('Accept-Language', function () {
      it('should use Accept-Language: zh-CN', function (done) {
        done = pedding(3, done);

        request(app.callback())
          .get('/?locale=')
          .set('Accept-Language', 'zh-CN')
          .expect({
            email: '邮箱1',
            hello: 'fengmk2，今天过得如何？',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: '',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': '性别',
            'name': '姓名',
          })
          .expect('Set-Cookie', /^locale=zh\-cn; path=\/; expires=\w+/)
          .expect(200, done);

        request(app.callback())
          .get('/?locale=')
          .set('Accept-Language', 'zh-CN,zh;q=0.8')
          .expect({
            email: '邮箱1',
            hello: 'fengmk2，今天过得如何？',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: '',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': '性别',
            'name': '姓名',
          })
          .expect('Set-Cookie', /^locale=zh\-cn; path=\/; expires=\w+/)
          .expect(200, done);

        request(app.callback())
          .get('/?locale=')
          .set('Accept-Language', 'en;q=0.8, es, zh_CN')
          .expect({
            email: '邮箱1',
            hello: 'fengmk2，今天过得如何？',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: '',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': '性别',
            'name': '姓名',
          })
          .expect('Set-Cookie', /^locale=zh\-cn; path=\/; expires=\w+/)
          .expect(200, done);
      });

      it('should work with "Accept-Language: " header', function (done) {
        request(app.callback())
          .get('/?locale=')
          .set('Accept-Language', '')
          .expect({
            email: 'Email',
            hello: 'Hello fengmk2, how are you today?',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: 'emptyValue',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': 'model.user.fields.gender',
            'name': 'model.user.fields.name',
          })
          .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=\w+/)
          .expect(200, done);
      });

      it('should work with "Accept-Language: en"', function (done) {
        request(app.callback())
          .get('/')
          .set('Accept-Language', 'en')
          .expect({
            email: 'Email',
            hello: 'Hello fengmk2, how are you today?',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: 'emptyValue',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': 'model.user.fields.gender',
            'name': 'model.user.fields.name',
          })
          .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=\w+/)
          .expect(200, done);
      });

      it('should work with "Accept-Language: de-de" by localeAlias', function (done) {
        request(cookieFieldMapApp.callback())
          .get('/')
          .set('Accept-Language', 'ja,de-de;q=0.8')
          .expect({
            email: 'Emailde',
            hello: 'Hallo fengmk2, wie geht es dir heute?',
            message: 'Hallo fengmk2, wie geht es dir heute? Wie war dein 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: 'emptyValue',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': 'model.user.fields.gender',
            'name': 'model.user.fields.name',
          })
          .expect('Set-Cookie', /^locale=de; path=\/; expires=\w+/)
          .expect(200, done);
      });

      it('should mock acceptsLanguages return string', function (done) {
        mm(app.request, 'acceptsLanguages', function () {
          return 'zh-TW';
        });
        request(app.callback())
          .get('/?locale=')
          .expect({
            email: '郵箱',
            hello: 'fengmk2，今天過得如何？',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: '',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': '性別',
            'name': '姓名',
          })
          .expect('Set-Cookie', /^locale=zh\-tw; path=\/; expires=\w+/)
          .expect(200, done);
      });

      it('should mock acceptsLanguages return string', function (done) {
        mm(app.request, 'acceptsLanguages', function () {
          return 'fr';
        });
        request(app.callback())
          .get('/?locale=fr')
          .set('Accept-Language', 'fr;q=0.8, fr, fr')
          .expect({
            email: 'le email',
            hello: 'fengmk2, Comment allez-vous',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: '',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            gender: 'le sexe',
            name: 'prénom',
          })
          .expect('Set-Cookie', /^locale=fr; path=\/; expires=\w+/)
          .expect(200, done);
      });

      it('should mock acceptsLanguages return null', function (done) {
        mm(app.request, 'acceptsLanguages', function () {
          return null;
        });
        request(app.callback())
          .get('/?locale=')
          .expect({
            email: 'Email',
            hello: 'Hello fengmk2, how are you today?',
            message: 'Hello fengmk2, how are you today? How was your 18.',
            empty: '',
            notexists_key: 'key not exists',
            empty_string: '',
            empty_value: 'emptyValue',
            novalue: 'key %s ok',
            arguments3: '1 2 3',
            arguments4: '1 2 3 4',
            arguments5: '1 2 3 4 5',
            arguments6: '1 2 3 4 5. 6',
            values: 'foo bar foo bar {2} {100}',
            object: 'foo bar foo bar {z}',
            'gender': 'model.user.fields.gender',
            'name': 'model.user.fields.name',
          })
          .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=\w+/)
          .expect(200, done);
      });
    });

    describe('__getLocale and __getLocaleOrigin', function () {
      it('should __getLocale and __getLocaleOrigin from cookie', function () {
        return request(app.callback())
          .get('/origin')
          .set('cookie', 'locale=de')
          .expect(200, { locale: 'de', localeOrigin: 'cookie' });
      });

      it('should __getLocale and __getLocaleOrigin from query', function () {
        return request(app.callback())
          .get('/origin?locale=de')
          .expect(200, { locale: 'de', localeOrigin: 'query' });
      });

      it('should __getLocale and __getLocaleOrigin from header', function () {
        return request(app.callback())
          .get('/origin')
          .set('Accept-Language', 'zh-cn')
          .expect(200, { locale: 'zh-cn', localeOrigin: 'header' });
      });

      it('should __getLocale and __getLocaleOrigin from default', function () {
        return request(app.callback())
          .get('/origin')
          .expect(200, { locale: 'en-us', localeOrigin: 'default' });
      });
    });

    describe('__setLocale', function () {
      it('should set locale and cookie', function () {
        return request(app.callback())
          .get('/set')
          .set('cookie', 'locale=de')
          .expect(200, { locale: 'zh-hk', localeOrigin: 'set' })
          .expect('Set-Cookie', /^locale=zh\-hk; path=\/; expires=[^;]+ GMT$/);
      });
    });
  });
});

function createApp(options) {
  const app = koa();
  locales(app, options);
  const fname = options && options.functionName || '__';

  app.use(function* () {
    if (this.url === '/app_locale_zh') {
      this.body = {
        email: this.app[fname]('zh-cn', 'Email'),
      };
      return;
    }

    if (this.path === '/origin') {
      assert(this.__getLocaleOrigin() === this.__getLocaleOrigin());
      this.body = {
        locale: this.__getLocale(),
        localeOrigin: this.__getLocaleOrigin(),
      };
      return;
    }

    if (this.path === '/set') {
      this.__getLocale();
      this.__setLocale('zh-tw');
      this.__setLocale('zh-hk');
      this.body = {
        locale: this.__getLocale(),
        localeOrigin: this.__getLocaleOrigin(),
      };
      return;
    }

    if (this.url === '/headerSent') {
      this.body = 'foo';
      const that = this;
      setTimeout(function () {
        that[fname]('Email');
      }, 10);
      return;
    }

    this.body = {
      email: this[fname]('Email'),
      name: this[fname]('model.user.fields.name'),
      gender: this[fname]('model.user.fields.gender'),
      hello: this[fname]('Hello %s, how are you today?', 'fengmk2'),
      message: this[fname]('Hello %s, how are you today? How was your %s.', 'fengmk2', 18),
      empty: this[fname](),
      notexists_key: this[fname]('key not exists'),
      empty_string: this[fname](''),
      empty_value: this[fname]('emptyValue'),
      novalue: this[fname]('key %s ok'),
      arguments3: this[fname]('%s %s %s', 1, 2, 3),
      arguments4: this[fname]('%s %s %s %s', 1, 2, 3, 4),
      arguments5: this[fname]('%s %s %s %s %s', 1, 2, 3, 4, 5),
      arguments6: this[fname]('%s %s %s %s %s.', 1, 2, 3, 4, 5, 6),
      values: this[fname]('{0} {1} {0} {1} {2} {100}', ['foo', 'bar']),
      object: this[fname]('{foo} {bar} {foo} {bar} {z}', { foo: 'foo', bar: 'bar' }),
    };
  });

  return app;
}
