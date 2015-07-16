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

