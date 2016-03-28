import { isString, isObject, isFunction } from 'roc/validators';
import createBuilder from '../builder';

import build from '../actions/build';
import dev from '../actions/dev';

import config from '../config/roc.config.js';
import meta from '../config/roc.config.meta.js';

import { name } from './util';

export default {
    config,
    meta,
    name,
    packages: [
        require.resolve('roc-package-base-dev'),
        require.resolve('roc-package-webpack')
    ],
    actions: {
        webpack: {
            extension: name,
            hook: 'build-webpack',
            description: 'Adds base Webpack configuration.',
            action: () => createBuilder
        },
        build: {
            hook: 'run-build-command',
            action: () => build
        },
        dev: {
            hook: 'run-dev-command',
            action: () => dev
        }
    },
    hooks: {
        'build-webpack': {
            description: 'Used to create the final Webpack configuration object.',
            initialValue: { buildConfig: {}, builder: require('webpack')},
            returns: isObject(),
            arguments: [{
                name: 'target',
                validation: isString,
                description: 'The target for which the Webpack configuration should be build for.'
            }]
        },
        'create-watchers': {
            description: 'Used to add watchers that should follow a specific format.',
            initialValue: {},
            returns: isObject(isFunction)
        }
    }
};