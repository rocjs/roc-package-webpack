import devip from 'dev-ip';
import { getSettings, initLog } from 'roc';

import config from '../config/roc.config.js';

let onceDevPort = true;
const devIp = devip();

const log = initLog();

/**
 * Returns the current dev host.
 *
 * @returns {string} The host that should be used.
 */
export function getDevHost() {
    const { host } = getSettings('dev');
    if (host) {
        return host;
    }
    return devIp.length ? devIp[0] : 'localhost';
}

/**
 * Returns the current dev port.
 *
 *It will first default to the environment variable `DEV_PORT` and after that `roc.config.js`.
 *
 * Will give a warning if `DEV_PORT` is defined and the value in the configuration is something other than default.
 *
 * @returns {number} The final port for the dev server.
 */
export function getDevPort() {
    const settings = getSettings('dev');

    if (settings.port !== config.settings.dev.port && process.env.DEV_PORT && onceDevPort) {
        onceDevPort = false;
        log.small.warn('You have configured a dev port but the environment variable DEV_PORT ' +
            `is set and that will be used instead. The port that will be used is ${process.env.DEV_PORT}`
        );
    }

    return process.env.DEV_PORT || settings.port;
}

/**
 * Returns the current dev path.
 *
 * Will use {@link getDevPort} for getting the port.
 *
 * @param {string} [relativeBuildPath] - Relative path to where the build is saved.
 * @returns {string} The complete dev path on the server including the port.
 */
export function getDevPath(relativeBuildPath = '') {
    const buildPath = relativeBuildPath && relativeBuildPath.slice(-1) !== '/' ?
        `${relativeBuildPath}/` :
        relativeBuildPath;

    return `http://${getDevHost()}:${getDevPort()}/${buildPath}`;
}

/**
* Removes possible trailing slashes from a path.
*
* @param {string} path - Path to remove possible trailing slashes.
*
* @returns {string} - Path without trailing slashes.
*/
export function removeTrailingSlash(path) {
    const newPath = path.replace(/\/+$/, '');

    if (!newPath) {
        return '/';
    }

    return newPath;
}

/**
* Adds a trailing slashes to a path.
*
* Runs {@link removeTrailingSlash} internally first.
*
* @param {string} path - Path to add a trailing slashes to.
*
* @returns {string} - Path with trailing slash.
*/
export function addTrailingSlash(path) {
    const newPath = removeTrailingSlash(path);

    if (newPath !== '/') {
        return `${newPath}/`;
    }

    return newPath;
}
