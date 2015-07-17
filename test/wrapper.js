var Wrapper = require('../wrapper'),
    assert = require('assert');


describe('Wrapper', function () {
  function simple() {
    return {
      'this': this,
      'arguments': arguments
    };
  }
  
  it('.wrapSync wraps a simple function', function () {
    var wrapper = new Wrapper();
    
    var wrapped = wrapper.wrapSync(simple);
    
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
  
  it('.wrapSync wraps a prototype function', function () {
    var wrapper = new Wrapper();
    
    var wrapped = wrapper.wrapSync(complex);
    var obj = new wrapped(1);
    
    obj.test1(2);
    
    assert(obj.a === 1);
    assert(obj.b === 2);
  });
  
  it('wrapped functions calls after method after invoke', function (done) {
    var wrapper = new Wrapper();
    
    var wrapped = wrapper.wrapSync(function (a) {
      return a;
    }, function () {}, function (a) {
      assert(a === 2);
      done();
    });
    
    wrapped(2);
  });
  
  it('wrapped functions calls before function on invoke', function (done) {
    var wrapper = new Wrapper();
    
    var wrapped = wrapper.wrapSync(function () {}, function (b) {
      assert(b === 2);
      
      done();
    });
    
    wrapped(2);
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
