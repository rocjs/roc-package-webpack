import {
    isArray,
    isBoolean,
    isInteger,
    isPath,
    isString,
    notEmpty,
    oneOf,
    required,
} from 'roc/validators';

export default {
    settings: {
        build: {
            path: {
                description: 'The basepath for the application.',
                validator: required(notEmpty(isPath)),
            },
            mode: {
                description: 'What mode the application should be built for. Possible values are "dev" and "dist".',
                validator: required(notEmpty(/^dev|dist$/i)),
            },
            disableProgressbar: {
                description: 'Should the progress bar be disabled for builds.',
                validator: required(notEmpty(isBoolean)),
            },
            name: {
                description: 'The name of the generated application bundle.',
                validator: required(notEmpty(oneOf(isArray(isString), isString))),
            },
            input: {
                override: 'roc-abstract-package-base-dev',
                validator: required(notEmpty(oneOf(isArray(isPath), isPath))),
            },
            output: {
                override: 'roc-abstract-package-base-dev',
                validator: required(notEmpty(oneOf(isArray(isPath), isPath))),
            },
        },
        dev: {
            port: {
                description: 'Port for the dev server.',
                validator: required(notEmpty(isInteger)),
            },
            host: {
                description: 'The host to use during development, will be automatically defined if left empty.',
                validator: isString,
            },
        },
    },

    webpack: {
        description: 'Can be either a function or a plain object. If it is a function the argument will be `target`.',
    },
};
