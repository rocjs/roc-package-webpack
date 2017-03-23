import { isString, isPlainObject } from 'lodash';

export default class RocExportPlugin {
    constructor(resolveRequest) {
        this.resolveRequest = resolveRequest;
    }

    apply(compiler) {
        const getAlias = createGetAlias(compiler.options.resolve.alias); // eslint-disable-line
        const resolveRequest = this.resolveRequest;
        const resolving = {};

        // We assume that loaders will be managed in Webpack-land, meaning that we will not manage
        // them using exports in Roc
        compiler.resolvers.normal.plugin('module', function (result, next) {
            if (resolving[cacheKey(result)]) {
                return next();
            }

            let request = result.request;

            // Use resolve.alias to use the alias if one exists and match
            const beforeAlias = request;
            request = getAlias(request);
            const afterAlias = request;

            // Try to resolve the dependency against the roc dependency context
            request = resolveRequest(request, result.path);

            resolving[cacheKey(result)] = true;
            return this.resolve(result.path, request, (err) => {
                resolving[cacheKey(result)] = false;

                if (err) {
                    // We got an error and will try again with fallback enabled
                    request = resolveRequest(request, result.path, true);
                }

                // If we have not changed the request we want to revert the alias change
                request = request === afterAlias ? beforeAlias : request;

                // Update the resolving with the new value if the request was modified
                if (request !== result.request) {
                    return this.doResolve(['file'], { ...result, request }, next);
                }

                // Do nothing and just pass through
                return next();
            });
        });
    }
}

function cacheKey(result) {
    return `${result.path}@@@@@${result.request}`;
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
