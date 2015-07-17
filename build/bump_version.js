var packageJson = require(require('path').resolve('.', 'package.json')),
    semver = require('semver');
    
packageJson.version = semver.parse(packageJson.version).inc('patch').toString();

require('fs').writeFileSync('package.json', JSON.stringify(packageJson, undefined, 2));
