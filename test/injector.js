describe('Injector', function () {
  var Injector = require('../injector'),
      assert = require('assert');
  
  function parameterless() {
  }
  
  function withParameter(a) {
    this.a = a;
  }
  
  it('return parameterless constructor object', function () {
    var obj = new Injector().inject(parameterless);
    
    assert(obj.constructor === parameterless);
  });
  
  it('return parametrized constructor object', function () {
    var obj = new Injector().inject(withParameter, {a: 1});
    
    assert(obj.constructor === withParameter);
    assert(obj.a === 1);
  });
});
