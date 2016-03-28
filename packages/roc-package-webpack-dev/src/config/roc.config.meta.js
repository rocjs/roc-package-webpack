import {
    isString,
    isBoolean,
    isPath,
    isArrayOrSingle
} from 'roc/validators';

const meta = {
    settings: {
        descriptions: {
            build: {
                path: 'The basepath for the application.',
                mode: 'What mode the application should be built for. Possible values are "dev" and "dist".',
                disableProgressbar: 'Should the progress bar be disabled for builds.',
                outputName: 'The name of the generated application bundle, will be appended "roc.js".'
            }
        },

        validations: {
            build: {
                path: isPath,
                mode: /^dev|dist$/i,
                disableProgressbar: isBoolean,
                input: isArrayOrSingle(isPath),
                output: isArrayOrSingle(isPath),
                outputName: isArrayOrSingle(isString)
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
