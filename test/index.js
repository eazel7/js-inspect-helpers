var assert = require('assert');

describe('getGlobalVariableNames', function () {
  it('gets a', function () {
    var result = require('..').getGlobalVariableNames('a()');
    
    assert(result);
    assert(result.length === 1);
    assert(result[0] === 'a');
  });
  it('gets a and b', function () {
    var result = require('..').getGlobalVariableNames('a(); (function () { a(); b(); })();');
    
    assert(result);
    assert(result.length === 2);
    assert(result.indexOf('a') > -1);
    assert(result.indexOf('b') > -1);
  });
  it('gets a and c', function () {
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
  });
});
describe('instrumentErrorReporting', function () {
  it('instruments error reporting', function () {
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
  });
  
  it('for loop error instrumentation is expected NOT be traced two times', function () {
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
  });
  
  it('should not instrument try{}catch{} blocks', function () {
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
  });
});

describe('getFunctionArgumentNames', function () {
  it('returns argument names array', function () {
    var result = require('..').getFunctionArgumentNames('function (a) {}');
    
    assert(result.length === 1);
    assert(result[0] === 'a');
  });
  it('returns empty argument names array', function () {
    var result = require('..').getFunctionArgumentNames('function () {}');
    
    assert(result.length === 0);
  });
  it('takes function objects as parameter', function () {
    var result = require('..').getFunctionArgumentNames(function () {});
    
    assert(result.length === 0);
  });
});

describe('getFunctionBody', function () {
  it('returns function body', function () {
    var result = require('..').getFunctionBody('function (a) {console.log(1);}'); 
    assert(result === 'console.log(1);');
  });
  it('takes function objects as parameter', function () {
    var result = require('..').getFunctionBody(function (a) {console.log(1);});
    assert(result === 'console.log(1);');
  });
});

describe('getFunctionName', function () {
  it('returns function name', function () {
    var result = require('..').getFunctionName('function myFunction(a) {}'); 
    assert(result === 'myFunction');
  });
  it('takes function objects as parameter', function () {
    var result = require('..').getFunctionName(function myFunction(a) {});
    
    assert(result === 'myFunction');
  });
});

describe('.createInjector', function () {
  it('creates Injector object', function () {
    var injector = require('..').createInjector();
    
    assert(injector.constructor === require('../injector'));
  });
});

describe('.createWrapper', function () {
  it('creates a Wrapper object', function () {
    var wrapper = require('..').createWrapper();
    
    assert(wrapper.constructor === require('../wrapper'));
  });
});
