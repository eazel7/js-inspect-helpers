var utils = require('./utils');

function Injector(defaults) {
  this.defaults = defaults || {};
}

Injector.prototype.inject = function (constructor, context) {
  context = context || {};
  var obj = Object.create(constructor.prototype);
  
  var argNames = utils.getFunctionArgumentNames(constructor);
  
  var args = [];
  
  for (var i = 0; i < argNames.length; i++) {
    var argName = argNames[i];
    if (Object.keys(context).indexOf(argName) > -1) {
      args.push(context[argName]);    
    } else if (Object.keys(this.defaults).indexOf(argName) > -1) {
      args.push(this.defaults[argName]);
    } else throw new Error('Missing parameter \'' + argName + '\'');
  }
  
  constructor.apply(obj, args);
  
  return obj;
};

module.exports = Injector;
