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
});
