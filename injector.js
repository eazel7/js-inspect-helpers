var utils = require('./utils');

function Injector(defaults, parent) {
  this.defaults = defaults || {};
  this.parent = parent;
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
    } else if (this.parent && this.hasDefaultValue(argName)) {
      args.push(this.parent.getDefaultValue(argName));
    } else throw new Error('Missing parameter \'' + argName + '\'');
  }
  
  constructor.apply(obj, args);
  
  return obj;
};

Injector.prototype.hasDefaultValue = function (key) {
  if (Object.keys(this.defaults).indexOf(key) > -1) return true;
  else if (this.parent) return this.parent.hasDefaultValue(key);
  else return false;
};


Injector.prototype.getDefaultValue = function (key) {
  if (Object.keys(this.defaults).indexOf(key) > -1) return this.defaults[key];
  else if (this.parent) return this.parent.getDefaultValue(key);
  else return undefined;
};

Injector.prototype.createChild = function (newDefaults) {
  return new Injector(newDefaults, this);
};

Injector.prototype.setDefault = function (key, value) {
  this.defaults[key] = value;
};

Injector.prototype.unsetDefault = function (key) {
  delete this.defaults[key];
};

module.exports = Injector;
