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
