const join = require('path').join;

// Makes it possible for use to generate documentation for this package.
module.exports = {
    packages: [join(__dirname, 'lib', 'index.js')]
};
