import { writeFileSync } from 'fs';
import { extname, join } from 'path';
import { getSettings } from 'roc';

/**
 * A Webpack plugin that writes stats after a completed build.
 *
 * Will create two files:
 *  * `webpack-stats.json` - Containes what files that was created for CSS and JS.
 *  * `webpack-analysis.json` - Containes all stats from the Webpack build. Analyse with webpack.github.io/analyse
 * @param {!object} stats - Webpack stats object.
 * @private
 */
export function writeStats(stats) {
    const publicPath = this.options.output.publicPath;
    const statsFilepath = join(this.options.output.path, 'webpack-stats.json');
    const analysisFilepath = join(this.options.output.path, 'webpack-analysis.json');

    const json = stats.toJson();
    const name = getSettings('build').name;

    const content = parseStats(json, publicPath, name);

    writeFileSync(statsFilepath, JSON.stringify(content));
    writeFileSync(analysisFilepath, JSON.stringify(json));
}

/**
 * A parser for stats that find all JS and CSS files
 *
 * @param {!object} stats - Webpack stats object as JSON.
 * @param {string} publicPath - A path that the files should be prefixed with
 * @returns {object} A object with keys for 'script' and 'css'
 * @private
 */
export function parseStats(stats, publicPath = '', name = 'app') {
    // get chunks by name and extensions
    const getChunks = (n, ext = 'js') => {
        let chunk = stats.assetsByChunkName[n];

        // a chunk could be a string or an array, so make sure it is an array
        if (!(Array.isArray(chunk))) {
            chunk = [chunk];
        }

        return chunk
            .filter((chunkName) => extname(chunkName) === `.${ext}`)
            .map((chunkName) => publicPath + chunkName);
    };

    const script = getChunks(name, 'js');
    const css = getChunks(name, 'css');

    return {
        script,
        css
    };
}
