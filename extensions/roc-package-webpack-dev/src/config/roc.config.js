export default {
    settings: {
        build: {
            input: 'src/index.js',
            output: 'build',
            path: '/',
            mode: 'dist',
            disableProgressbar: false,
            name: 'app',
        },
        dev: {
            port: 3001,
            host: undefined,
        },
    },
    webpack: undefined,
};
