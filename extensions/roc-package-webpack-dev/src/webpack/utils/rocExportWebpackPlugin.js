export default class RocExportPlugin {
    constructor(resolveRequest) {
        this.resolveRequest = resolveRequest;
    }

    apply(compiler) {
        // We assume that loaders will be managed in Webpack-land, that is we will not manage them in exports
        compiler.plugin('normal-module-factory', (normalModuleFactory) => {
            normalModuleFactory.plugin('before-resolve', (result, callback) => {
                // We do not want to process Webpack special paths
                if (result.request.match(/(\?|!)/)) {
                    return callback(null, result);
                }

                // Try to resolve the dependency against the roc dependency context
                result.request = this.resolveRequest(result.request, result.context); // eslint-disable-line

                // Test to see if we can resolve the dependency
                return compiler.resolvers.normal.resolve(result.context, result.request, (err) => {
                    if (err) {
                        // We got an error and will try again with fallback enabled
                        result.request = this.resolveRequest(result.request, result.context, true); // eslint-disable-line
                        return callback(null, result);
                    }

                    return callback(null, result);
                });
            });
        });
    }
}
