import merge from 'webpack-merge';
import { isFunction } from 'lodash';

export default ({ previousValue: webpackConfig, context: { config } }) => (target) => () => {
    const newWebpackConfig = isFunction(config.webpack) ?
        config.webpack(target) : config.webpack;

    return merge(webpackConfig, newWebpackConfig);
};
