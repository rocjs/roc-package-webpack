// const regexp = /(node_modules)\/(roc-[^/]*)?\/?([^/]*)/g;
import { sep } from 'path';

import createPathRegExp from 'roc/lib/require/createPathRegExp';

const regexp = createPathRegExp(`(node_modules)${sep}(roc-[^${sep}]*)?${sep}?([^${sep}]*)`, 'g');

export default function runThroughBabel(absPath) {
    /* This function will look at the absolute path for the current file
     * to determine if it should be processed by babel-loader.
     *
     * What this does exactly is that it finds the last match of "roc-X/SOMETHING".
     * If SOMETHING is "app" it will include it and process it with babel.
     */
    let match;
    const matches = [];

    // eslint-disable-next-line
    while ((match = regexp.exec(absPath))) {
        matches.push({ nodeModules: match[1], roc: match[2], next: match[3] });
    }

    const last = matches[matches.length - 1];
    if (last && last.nodeModules === 'node_modules' && (!last.roc || last.next !== 'app')) {
        // We do not want to process this with babel-loader.
        // We explicitly set here that roc-X/app should be run through Babel
        // Would like to avoid this, see issue https://github.com/webpack/webpack/issues/1071
        return false;
    }

    return true;
}
