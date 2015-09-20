'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');

const suite = new Benchmark.Suite();

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function flattening(data) {

  const result = {};

  function deepFlat (data, keys) {
    Object.keys(data).forEach(function(key) {
      const value = data[key];
      const k = keys ? key : keys + '.' + key;
      if (!isObject(value)) {
        return result[k] = String(value);
      }
      deepFlat(value, k);
    });
  }

  deepFlat(data, '');

  return result;
}

function flattening_1(data) {

  const result = {};

  function deepFlat (data, keys) {
    Object.keys(data).forEach(function(key) {
      const value = data[key];
      const k = keys.concat(key);
      if (isObject(value)) {
        deepFlat(value, k);
      } else {
        result[k.join('.')] = String(value);
      }
    });
  }

  deepFlat(data, []);

  return result;
}

function flattening_2(data) {

  const result = {};

  function deepFlat (data, flatKey, key) {
    const value = data[key];
    if (isObject(value)) {
      Object.keys(value).forEach(function(k) {
        deepFlat(value, flatKey + '.' + k, k);
      });
    } else {
      result[flatKey] = String(value);
    }
  }

  Object.keys(data).forEach(function(key) {
    deepFlat(data, key, key);
  });
  return result;
}

const resource = {
  'model.user.foo.bar.aa': 'Hello',
  model: {
    user: {
      fields: {
        name: 'Real Name',
        age: 'Age',
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: 'fff',
                },
              },
              model: {
                user: {
                  fields: {
                    name: 'Real Name',
                    age: 'Age',
                    a: {
                      b: {
                        c: {
                          d: {
                            e: {
                              f: 'fff',
                            },
                          },
                        },
                      },
                    },
                  },
                },
                post: {
                  fields: {
                    title: 'Subject',
                  },
                },
              },
            },
          },
        },
      },
      model: {
        user: {
          fields: {
            name: 'Real Name',
            age: 'Age',
            a: {
              b: {
                c: {
                  d: {
                    e: {
                      f: 'fff',
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          fields: {
            title: 'Subject',
          },
        },
      },
    },
    post: {
      fields: {
        title: 'Subject',
      },
    },
    model: {
      user: {
        fields: {
          name: 'Real Name',
          age: 'Age',
          a: {
            b: {
              c: {
                d: {
                  e: {
                    f: 'fff',
                  },
                },
              },
            },
          },
        },
      },
      post: {
        fields: {
          title: 'Subject',
        },
      },
    },
  },
};

//console.log('flattening:', flattening(resource));
//console.log('flattening_1:', flattening_1(resource));
//console.log('flattening_2:', flattening_2(resource));

suite

.add('flattening', function() {
  flattening(resource);
})
.add('flattening_1', function() {
  flattening_1(resource);
})
.add('flattening_2', function() {
  flattening_2(resource);
})
.on('cycle', function(event) {
  benchmarks.add(event.target);
})
.on('complete', function done() {
  benchmarks.log();
})
.run({ async: false });

//$ node benchmark/flattening.js
//
//  3 tests completed.
//
//  flattening   x 32,863 ops/sec ±0.83% (98 runs sampled)
//  flattening_1 x 10,434 ops/sec ±0.73% (96 runs sampled)
//  flattening_2 x 21,734 ops/sec ±1.04% (95 runs sampled)
