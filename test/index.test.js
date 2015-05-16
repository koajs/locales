/**!
 * koa-locales - test/index.test.js
 *
 * Copyright(c) koajs and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var assert = require('assert');
var koa = require('koa');
var request = require('supertest');
var pedding = require('pedding');
var mm = require('mm');
var locales = require('../');

describe('koa-locales.test.js', function () {

  afterEach(mm.restore);

  describe('default options', function () {
    var app = createApp();

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
        novalue: 'key %s ok',
        arguments3: '1 2 3',
        arguments4: '1 2 3 4',
        arguments5: '1 2 3 4 5',
        arguments6: '1 2 3 4 5. 6',
        values: 'foo bar foo bar {2} {100}',
      })
      .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=\w+/)
      .expect(200, done);
    });
  });

  describe('custom options', function () {
    var app = createApp({
      dir: __dirname + '/locales'
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
        novalue: 'key %s ok',
        arguments3: '1 2 3',
        arguments4: '1 2 3 4',
        arguments5: '1 2 3 4 5',
        arguments6: '1 2 3 4 5. 6',
        values: 'foo bar foo bar {2} {100}',
      })
      .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=\w+/)
      .expect(200, done);
    });

    describe('query.locale', function () {
      it('should use query locale: zh-CN', function (done) {
        request(app.callback())
        .get('/?locale=zh-CN')
        .expect({
          email: '邮箱',
          hello: 'fengmk2，今天过得如何？',
          message: 'Hello fengmk2, how are you today? How was your 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
        })
        .expect('Set-Cookie', /^locale=zh\-cn; path=\/; expires=\w+/)
        .expect(200, done);
      });

      it('should use query locale and change cookie locale', function (done) {
        request(app.callback())
        .get('/?locale=zh-CN')
        .set('cookie', 'locale=zh-TW')
        .expect({
          email: '邮箱',
          hello: 'fengmk2，今天过得如何？',
          message: 'Hello fengmk2, how are you today? How was your 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
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
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
        })
        .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=\w+/)
        .expect(200, done);
      });
    });

    describe('cookie.locale', function () {
      it('should use cookie locale: zh-CN', function (done) {
        request(app.callback())
        .get('/?locale=')
        .set('cookie', 'locale=zh-cn')
        .expect({
          email: '邮箱',
          hello: 'fengmk2，今天过得如何？',
          message: 'Hello fengmk2, how are you today? How was your 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
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
          email: '邮箱',
          hello: 'fengmk2，今天过得如何？',
          message: 'Hello fengmk2, how are you today? How was your 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
        })
        .expect('Set-Cookie', /^locale=zh\-cn; path=\/; expires=\w+/)
        .expect(200, done);

        request(app.callback())
        .get('/?locale=')
        .set('Accept-Language', 'zh-CN,zh;q=0.8')
        .expect({
          email: '邮箱',
          hello: 'fengmk2，今天过得如何？',
          message: 'Hello fengmk2, how are you today? How was your 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
        })
        .expect('Set-Cookie', /^locale=zh\-cn; path=\/; expires=\w+/)
        .expect(200, done);

        request(app.callback())
        .get('/?locale=')
        .set('Accept-Language', 'en;q=0.8, es, zh_CN')
        .expect({
          email: '邮箱',
          hello: 'fengmk2，今天过得如何？',
          message: 'Hello fengmk2, how are you today? How was your 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
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
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
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
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
        })
        .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=\w+/)
        .expect(200, done);
      });

      it('should mock acceptsLanguages return string', function (done) {
        mm(app.request, 'acceptsLanguages', function () {
          return 'zh-TW';
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
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
        })
        .expect('Set-Cookie', /^locale=zh\-tw; path=\/; expires=\w+/)
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
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
        })
        .expect('Set-Cookie', /^locale=en\-us; path=\/; expires=\w+/)
        .expect(200, done);
      });
    });
  });
});

function createApp(options) {
  var app = koa();
  locales(app, options);
  var fname = options && options.functionName || '__';

  app.use(function* () {
    this.body = {
      email: this[fname]('Email'),
      hello: this[fname]('Hello %s, how are you today?', 'fengmk2'),
      message: this[fname]('Hello %s, how are you today? How was your %s.', 'fengmk2', 18),
      empty: this[fname](),
      notexists_key: this[fname]('key not exists'),
      empty_string: this[fname](''),
      novalue: this[fname]('key %s ok'),
      arguments3: this[fname]('%s %s %s', 1, 2, 3),
      arguments4: this[fname]('%s %s %s %s', 1, 2, 3, 4),
      arguments5: this[fname]('%s %s %s %s %s', 1, 2, 3, 4, 5),
      arguments6: this[fname]('%s %s %s %s %s.', 1, 2, 3, 4, 5, 6),
      values: this[fname]('{0} {1} {0} {1} {2} {100}', ['foo', 'bar']),
    };
  });

  return app;
}
