var Benchmark = require('benchmark');
var benchmarks = require('beautify-benchmark');

var suite = new Benchmark.Suite();

function getNestedValue(data, key) {
  var keys = key.split('.');
  for (var i = 0; typeof data === 'object' && i < keys.length; i++) {
    data = data[keys[i]];
  }
  return data;
}

var resource = {
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
                  f: "fff"
                }
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
                              f: "fff"
                            }
                          }
                        }
                      }
                    }
                  }
                },
                post: {
                  fields: {
                    title: 'Subject'
                  }
                }
              }
            }
          }
        }
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
                      f: "fff"
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          fields: {
            title: 'Subject'
          }
        }
      }
    },
    post: {
      fields: {
        title: 'Subject'
      }
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
                    f: "fff"
                  }
                }
              }
            }
          }
        }
      },
      post: {
        fields: {
          title: 'Subject'
        }
      }
    }
  }
};

var fullKey = 'model.user.fields.a.b.c.d.e.f';

console.log('Deeps: ', fullKey.split('.').length);

// console.log('getNestedValue:', getNestedValue(resource, fullKey));

suite

.add('direct read a key', function() {
  resource['model.user.foo.bar.aa'];
})
.add('by nested', function() {
  getNestedValue(resource, fullKey);
})
.on('cycle', function(event) {
  benchmarks.add(event.target);
})
.on('complete', function done() {
  benchmarks.log();
})
.run({ async: false });
