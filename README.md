# js-inspect-helpers

A collection of JS code inspection functions. Migrating from client side code originally written for
[Origami](https://github.com/eazel7/origami).

### `getGlobalVariableNames(code)` function

```
require('js-inspect-helpers').getGlobalVariableNames('a()');
```
should return `['a']`

but should support more complex code like:

```
var code = '' +
'a();' +
'(function (b) {' +
' b();' +
' c();' +
'})(a);';

require('js-inspect-helpers').getGlobalVariableNames(code);
```

should return `['a','c']`, knowing that `b()` is referring to a parameter name, etc.


### `instrumentErrorReporting(code, name)` function

```
require('js-inspect-helpers').instrumentErrorReporting('a()', 'reportError', 'myCode');
```
should return:

```
try {
  a();
} catch(e) {
  reportError(e,'myCode');
  throw e;
}
```

> Indentation added for reading purposes. Added code blocks are collapsed so the error line number is the same as in the original code.

So the transformed code keep working just the same, except that uncatched exceptions are reported along the way to the `reportError(e, name)` function.

### `getFunctionBody`

Receives a string or a function object and returns function body block as a string.

```
require('js-inspection-helpers').getFunctionBody(function () {console.log(1);});
```

should return:

```
'console.log(1);'
```

### `getFunctionArgumentNames`

Receives a string or a function object and returns function argument names as an array of strings.

```
require('js-inspection-helpers').getFunctionBody(function (a,b,c) {});
```

should return:

```
['a','b','c']
```

### `createInjector`

Should return a simple Injector object.

## Injector object

### Constructor new Injector(defaults)

Should return a simple Injector object. Defaults is an optional object.

### Method .inject(constructor, [context])

Should create a JS object using the constructor function and passing the arguments from dictionary object, matching them by name.

This code should be valid:

```
function MyClass(someValue) {
  this.someValue = someValue;
}

var injector = require('js-inspection-helpers').createInjector();

var obj = injector.inject(MyClass, { someValue: 1 });

assert(obj.someValue === 1);
```

Also, if an argument is missing in context collection, but present in the defaults, it should be used.

This code should be valid:

```
function MyClass(someValue) {
  this.someValue = someValue;
}

var injector = require('js-inspection-helpers').createInjector({someValue: 2});

var obj = injector.inject(MyClass, {});

assert(obj.someValue === 2);
```

### Method .createChild(newDefaults)

Creates a child injector that falls back to it's parent defaults.

This code should be valid:

```
function MyClass(someValue, someValue2) {
  this.someValue = someValue;
  this.someValue2 = someValue2;
}

var parent = require('js-inspection-helpers').createInjector({someValue:2});
var child = parent.createChild({someValue2: 2});

var obj = child.inject(MyClass, {});

assert(obj.someValue === 1);
assert(obj.someValue2 === 2);
```

### Method .setDefault(key, value)

Sets a new default value for an injector.

This code should be valid:

```
function MyClass(someValue) {
  this.someValue = someValue;
}

var injector = require('js-inspection-helpers').createInjector({someValue:1});

injector.setDefault('someValue', 2);
var obj = injector.inject(MyClass, {});

assert(obj.someValue === 2);
```

### Method .unsetDefault(key, value)

Unsets a new default value for an injector.

This code should throw a 'Missing parameter' error:

```
function MyClass(someValue) {
  this.someValue = someValue;
}

var injector = require('js-inspection-helpers').createInjector({someValue:1});

injector.unsetDefault('someValue');
injector.inject(MyClass, {});
```


