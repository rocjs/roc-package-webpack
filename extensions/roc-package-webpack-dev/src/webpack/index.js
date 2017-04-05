import { join } from 'path';

import { underline } from 'chalk';
import { getSettings, getAbsolutePath, fileExists, getResolveRequest, initLog } from 'roc';
import { getValueFromPotentialObject } from 'roc-abstract-package-base-dev';
import webpack from 'webpack';

import runThroughBabel from '../helpers/runThroughBabel';
import { addTrailingSlash, getDevPath } from '../helpers';
import { name, version } from '../roc/util';

import { writeStats } from './utils/stats';
import RocExportPlugin from './utils/rocExportWebpackPlugin';

const log = initLog(name, version);

/**
 * Creates a builder.
 *
 * @param {!string} target - a target: should be either "client" or "server"
 * @param {rocBuilder} rocBuilder - A rocBuilder to base everything on.
 * @returns {rocBuilder}
 */
export default () => (target, babelConfig) => (webpackConfig = {}) => {
    const newWebpackConfig = { ...webpackConfig };
    const buildSettings = getSettings('build');

    const DEV = (buildSettings.mode === 'dev');
    const DIST = (buildSettings.mode === 'dist');

    let ENV = buildSettings.mode;
    if (DIST) {
        ENV = 'production';
    } else if (DEV) {
        ENV = 'development';
    }

    const entry = getAbsolutePath(getValueFromPotentialObject(buildSettings.input, target));
    const outputPath = getAbsolutePath(getValueFromPotentialObject(buildSettings.output, target));
    const outputName = getValueFromPotentialObject(buildSettings.name, target);

    if (!fileExists(entry)) {
        log.small.warn(`Could not find the entry file for ${underline(target)} at ${underline(entry)}`);

        return {};
    }

    if (DIST) {
        newWebpackConfig.bail = true;
    }

    /**
    * Entry
    */
    newWebpackConfig.entry = {
        [outputName]: [
            entry,
        ],
    };

    /**
    * Devtool
    */
    newWebpackConfig.devtool = 'source-map';

    /**
    * Output
    */
    newWebpackConfig.output = {
        path: outputPath,
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: DIST ? addTrailingSlash(buildSettings.path) : getDevPath(),
    };

    /**
    * Loaders
    */

    // Base
    newWebpackConfig.module = {
        preLoaders: [],
        loaders: [],
    };

    // JS LOADER
    const jsLoader = {
        id: 'babel',
        test: /\.js$/,
        loader: require.resolve('babel-loader'),
        query: {
            ...babelConfig,
            cacheDirectory: true,
        },
        include: runThroughBabel,
    };

    newWebpackConfig.module.loaders.push(jsLoader);

    // JSON LOADER
    const jsonLoader = {
        test: /\.json$/,
        loader: require.resolve('json-loader'),
    };

    newWebpackConfig.module.loaders.push(jsonLoader);

    /**
    * Resolve
    */
    newWebpackConfig.resolve = {
        fallback: [],
        extensions: ['', '.js'],
    };

    newWebpackConfig.resolveLoader = {
        root: [
            join(__dirname, '..', '..', 'node_modules'),
        ],
    };

    /**
    * Plugins
    */
    newWebpackConfig.plugins = [];

    newWebpackConfig.plugins.push(
        new RocExportPlugin(getResolveRequest('Webpack', true)),

        // process.env.NODE_ENV is used by React and some other libs to determine what to run
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(ENV),
            __DEV__: DEV,
            __DIST__: DIST,
            __CWD__: JSON.stringify(process.cwd()),
        })
    );

    if (DIST) {
        newWebpackConfig.plugins.push(function statsWriter() {
            this.plugin('done', writeStats);
        });

        newWebpackConfig.plugins.push(
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin()
        );
    }

    // Roc meta data for convenience
    newWebpackConfig.rocMetaInfo = {
        entry,
        outputName,
        outputPath,
    };

    return newWebpackConfig;
};
