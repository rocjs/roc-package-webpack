/*
 Currently not in use, will be re-enabled at a later time.
*/

import expect from 'expect';

import runThroughBabel from '../src/helpers/run-through-babel';

const shouldBeFalse = [
    '/public/roc-package/roc-package-webpack/dev/node_modules/webpack-hot-middleware/client-overlay.js',
    '/public/roc-app/node_modules/roc-package-webpack/node_modules/webpack-hot-middleware/client-overlay.js',
];

const shouldBeTrue = [
    '/public/roc-app/node_modules/roc-package-webpack/app/client-overlay.js',
    '/public/roc-app/client-overlay.js',
    '/public/roc-app/app/client-overlay.js',
    '/public/myApp/app/client-overlay.js',
    '/public/myApp/client-overlay.js',
];

describe('roc-package-webpack-dev', () => {
    describe('runThroughBabel', () => {
        describe('should correctly handle path and return false', () => {
            shouldBeFalse.forEach((path) => {
                it(path, () => {
                    expect(runThroughBabel(path)).toBe(false);
                });
            });
        });

        describe('should correctly handle path and return true', () => {
            shouldBeTrue.forEach((path) => {
                it(path, () => {
                    expect(runThroughBabel(path)).toBe(true);
                });
            });
        });
    });
});
