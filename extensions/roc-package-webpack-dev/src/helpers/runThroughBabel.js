import { sep } from 'path';

import createPathRegExp from 'roc/lib/require/createPathRegExp';

const regexp = createPathRegExp(`roc-[^${sep}]+${sep}(?:app$|app${sep})`);

export default function runThroughBabel(absPath) {
    /* This function will look at the absolute path for the current file
     * to determine if it should be processed by babel-loader.
     *
     * What this does exactly is that it finds the last match of "roc-X/SOMETHING".
     * If SOMETHING is "app" it will include it and process it with babel.
     */
    if (regexp.test(absPath)) {
        return true;
    } else if (/node_modules/.test(absPath)) {
        return false;
    }

    return true;
}
