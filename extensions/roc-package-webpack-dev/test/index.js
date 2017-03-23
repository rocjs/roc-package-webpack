const assert = require('assert');

const runThroughBabel = require('../lib/helpers/runThroughBabel').default;

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
    '/public/roc-app/node_modules/@spp/roc-package-demo/app/code.js',
];


shouldBeFalse.forEach((path) => {
    assert(runThroughBabel(path) === false, path);
});

shouldBeTrue.forEach((path) => {
    assert(runThroughBabel(path) === true, path);
});
