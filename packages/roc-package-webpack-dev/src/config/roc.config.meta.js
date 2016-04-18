import {
    isString,
    isBoolean,
    isPath,
    isArrayOrSingle,
    isInteger
} from 'roc/validators';

const meta = {
    settings: {
        descriptions: {
            build: {
                path: 'The basepath for the application.',
                mode: 'What mode the application should be built for. Possible values are "dev" and "dist".',
                disableProgressbar: 'Should the progress bar be disabled for builds.',
                name: 'The name of the generated application bundle.'
            },
            dev: {
                port: 'Port for the dev server.',
                host: 'The host to use during development, will be automatically defined if left empty.'
            }
        },

        validations: {
            build: {
                path: isPath,
                mode: /^dev|dist$/i,
                disableProgressbar: isBoolean,
                input: isArrayOrSingle(isPath),
                output: isArrayOrSingle(isPath),
                name: isArrayOrSingle(isString)
            },
            dev: {
                port: isInteger,
                host: isString
            }
        }
    },

    commands: {
        build: {
            settings: ['build'],
            description: 'Build the current project.'
        },
        dev: {
            settings: true,
            description: 'Starts the current project in development mode.'
        }
    }
};

/**
 * Exports the `roc.config.meta.js`.
 *
 * @return {object} The `roc.config.meta.js`.
 */
export default meta;
