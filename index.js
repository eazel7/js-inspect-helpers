var esprima = require('esprima'),
    estraverse = require('estraverse'),
    astronaut = require('astronaut');

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

function instrumentErrorReporting(source, name, errorReportFn) {
        var ast = esprima.parse(source, {loc: true, range: true, comment: true}), marks = [];
        
        astronaut(ast).walk(function (node) {
            var nodeAst = node.ast();
            if (nodeAst.comments && nodeAst.comments.length && nodeAst.comments[0].value === 'origami:ignore') return;
            
            if (node.isBlockStatement() && (!(
                node.parent &&
                node.parent.data &&
                (node.parent.data.type == "IfStatement" ||
                node.parent.data.type == "ForStatement")))) {
                
                if (nodeAst.body.length) {
                    marks.push({
                        offset: nodeAst.body[0].range[0],
                        type: 'start'
                    },{
                        offset: nodeAst.body[nodeAst.body.length - 1].range[1],
                        type: 'end'
                    });
                }
            }
        });
        
        marks.sort(function (m, m2) {
            if (m.offset < m2.offset) return -1;
            if (m.offset > m2.offset) return 1;
            
            return 0;
        });
        
        var instru = {
            start: "try{",
            end: "}catch(e){" + errorReportFn + "(e," + JSON.stringify(name) + ");throw e}"
        };
        
        if (!marks.length) return instru.start + source + instru.end;
        
        var i = 0, prev = 0, newSource = "";
        
        while(marks.length) {
            var current = marks.shift();
            
            newSource = newSource + source.slice(prev, current.offset) + instru[current.type];
            
            prev = current.offset;
        }
        newSource = instru.start + newSource + source.slice(prev) + "\n" + instru.end;
        
        return newSource;
    }

module.exports = {
  getGlobalVariableNames: getGlobalVariableNames,
  instrumentErrorReporting: instrumentErrorReporting
};
