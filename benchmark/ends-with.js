'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');

const suite = new Benchmark.Suite();

function endsWith(str) {
  return str.endsWith('.properties');
}

function indexOf(str) {
  return str.indexOf('.properties') === str.length - 11;
}

function regexp(str) {
  return /\.properties$/.test(str);
}

console.log('true:');
console.log('  endsWith: %j', endsWith('filename.properties'));
console.log('  indexOf: %j', indexOf('filename.properties'));
console.log('  regexp: %j', regexp('filename.properties'));
console.log('false:');
console.log('  endsWith: %j', endsWith('filename'));
console.log('  indexOf: %j', indexOf('filename'));
console.log('  regexp: %j', regexp('filename'));

suite

.add('endsWith', function() {
  endsWith('filename.properties');
  endsWith('filename');
})
.add('indexOf', function() {
  indexOf('filename.properties');
  indexOf('filename');
})
.add('regexp', function() {
  regexp('filename.properties');
  regexp('filename');
})

.on('cycle', function(event) {
  benchmarks.add(event.target);
})
.on('start', function() {
  console.log('\n  endsWith Benchmark\n  node version: %s, date: %s\n  Starting...',
    process.version, Date());
})
.on('complete', function done() {
  benchmarks.log();
})
.run({ async: false });

// true:
//   endsWith: true
//   indexOf: true
//   regexp: true
// false:
//   endsWith: false
//   indexOf: false
//   regexp: false
//
//   endsWith Benchmark
//   node version: v2.2.1, date: Sun Aug 30 2015 14:39:14 GMT+0800 (CST)
//   Starting...
//   3 tests completed.
//
//   endsWith x 13,491,036 ops/sec ±0.55% (101 runs sampled)
//   indexOf  x 13,796,553 ops/sec ±0.57% (99 runs sampled)
//   regexp   x  4,772,744 ops/sec ±0.57% (98 runs sampled)
