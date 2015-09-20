'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');

const suite = new Benchmark.Suite();

function slice() {
  return Array.prototype.slice.call(arguments);
}

function slice0() {
  return Array.prototype.slice.call(arguments, 0);
}

function forLoop() {
  const args = new Array(arguments.length);
  for(let i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }
  return args;
}

console.log('slice(0, 1, 2, 3, 4, 5, 6, 7): %j', slice(0, 1, 2, 3, 4, 5, 6, 7));
console.log('slice0(0, 1, 2, 3, 4, 5, 6, 7): %j', slice0(0, 1, 2, 3, 4, 5, 6, 7));
console.log('forLoop(0, 1, 2, 3, 4, 5, 6, 7): %j', forLoop(0, 1, 2, 3, 4, 5, 6, 7));

suite

.add('Array.prototype.slice.call(arguments)', function() {
  slice(0, 1, 2, 3, 4, 5, 6, 7);
})
.add('Array.prototype.slice.call(arguments, 0)', function() {
  slice0(0, 1, 2, 3, 4, 5, 6, 7);
})
.add('for(let i = 0; i < args.length; i++) {}', function() {
  forLoop(0, 1, 2, 3, 4, 5, 6, 7);
})

.on('cycle', function(event) {
  benchmarks.add(event.target);
})
.on('start', function() {
  console.log('\n  arguments to args Benchmark\n  node version: %s, date: %s\n  Starting...',
    process.version, Date());
})
.on('complete', function done() {
  benchmarks.log();
})
.run({ async: false });

// slice(0, 1, 2, 3, 4, 5, 6, 7): [0,1,2,3,4,5,6,7]
// slice0(0, 1, 2, 3, 4, 5, 6, 7): [0,1,2,3,4,5,6,7]
// forLoop(0, 1, 2, 3, 4, 5, 6, 7): [0,1,2,3,4,5,6,7]
//
//   arguments to args Benchmark
//   node version: v2.4.0, date: Tue Jul 21 2015 01:39:54 GMT+0800 (CST)
//   Starting...
//   3 tests completed.
//
//   Array.prototype.slice.call(arguments)    x  4,537,649 ops/sec ±1.18% (94 runs sampled)
//   Array.prototype.slice.call(arguments, 0) x  4,605,132 ops/sec ±0.87% (96 runs sampled)
//   for(let i = 0; i < args.length; i++) {}  x 30,435,436 ops/sec ±0.91% (93 runs sampled)
