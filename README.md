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

### Constructor new Injector()

Should return a simple Injector object.

### Method .inject(constructor, context)

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

