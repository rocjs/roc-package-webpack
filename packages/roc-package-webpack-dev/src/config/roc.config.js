const config = {
    settings: {
        build: {
            input: 'src/index.js',
            output: 'build',
            path: '/',
            mode: 'dist',
            disableProgressbar: false,
            name: 'app'
        }
    }
};

/**
 * Exports the default `roc.config.js`.
 *
 * @return {object} The default `roc.config.js`.
 */
export default config;
