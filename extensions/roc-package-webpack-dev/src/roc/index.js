import { generateDependencies, lazyFunctionRequire } from 'roc';
import { isString, isObject, isFunction, isArray } from 'roc/validators';

import config from '../config/roc.config.js';
import meta from '../config/roc.config.meta.js';

import { name } from './util';

const lazyRequire = lazyFunctionRequire(require);

export default {
    description: 'Package providing module support.',
    config,
    meta,
    plugins: [
        require.resolve('roc-plugin-babel'),
    ],
    packages: [
        require.resolve('roc-abstract-package-base-dev'),
    ],
    dependencies: {
        exports: generateDependencies(require('../../package.json'), 'webpack') // eslint-disable-line
    },
    actions: [{
        hook: 'babel-config',
        extension: name,
        action: () => () => (babelConfig) => {
            babelConfig.presets.push(
                require.resolve('babel-preset-es2015'),
                require.resolve('babel-preset-stage-1')
            );
            babelConfig.plugins.push(
                require.resolve('babel-plugin-transform-runtime'),
                require.resolve('babel-plugin-transform-decorators-legacy')
            );

            return babelConfig;
        },
    }, {
        hook: 'build-webpack',
        description: 'Adds base Webpack configuration and read webpack from the configuration.',
        action: lazyRequire('../webpack'),
        post: lazyRequire('../webpack/post'),
    }, {
        description: 'Build with Webpack.',
        hook: 'run-build-command',
        action: lazyRequire('../actions/build'),
    }, {
        description: 'Run in development mode using Webpack.',
        hook: 'run-dev-command',
        action: lazyRequire('../actions/dev'),
    }],
    hooks: {
        'build-webpack': {
            description: 'Used to create the final Webpack configuration object.',
            initialValue: {},
            returns: isObject(),
            arguments: {
                target: {
                    validator: isString,
                    description: 'The target for which the Webpack configuration should be build for.',
                },
            },
        },
        'get-webpack-targets': {
            description: 'Used to inform which targets that should be considered as Webpack targets. Actions should ' +
                'concat the previousValue to build the complete value.',
            initialValue: [],
            returns: isArray(isString),
        },
        'create-watchers': {
            description: 'Used to add watchers that should follow a specific format.',
            initialValue: {},
            returns: isObject(isFunction),
        },
        'babel-config': {
            description: 'Used to create a Babel configuration to be used in the Webpack build.',
            initialValue: {},
            returns: isObject(),
            arguments: {
                target: {
                    validator: isString,
                    description: 'The target that is used.',
                },
            },
        },
    },
    commands: {
        development: {
            build: {
                override: 'roc-abstract-package-base-dev',
                settings: ['build'],
                description: 'Build the current project.',
            },
            dev: {
                override: 'roc-abstract-package-base-dev',
                settings: true,
                description: 'Starts the current project in development mode.',
            },
        },
    },
};
