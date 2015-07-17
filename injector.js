var utils = require('./utils');

function Injector() {
}

Injector.prototype.inject = function (constructor, context) {
  var obj = Object.create(constructor.prototype);
  
  var argNames = utils.getFunctionArgumentNames(constructor);
  
  var args = [];
  
  for (var i = 0; i < argNames.length; i++) {
    args.push(context[argNames[i]]);
  }
  
  constructor.apply(obj, args);
  
  return obj;
};

module.exports = Injector;
