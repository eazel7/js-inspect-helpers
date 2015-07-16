var esprima = require('esprima'),
    estraverse = require('estraverse');

function getGlobalVariableNames (source, sourceGlobals) {
    var ast = esprima.parse(source);
    var scopeChain = [];
    var identifiers = [];
    var requires = [];
    
    var jsGlobals = sourceGlobals || [
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "escape",
      "eval",
      "isFinite",
      "isNaN",
      "Number",
      "parseFloat",
      "parseInt",
      "String",
      "unescape"];
    
    estraverse.traverse(ast, {
      enter: enter,
      leave: leave
    });
    
    function enter(node){
      if (createsNewScope(node)){
        scopeChain.push([]);
      }
      
        var currentScope = scopeChain[scopeChain.length - 1];
        
        //   console.log(node.type, node);
        if (node.type === 'VariableDeclarator'){
            if (currentScope.indexOf(node.id.name) === -1) currentScope.push(node.id.name);
        }
        if (node.type === 'FunctionDeclaration'){
            var scope = scopeChain[scopeChain.length - 2];
            if (scope.indexOf(node.id.name) === -1) scope.push(node.id.name);
        }
        if (node.type === 'FunctionExpression'){
            for (var i = 0; i < node.params.length; i++) {
                if (currentScope.indexOf(node.params[i].name) === -1) currentScope.push(node.params[i].name);
            }
        }
      
        if (node.type === 'MemberExpression' && node.object.type === 'Identifier'){
            //   if (node.object.name === 'field') debugger;
            if (identifiers.indexOf(node.object.name) === -1) identifiers.push(node.object.name);
        }
      
        if (node.type === 'CallExpression' && node.callee.type === 'Identifier'){
            if (identifiers.indexOf(node.callee.name) === -1) identifiers.push(node.callee.name);
        }
    }
    
    function leave(node){
      if (createsNewScope(node)){
        checkForLeaks(identifiers, scopeChain);
        
        scopeChain.pop();
        identifiers = [];
      }
    }
    
    function isVarDefined(varname, scopeChain){
      for (var i = 0; i < scopeChain.length; i++){
        var scope = scopeChain[i];
        if (scope.indexOf(varname) !== -1){
          return true;
        }
      }
      return false;
    }
    
    function checkForLeaks(assignments, scopeChain){
        for (var i = 0; i < identifiers.length; i++){
            var id = identifiers[i];
            if (jsGlobals.indexOf(id) === -1 && !isVarDefined(id, scopeChain)) {
                if (requires.indexOf(id) === -1) requires.push(id);
            }
        }
    }
    
    function createsNewScope(node){
      return node.type === 'FunctionDeclaration' ||
             node.type === 'FunctionExpression' ||
             node.type === 'Program';
    }
    
    return requires;
}

module.exports = {
  getGlobalVariableNames: getGlobalVariableNames,
  
};
