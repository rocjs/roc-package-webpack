import { stat, writeFileSync } from 'fs';
import { join } from 'path';
import { red, yellow } from 'chalk';
import { sync } from 'mkdirp';

import { getSettings, appendSettings } from 'roc';
import { cleanPromise } from 'roc-package-base-dev';

import config from '../config/roc.config.js';
import { invokeHook } from '../roc/util';

const writeStatsFile = (buildPath, scriptPath) => {
    return new Promise((resolve) => {
        stat(buildPath, (err) => {
            if (err) {
                sync(buildPath);
            }

            writeFileSync(join(buildPath, 'webpack-stats.json'), JSON.stringify({
                script: [`${scriptPath}`],
                css: ''
            }));

            return resolve();
        });
    });
};

const createWatcher = (verbose, settings, target, rocBuilder, watcher) => {
    // Resolve directly if we did not get a builder back

    if (!rocBuilder) {
        return Promise.resolve();
    }

    const { buildConfig, builder, info } = rocBuilder;

    return cleanPromise(info.outputPath)
        .then(async function() {
            const compiler = builder(buildConfig);
            await writeStatsFile(buildConfig.output.path, buildConfig.output.publicPath +
                buildConfig.output.filename.replace(/\[name\]/, info.outputName));

            if (!watcher[target]) {
                return Promise.resolve();
            }

            return watcher[target](compiler);
        })
        .catch((error) => {
            /* eslint-disable no-console */
            console.log(red('\nWatch failed!\n'));
            console.log(`A error occoured while starting the ${target} watcher`);
            console.log(error.stack);
            /* eslint-enable */
        });
};

/**
 * Builds source files based on the configuration using Babel.
 *
 * @param {{verbose: boolean, settings: Object}} param - Roc settings object.
 *
 * @returns {Function} - A correct Roc action.
 */
export default ({ verbose, settings }) => (targets) => () => {
    // Make sure that we are in dev mode
    if (settings.build.mode !== 'dev') {
        if (settings.build.mode && settings.build.mode !== config.settings.build.mode) {
            /* eslint-disable no-console */
            console.log(yellow(`The mode in the configuration was ${settings.build.mode} but it needs ` +
                `to be "dev". It has been automatically set to "dev" during this watch run.`));
            /* eslint-enable */
        }

        appendSettings({ build: {mode: 'dev'} });
        settings = getSettings();
    }

    // Build watcher structure
    const watchers = invokeHook('create-watchers');

    // Build each one in order
    return Promise.all(targets.map(async function (target) {
        const builder = invokeHook('build-webpack', target);
        await createWatcher(verbose, settings, target, builder, watchers);
    }));
};
