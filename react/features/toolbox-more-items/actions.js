// @flow
import {
    TOAST_NOTIFICATION_ENABLED
} from './actionTypes';

declare var interfaceConfig: Object;


/**
 * Signals a request to display or hide notifications.
 *
 * @param {boolean} visible - True to enable, false to disble.
 * @returns {{
 *     type: SET_FULL_SCREEN,
 *     fullScreen: boolean
 * }}
 */
export function enableNotification(visible: boolean) {
    return {
        type: TOAST_NOTIFICATION_ENABLED,
        notificationVisiable: visible
    };
}
