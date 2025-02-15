// @flow

import Bowser from 'bowser';

import Platform from '../react/Platform';

/**
 * Returns whether or not the current environment is a mobile device.
 *
 * @returns {boolean}
 */
export function isMobileBrowser() {
    return Platform.OS === 'android' || Platform.OS === 'ios';
}

/**
 * Returns user agent details.
 *
 * @returns {Object} Parsed Bowser object.
 */
export function getUserAgentDetails() {
    return Bowser.getParser(window.navigator.userAgent);
}

/**
 * Checks whether the chrome extensions defined in the config file are installed or not.
 *
 * @param {Object} config - Objects containing info about the configured extensions.
 *
 * @returns {Promise[]}
 */
export function checkChromeExtensionsInstalled(config: Object = {}) {
    const isExtensionInstalled = info => new Promise(resolve => {
        const img = new Image();

        img.src = `chrome-extension://${info.id}/${info.path}`;
        img.onload = function() {
            resolve(true);
        };
        img.onerror = function() {
            resolve(false);
        };
    });
    const extensionInstalledFunction = info => isExtensionInstalled(info);

    return Promise.all(
        (config.chromeExtensionsInfo || []).map(info => extensionInstalledFunction(info))
    );
}
