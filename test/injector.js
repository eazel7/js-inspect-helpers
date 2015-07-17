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
  
  it('creates a child injector', function () {
    var parent = new Injector({a: 1});
    var child = parent.createChild({a: 2});
    var obj = child.inject(withParameter, {});
    
    assert(obj.a === 2);
  });
  
  it('child injector obeys parent injector defaults', function () {
    var parent = new Injector({a: 1});
    var child = parent.createChild();
    var obj = child.inject(withParameter, {});
    
    assert(obj.a === 1);
  });
  
  it('sets new default value', function () {
    var injector = new Injector({a: 1});
    
    injector.setDefault('a', 2);
    
    var obj = injector.inject(withParameter, {});
    
    assert(obj.a === 2);
  });
  
  it('unsets default value', function () {
    var injector = new Injector({a: 1});
    
    injector.unsetDefault('a');
    
    try {
      injector.inject(withParameter, {});
    } catch (e) {
      if (e.message !== 'Missing parameter \'a\'') throw e;
    }
  });
});
