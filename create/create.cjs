#!/usr/bin/env node

'use strict';

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

const MIN_VERSION = 18
if (major < MIN_VERSION) {
    console.error(
        'You are running Node ' +
        currentNodeVersion +
        '.\n' +
        'Create React App requires Node ' + MIN_VERSION + ' or higher. \n' +
        'Please update your version of Node.'
    );
    process.exit(1);
}

const { create } = require('@devicescript/cli')
create()
