import MultiProgress from 'multi-progress';
import pretty from 'prettysize';
import { red, green, cyan, bold } from 'chalk';

import { cleanPromise, getValueFromPotentialObject } from 'roc-package-base-dev';

import { invokeHook } from '../roc/util';

const multi = new MultiProgress();

const handleCompletion = (results) => {
    console.log(green('\nWebpack build completed!\n'));

    for (const result of results) {
        if (result) {
            const { stats, target } = result;
            const { time, assets } = stats.toJson({assets: true});
            console.log(bold(target) + ` ${time} ms`);
            for (const asset of assets) {
                console.log(`${asset.name} ${pretty(asset.size)}`);
            }
            console.log();
        }
    }
};

const handleError = (verbose) => (error) => {
    const errorMessage = error.target ? ' for ' + bold(error.target) : '';

    console.log(red(`\n\nWebpack build failed${errorMessage}\n`));

    console.log(red(error.message));

    if (verbose) {
        console.log(error.stack);
    } else {
        console.log('\nRun with verbose for more output. (--verbose)\n');
    }
    /* eslint-disable no-process-exit */
    // Make sure we do not continue trying to build other targets since we want everything to complete
    process.exit(1);
    /* eslint-enable */
};

const build = (rocBuilder, target, config, verbose) => {
    // Resolve directly if we did not get a builder back
    if (!rocBuilder) {
        return Promise.resolve();
    }

    const { buildConfig, builder } = rocBuilder;

    return new Promise((resolve, reject) => {
        cleanPromise(getValueFromPotentialObject(config.build.output, target))
            .then(() => {
                const compiler = builder(buildConfig);

                if (!config.build.disableProgressbar) {
                    const bar = multi.newBar(`Building ${target} [:bar] :percent :elapsed s :webpackInfo`, {
                        complete: '=',
                        incomplete: ' ',
                        total: 100,
                        // Some "magic" math to make sure that the progress bar fits in the terminal window
                        // Based on the lenght of various strings used in the output
                        width: (process.stdout.columns - 52)
                    });

                    compiler.apply(new builder.ProgressPlugin(function(percentage, msg) {
                        bar.update(percentage, {
                            // Only use 20 characters for output to make sure it fits in the window
                            webpackInfo: msg.substring(0, 20)
                        });
                    }));
                }

                compiler.run((error, stats) => {
                    if (error) {
                        // Extend the error with what target that failed
                        error.target = target;
                        return reject(error);
                    }

                    // Improve this in the future.
                    const options = verbose ? null : {errorDetails: false};
                    const statsJson = stats.toJson(options);
                    if (statsJson.errors.length > 0) {
                        statsJson.errors.map(err => console.log(err));
                    }

                    if (statsJson.warnings.length > 0) {
                        statsJson.warnings.map(wrn => console.log(wrn));
                    }

                    return resolve({stats, target});
                });
            })
        .catch(err => console.log(err, err.stack));
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
    const webpackTargets = invokeHook('get-webpack-targets');

    const validTargets = targets.filter((target) => webpackTargets.some((webpackTarget) => webpackTarget === target));

    if (validTargets.length === 0) {
        return Promise.resolve();
    }

    /* eslint-disable no-console */
    console.log(cyan(`Starting the builder using "${settings.build.mode}" as the mode.\n`));
    /* eslint-enable */

    const promises = validTargets.map((target) => {
        const builder = invokeHook('build-webpack', target);
        return build(builder, target, settings, verbose);
    });

    return () => Promise.all(promises)
        .then(handleCompletion)
        .catch(handleError(verbose));
};
