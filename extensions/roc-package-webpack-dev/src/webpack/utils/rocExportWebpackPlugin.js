import { isString, isFunction, isRegExp, isPlainObject } from 'lodash';

export default class RocExportPlugin {
    constructor(resolveRequest) {
        this.resolveRequest = resolveRequest;
    }

    apply(compiler) {
        const getAlias = createGetAlias(compiler.options.resolve.alias); // eslint-disable-line
        const isExternal = createIsExternal(compiler.options.externals); // eslint-disable-line

        // We assume that loaders will be managed in Webpack-land, meaning that we will not manage
        // them using exports in Roc
        compiler.plugin('normal-module-factory', (normalModuleFactory) => {
            normalModuleFactory.plugin('before-resolve', (result, callback) => {
                // Do nothing if it is external or falsy
                if (!result || isExternal(result.request, result.context)) {
                    return callback(null, result);
                }

                let request = result.request;

                // Strip loaders
                let loaders = '';
                const finalBang = request.lastIndexOf('!');
                if (finalBang >= 0) {
                    loaders = request.substring(0, finalBang + 1);
                    request = request.substring(finalBang + 1);
                }

                // Strip resource query
                let query = '';
                const finalQuestionMark = request.lastIndexOf('?');
                if (finalQuestionMark >= 0) {
                    query = request.substring(finalQuestionMark);
                    request = request.substring(0, finalQuestionMark);
                }

                // Use resolve.alias to use the alias if one exists and match
                const beforeAlias = request;
                request = getAlias(request);
                const afterAlias = request;

                // Try to resolve the dependency against the roc dependency context
                request = this.resolveRequest(request, result.context);

                // Test to see if we can resolve the dependency
                return compiler.resolvers.normal.resolve(result.context, request, (err) => {
                    if (err) {
                        // We got an error and will try again with fallback enabled
                        request = this.resolveRequest(request, result.context, true);
                    }

                    // If we have not changed the request we want to revert the alias change
                    request = request === afterAlias ? beforeAlias : request;

                    // Put the request back together with the possible loaders and the possible query
                    result.request = `${loaders}${request}${query}`; // eslint-disable-line
                    return callback(null, result);
                });
            });
        });
    }
}

function createIsExternal(externals) {
    return (request, context) => {
        if (!externals) {
            return false;
        }

        if (isString(externals)) {
            return request === externals;
        }

        if (Array.isArray(externals)) {
            return externals.some((external) => createIsExternal(external)(request, context));
        }

        if (isRegExp(externals)) {
            return externals.test(request);
        }

        if (isFunction(externals)) {
            let functionExternalFound = false;
            externals(context, request, (error, result) => {
                if (error) {
                    functionExternalFound = false;
                } else {
                    functionExternalFound = createIsExternal(result)(request, context);
                }
            });
            return functionExternalFound;
        }

        // Otherwise it is a Object
        return Object.keys(externals).some((key) => request === key);
    };
}

// Based on code from enhanced-resolve
function createGetAlias(aliases) {
    if (isPlainObject(aliases) && !Array.isArray(aliases)) {
        aliases = Object.keys(aliases).map((key) => { // eslint-disable-line
            let onlyModule = false;
            let obj = aliases[key];
            if (/\$$/.test(key)) {
                onlyModule = true;
                key = key.substr(0, key.length - 1); // eslint-disable-line
            }
            if (isString(obj)) {
                obj = {
                    alias: obj,
                };
            }
            return {
                name: key,
                onlyModule,
                ...obj,
            };
        });
    }

    return (request) => {
        for (const alias of aliases) {
            if ((!alias.onlyModule && request.indexOf(`${alias.name}/`) === 0) || request === alias.name) {
                if (request.indexOf(`${alias.alias}/`) !== 0 && request !== alias.alias) {
                    return alias.alias + request.substr(alias.name.length);
                }
            }
        }
        return request;
    };
}
