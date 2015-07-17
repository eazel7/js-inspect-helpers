var utils = require('./utils');

function Injector() {
}

Injector.prototype.inject = function (constructor, context) {
  var obj = Object.create(constructor.prototype);
  
  var argNames = utils.getFunctionArgumentNames(constructor);
  
  var args = [];
  
  for (var i = 0; i < argNames.length; i++) {
    if (Object.keys(context).indexOf(argNames[i]) === -1) throw new Error('Missing parameter \'' + argNames[i] + '\'');
  
    var argVal = context[argNames[i]];
    
    args.push(argVal);
  }
  
  constructor.apply(obj, args);
  
  return obj;
};

module.exports = Injector;
