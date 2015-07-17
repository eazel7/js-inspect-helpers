#! /bin/bash

mocha -R markdown > TESTS.md &&
mkdir -p build &&
node ./build/bump_version &&
node_modules/.bin/browserify index.js > build/browser.js
