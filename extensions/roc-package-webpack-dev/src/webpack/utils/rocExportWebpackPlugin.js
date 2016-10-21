import { isString, isFunction, isRegExp, isPlainObject } from 'lodash';

export default class RocExportPlugin {
    constructor(resolveRequest) {
        this.resolveRequest = resolveRequest;
    }

    apply(compiler) {
        const getAlias = createGetAlias(compiler.options.resolve.alias); // eslint-disable-line

        // We assume that loaders will be managed in Webpack-land, that is we will not manage them in exports
        compiler.plugin('normal-module-factory', (normalModuleFactory) => {
            normalModuleFactory.plugin('before-resolve', (result, callback) => {
                // We do not want to process:
                // 1. No result
                // 2. Webpack special paths
                // 3. Externals
                if (
                    !result ||
                    result.request.match(/(\?|!)/) ||
                    findExternal(result.request, compiler.options.externals, result.context)  // eslint-disable-line
                ) {
                    return callback(null, result);
                }

                // Use resolve.alias to use the alias if one exists and match
                result.request = getAlias(result.request); // eslint-disable-line

                // Try to resolve the dependency against the roc dependency context
                result.request = this.resolveRequest(result.request, result.context); // eslint-disable-line

                // Test to see if we can resolve the dependency
                return compiler.resolvers.normal.resolve(result.context, result.request, (err) => {
                    if (err) {
                        // We got an error and will try again with fallback enabled
                        result.request = this.resolveRequest(result.request, result.context, true); // eslint-disable-line
                    }

                    return callback(null, result);
                });
            });
        });
    }
}

function findExternal(request, externals, context) {
    if (!externals) {
        return false;
    }

    if (isString(externals)) {
        return request === externals;
    }

    if (Array.isArray(externals)) {
        return externals.some((external) => findExternal(request, external, context));
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
                functionExternalFound = findExternal(request, result, context);
            }
        });
        return functionExternalFound;
    }

    // Otherwise it is a Object
    return Object.keys(externals).some((key) => request === key);
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
