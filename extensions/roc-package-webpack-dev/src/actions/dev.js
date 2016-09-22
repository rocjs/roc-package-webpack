import { stat, writeFileSync } from 'fs';
import { join } from 'path';

import { sync } from 'mkdirp';
import { appendSettings, initLog } from 'roc';
import { cleanPromise } from 'roc-abstract-package-base-dev';
import webpack from 'webpack';

import config from '../config/roc.config.js';
import { invokeHook, name, version } from '../roc/util';

const log = initLog(name, version);

const writeStatsFile = (buildPath, scriptPath) =>
    new Promise((resolve) => {
        stat(buildPath, (err) => {
            if (err) {
                sync(buildPath);
            }

            writeFileSync(join(buildPath, 'webpack-stats.json'), JSON.stringify({
                script: [`${scriptPath}`],
                css: '',
            }));

            return resolve();
        });
    });

const createWatcher = (verbose, settings, target, webpackConfig, watcher) => {
    // Resolve directly if we did not get a webpackConfig back
    if (!webpackConfig) {
        return Promise.resolve();
    }

    return cleanPromise(webpackConfig.rocMetaInfo.outputPath)
        .then(async function watch() {
            const compiler = webpack(webpackConfig);
            await writeStatsFile(webpackConfig.output.path, webpackConfig.output.publicPath +
                webpackConfig.output.filename.replace(/\[name\]/, webpackConfig.rocMetaInfo.outputName));

            if (!watcher[target]) {
                return Promise.resolve();
            }

            return watcher[target](compiler);
        })
        .catch((error) => {
            log.large.error(
                'Webpack Watcher',
                `A error occurred while starting the ${target} watcher`,
                error
            );
        });
};

/**
 * Builds source files based on the configuration using Babel.
 *
 * @param {{context: Object}} param - Roc settings object.
 *
 * @returns {Function} - A correct Roc action.
 */
export default ({ context: { verbose, config: { settings } } }) => (targets) => () => {
    const webpackTargets = invokeHook('get-webpack-targets');

    const validTargets = targets.filter((target) => webpackTargets.some((webpackTarget) => webpackTarget === target));

    if (validTargets.length === 0) {
        return Promise.resolve();
    }

    // Make sure that we are in dev mode
    let newSettings = settings;
    if (settings.build.mode !== 'dev') {
        if (settings.build.mode && settings.build.mode !== config.settings.build.mode) {
            log.small.warn(`The mode in the configuration was ${settings.build.mode} but it needs ` +
                'to be "dev". It has been automatically set to "dev" during this watch run.');
        }
        newSettings = appendSettings({ build: { mode: 'dev' } });
    }

    // Build watcher structure
    const watchers = invokeHook('create-watchers');

    // Build each one in order
    return Promise.all(targets.map(async function builders(target) {
        const webpackConfig = invokeHook('build-webpack', target);
        return await createWatcher(verbose, newSettings, target, webpackConfig, watchers);
    }));
};
