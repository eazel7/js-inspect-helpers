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
  
  it('reports missing parameter', function () {
    try {
      new Injector().inject(withParameter, {});
    } catch (e) {
      if (e.message !== 'Missing parameter \'a\'') throw e;
    }
  });
  
  it('uses default context values', function () {
    var obj = new Injector({a: 1}).inject(withParameter, {});
    
    assert(obj.a === 1);
  });
});
