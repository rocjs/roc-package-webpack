import { initLog } from 'roc';
import MultiProgress from 'multi-progress';
import pretty from 'prettysize';
import { bold } from 'chalk';
import { cleanPromise, getValueFromPotentialObject } from 'roc-abstract-package-base-dev';
import webpack from 'webpack';

import { invokeHook, name, version } from '../roc/util';

const multi = new MultiProgress();

const log = initLog(name, version);

const handleCompletion = (results) => {
    log.small.log('');
    log.small.success('Webpack build completed!');
    log.small.log('');

    for (const result of results) {
        if (result) {
            const { stats, target } = result;
            const { time, assets } = stats.toJson({ assets: true });
            log.small.log(`${bold(target)} ${time} ms`);
            for (const asset of assets) {
                log.small.log(`${asset.name} ${pretty(asset.size)}`);
            }
            // Create a new line
            log.small.log('');
        }
    }
};

const handleError = ({ error, target }) => {
    const errorMessage = target ? ` for ${bold(target)}` : '';
    log.small.log('');
    log.large.error(
        `Build failed${errorMessage}.`,
        'Webpack Problem',
        error
    );
};

const build = (webpackConfig, target, config, verbose) => {
    // Resolve directly if we did not get a webpackConfig back
    if (!webpackConfig) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        cleanPromise(getValueFromPotentialObject(config.build.output, target))
            .then(() => {
                const compiler = webpack(webpackConfig);

                if (!config.build.disableProgressbar) {
                    const bar = multi.newBar(`Building ${target} [:bar] :percent :elapsed s :webpackInfo`, {
                        complete: '=',
                        incomplete: ' ',
                        total: 100,
                        // Some "magic" math to make sure that the progress bar fits in the terminal window
                        // Based on the lenght of various strings used in the output
                        width: (process.stdout.columns - 52),
                    });

                    compiler.apply(new webpack.ProgressPlugin((percentage, msg) => {
                        bar.update(percentage, {
                            // Only use 20 characters for output to make sure it fits in the window
                            webpackInfo: msg.substring(0, 20),
                        });
                    }));
                }

                compiler.run((error, stats) => {
                    if (error) {
                        return reject({
                            error,
                            target,
                        });
                    }

                    // Improve this in the future.
                    const options = verbose ? null : { errorDetails: false };
                    const statsJson = stats.toJson(options);
                    if (statsJson.errors.length > 0) {
                        statsJson.errors.map(err => log.small.warn(err));
                    }

                    if (statsJson.warnings.length > 0) {
                        statsJson.warnings.map(wrn => log.small.warn(wrn));
                    }

                    return resolve({ stats, target });
                });
            })
        .catch(err => log.small.error('An error happened.', err));
    });
};

/**
 * Builds source files based on the configuration using Babel.
 *
 * @param {{verbose: boolean, settings: Object}} param - Roc settings object.
 *
 * @returns {Function} - A correct Roc action.
 */
export default ({ context: { verbose, config: { settings } } }) => (targets) => () => {
    const webpackTargets = invokeHook('get-webpack-targets');

    const validTargets = targets.filter((target) => webpackTargets.some((webpackTarget) => webpackTarget === target));

    if (validTargets.length === 0) {
        return () => Promise.resolve();
    }

    log.small.log(`Starting the builder using "${settings.build.mode}" as the mode.\n`);

    const promises = validTargets.map((target) => {
        const webpackConfig = invokeHook('build-webpack', target);
        return build(webpackConfig, target, settings, verbose);
    });

    return () => Promise.all(promises)
        .then(handleCompletion)
        .catch(handleError);
};
