var Injector = require('./injector'),
    utils = require('./utils');

function createInjector() {
  return new Injector();
}

module.exports = {
  getFunctionName: utils.getFunctionName,
  getFunctionBody: utils.getFunctionBody,
  getFunctionArgumentNames: utils.getFunctionArgumentNames,
  getGlobalVariableNames: utils.getGlobalVariableNames,
  instrumentErrorReporting: utils.instrumentErrorReporting,
  createInjector: createInjector
};
