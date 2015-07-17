var Wrapper = require('../wrapper'),
    assert = require('assert');


describe('Wrapper', function () {
  function simple() {
    return {
      'this': this,
      'arguments': arguments
    };
  }
  
  it('.wrap wraps a simple function', function () {
    var wrapper = new Wrapper();
    
    var wrapped = wrapper.wrap(simple);
    
    var thisOutside = {};
    
    var result = wrapped.apply(thisOutside, [1,2,3]);
    
    assert(thisOutside === result['this']);
    assert(result['arguments'].length === 3);
    assert(result['arguments'][0] === 1);
    assert(result['arguments'][1] === 2);
    assert(result['arguments'][2] === 3);
  });
  
  function complex(a) {
    this.a = a;
  }
  
  complex.prototype.test1 = function (b) {
    this.b = b;
    
    return this.a + this.b;
  };
  
  it('.wrap wraps a prototype function', function () {
    var wrapper = new Wrapper();
    
    var wrapped = wrapper.wrap(complex);
    var obj = new wrapped(1);
    
    obj.test1(2);
    
    assert(obj.a === 1);
    assert(obj.b === 2);
  });
  
  it('wrapped object methods calls before function before calling method', function () {
    var wrapper = new Wrapper({
      test1: function () {
        assert(this === obj);
        throw new Error('Deny');
      }
    });
    
    var wrapped = wrapper.wrap(complex);
    var obj = new wrapped(1);
    
    try {
      obj.test1(2);
      
      assert.fail();
    } catch (e) {
      assert(e.message === 'Deny');
    }
  });
  
  it('wrapped object methods calls a function before calling method', function () {
    var afterCalled = false;
  
    var wrapper = new Wrapper({}, {
      test1: function (b) {
        assert(this === obj);
        assert(b === 2);
        afterCalled = true;
      }
    });
    
    var wrapped = wrapper.wrap(complex);
    var obj = new wrapped(1);
    
    obj.test1(2);
    
    assert(afterCalled);
  });
  
  it('.wrapAsync returns a promise object when wrapping functions', function (done) {
    var wrapper = new Wrapper({}, {});
    
    var wrapped = wrapper.wrapAsync(function (a, b) {
      return a + b;
    });
    var promise = new wrapped(1, 2);
    
    promise.then(function (result) {
      assert(result === 3);
      
      done();
    });
  });
});
