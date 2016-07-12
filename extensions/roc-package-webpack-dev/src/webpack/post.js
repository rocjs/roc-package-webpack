import merge from 'webpack-merge';
import { isFunction as isFunctionLodash } from 'lodash';

export default ({ previousValue: webpackConfig, config }) => (target) => () => {
    const newWebpackConfig = isFunctionLodash(config.webpack) ?
        config.webpack(target) : config.webpack;

    return merge(webpackConfig, newWebpackConfig);
};
