var Injector = require('./injector'),
    Wrapper = require('./wrapper'),
    utils = require('./utils');

function createInjector() {
  return new Injector();
}

function createWrapper() {
  return new Wrapper();
}

module.exports = {
  getFunctionName: utils.getFunctionName,
  getFunctionBody: utils.getFunctionBody,
  getFunctionArgumentNames: utils.getFunctionArgumentNames,
  getGlobalVariableNames: utils.getGlobalVariableNames,
  instrumentErrorReporting: utils.instrumentErrorReporting,
  createInjector: createInjector,
  createWrapper: createWrapper
};
