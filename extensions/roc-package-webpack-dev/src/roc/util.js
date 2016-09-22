import { runHook } from 'roc';

const packageJSON = require('../../package.json');

export const name = packageJSON.name;

export const version = packageJSON.version;

export function invokeHook(...args) {
    return runHook(name)(...args);
}
