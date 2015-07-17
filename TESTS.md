# TOC
   - [getGlobalVariableNames](#getglobalvariablenames)
   - [instrumentErrorReporting](#instrumenterrorreporting)
   - [getFunctionArgumentNames](#getfunctionargumentnames)
   - [getFunctionBody](#getfunctionbody)
   - [getFunctionName](#getfunctionname)
   - [injector](#injector)
   - [Injector](#injector)
<a name=""></a>
 
<a name="getglobalvariablenames"></a>
# getGlobalVariableNames
gets a.

```js
var result = require('..').getGlobalVariableNames('a()');

assert(result);
assert(result.length === 1);
assert(result[0] === 'a');
```

gets a and b.

```js
var result = require('..').getGlobalVariableNames('a(); (function () { a(); b(); })();');

assert(result);
assert(result.length === 2);
assert(result.indexOf('a') > -1);
assert(result.indexOf('b') > -1);
```

gets a and c.

```js
var code = '' +
  'a();' +
  '(function (b) {' +
  ' b();' +
  ' c();' +
  '})(a);';
    var result = require('..').getGlobalVariableNames(code);
    
    assert(result);
    assert(result.length === 2);
    assert(result.indexOf('a') > -1);
    assert(result.indexOf('c') > -1);
```

<a name="instrumenterrorreporting"></a>
# instrumentErrorReporting
instruments error reporting.

```js
var code = 'throw new Error(\'My error\');';
var result = require('..').instrumentErrorReporting(code, 'myCode', 'reportError');
  
var reported = [];
  
try {
  require('vm').runInNewContext(result, {
    reportError: function (e, name) {
      reported.push({
        e: e,
        name: name
      });
    }
  });
  
  assert.fail('Exception not thrown');
} catch (e) {
  assert(reported.length === 1);
  assert(reported[0].e === e);
  assert(reported[0].name === 'myCode');
}
```

for loop error instrumentation is expected NOT be traced two times.

```js
var code = 'for (var i = 0; i < 1; i++) {\n' +
           '  throw new Error(\'Some error: \' + i);\n' +
           '}';
var result = require('..').instrumentErrorReporting(code, 'myCode', 'reportError');
    
var reported = [];
    
try {
  require('vm').runInNewContext(result, {
    reportError: function (e, name) {
      reported.push({
        e: e,
        name: name
      });
    }
  });
  
  assert.fail('Exception not thrown');
} catch (e) {
  assert(reported.length === 1);
  assert(reported[0].e === e);
  assert(reported[0].name === 'myCode');
}
```

should not instrument try{}catch{} blocks.

```js
var code = 'try {\n' +
           '  throw new Error(\'Some error: \' + i);\n' +
           '}catch(e)\n{' +
           'throw e;' +
           '}';
var result = require('..').instrumentErrorReporting(code, 'myCode', 'reportError');
    
var reported = [];
    
try {
  require('vm').runInNewContext(result, {
    reportError: function (e, name) {
      reported.push({
        e: e,
        name: name
      });
    }
  });
  
  assert.fail('Exception not thrown');
} catch (e) {
  assert(reported.length === 1);
  assert(reported[0].e === e);
  assert(reported[0].name === 'myCode');
}
```

<a name="getfunctionargumentnames"></a>
# getFunctionArgumentNames
returns argument names array.

```js
var result = require('..').getFunctionArgumentNames('function (a) {}');

assert(result.length === 1);
assert(result[0] === 'a');
```

returns empty argument names array.

```js
var result = require('..').getFunctionArgumentNames('function () {}');

assert(result.length === 0);
```

takes function objects as parameter.

```js
var result = require('..').getFunctionArgumentNames(function () {});

assert(result.length === 0);
```

<a name="getfunctionbody"></a>
# getFunctionBody
returns function body.

```js
var result = require('..').getFunctionBody('function (a) {console.log(1);}'); 
assert(result === 'console.log(1);');
```

takes function objects as parameter.

```js
var result = require('..').getFunctionBody(function (a) {console.log(1);});
assert(result === 'console.log(1);');
```

<a name="getfunctionname"></a>
# getFunctionName
returns function name.

```js
var result = require('..').getFunctionName('function myFunction(a) {}'); 
assert(result === 'myFunction');
```

takes function objects as parameter.

```js
var result = require('..').getFunctionName(function myFunction(a) {});

assert(result === 'myFunction');
```

<a name="injector"></a>
# injector
creates Injector object.

```js
var injector = require('..').createInjector();

assert(injector.constructor === require('../injector'));
```

<a name="injector"></a>
# Injector
return parameterless constructor object.

```js
var obj = new Injector().inject(parameterless);

assert(obj.constructor === parameterless);
```

return parametrized constructor object.

```js
var obj = new Injector().inject(withParameter, {a: 1});

assert(obj.constructor === withParameter);
assert(obj.a === 1);
```

reports missing parameter.

```js
try {
  new Injector().inject(withParameter, {});
} catch (e) {
  if (e.message !== 'Missing parameter \'a\'') throw e;
}
```

uses default context values.

```js
var obj = new Injector({a: 1}).inject(withParameter, {});

assert(obj.a === 1);
```

creates a child injector.

```js
var parent = new Injector({a: 1});
var child = parent.createChild({a: 2});
var obj = child.inject(withParameter, {});

assert(obj.a === 2);
```

child injector obeys parent injector defaults.

```js
var parent = new Injector({a: 1});
var child = parent.createChild();
var obj = child.inject(withParameter, {});

assert(obj.a === 1);
```

