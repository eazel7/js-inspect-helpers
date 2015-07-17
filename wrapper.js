var Defer = require('q').defer;

function Wrapper() {
}

Wrapper.prototype.wrapConstructorSync = function (original, mapBefore, mapAfter) {
  mapBefore = mapBefore || {};
  mapAfter = mapAfter || {};
  var wrapSync = this.wrapSync.bind(this);
  
  var createConstructor = function (original, mapBefore, mapAfter, wrapSync) {
    var constructor = function () {
      original.apply(this, arguments);
    };
    
    for (var k in original.prototype) {
      if (typeof(original.prototype[k]) !== 'function') continue;
      constructor.prototype[k] = wrapSync(original.prototype[k], mapBefore[k], mapAfter[k]);
    }
    
    return constructor;
  };
  
  return createConstructor(original, mapBefore, mapAfter, wrapSync);
};

Wrapper.prototype.wrapSync = function (original, before, after) {
  var newFn = function (original, before, after) {
    var newConstructor = function () {
      var originalThis = this;
      
      var originalArguments = [];
      
      for (var i = 0; i < arguments.length; i++) originalArguments.push(arguments[i]);
      
      if (before) before.apply(originalThis, originalArguments);
      var result = original.apply(originalThis, originalArguments);
      if (after) after.apply(originalThis, originalArguments);
      
      return result;
    };
    
    newConstructor.prototype = original.prototype;
    
    return newConstructor;
  };
  
  return newFn(original, before, after);
};

Wrapper.prototype.wrapAsync = function (original, before, after) {
  var newFn = function (original, before, after) {
    return function () {
      var originalThis = this;        
      var originalArguments = [];
      
      for (var i = 0; i < arguments.length; i++) originalArguments.push(arguments[i]);
      
      var defer = new Defer();
      
      process.nextTick(function () {
        try {
          if (before) before.apply(originalThis, originalArguments);
        
          var realResult = original.apply(originalThis, originalArguments);
          
          if (after) after.apply(originalThis, originalArguments);
          
          defer.resolve(realResult);
        } catch (e) {
          defer.reject(e);
        }
      });
      
      return defer.promise;
    };
  };
  
  return newFn(original, before, after);
};

module.exports = Wrapper;
