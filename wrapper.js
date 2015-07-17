var Defer = require('q').defer;

function Wrapper(before, after) {
  this.before = before || {};
  this.after = after || {};
}

Wrapper.prototype.wrap = function (original) {
  var before = this.before,
      after = this.after;
  
  var newFn = function () {
    var newConstructor = function () {
      var originalThis = this;
      
      var originalArguments = [];
      for (var i = 0; i < arguments.length; i++) originalArguments.push(arguments[i]);
      
      return original.apply(originalThis, originalArguments);
    };
    
    newConstructor.prototype = {};
    
    for (var k in original.prototype) {
      newConstructor.prototype[k] = function () {
        if (before[k]) before[k].apply(this, arguments);
        var result = original.prototype[k].apply(this, arguments);
        
        if (after[k]) after[k].apply(this, arguments);
        
        return result;
      };
    }
    
    return newConstructor;
  };
  
  return newFn(original);
};

Wrapper.prototype.wrapAsync = function (original) {
  var before = this.before,
      after = this.after;
  
  var newFn = function (original, before, after) {
    return function () {
      var originalThis = this;        
      var originalArguments = [];
      
      for (var i = 0; i < arguments.length; i++) originalArguments.push(arguments[i]);
      
      var defer = new Defer();
      
      try {
        var realResult = original.apply(originalThis, originalArguments);
        
        defer.resolve(realResult);
      } catch (e) {
        defer.reject(e);
      }
      
      return defer.promise;
    };
  };
  
  return newFn(original, before, after);
};

module.exports = Wrapper;
