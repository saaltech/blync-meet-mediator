// @flow
import {
    TOAST_NOTIFICATION_ENABLED,
    SHOW_TOAST_NOTIFICATION_OPTIONS,
    UPDATE_TOAST_NOTIFICATION_OPTIONS
} from './actionTypes';

declare var interfaceConfig: Object;


/**
 * Signals a request to display or hide notifications.
 *
 * @param {boolean} visible - True to enable, false to disble.
 * @returns {{
 *     type: TOAST_NOTIFICATION_ENABLED,
 *     fullScreen: boolean
 * }}
 */
export function enableNotification(visible: boolean) {
    return {
        type: TOAST_NOTIFICATION_ENABLED,
        notificationVisible: visible
    };
}


/**
 * Signals a request to display or toast notifications options .
 *
 * @param {boolean} visible - True to enable, false to disble.
 * @returns {{
    *     type: SET_FULL_SCREEN,
    *     fullScreen: boolean
    * }}
    */
export function showToastNotificationOptions(visible: boolean) {
    return {
        type: SHOW_TOAST_NOTIFICATION_OPTIONS,
        toastNotificationVisible: visible
    };
}


/**
 * Signals a request to update toast notifications options .
 *
 * @param {Object} options -
 * @returns {{
    *     type: SET_FULL_SCREEN,
    *     fullScreen: boolean
    * }}
    */
export function updateToastNotificationOptions(options: Object) {
    return {
        type: UPDATE_TOAST_NOTIFICATION_OPTIONS,
        options
    };
}
