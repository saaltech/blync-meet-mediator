// @flow

// import throttle from 'lodash/throttle';
// import type { Dispatch } from 'redux';

import {
    CLEAR_NOTIFICATIONS,
    HIDE_NOTIFICATION,
    SET_NOTIFICATIONS_ENABLED,
    SHOW_TOAST_NOTIFICATION
} from './actionTypes';

/**
 * Clears (removes) all the notifications.
 *
 * @returns {{
 *     type: CLEAR_NOTIFICATIONS
 * }}
 */
export function clearNotifications() {
    return {
        type: CLEAR_NOTIFICATIONS
    };
}

/**
 * Removes the notification with the passed in id.
 *
 * @param {string} uid - The unique identifier for the notification to be
 * removed.
 * @returns {{
 *     type: HIDE_NOTIFICATION,
 *     uid: number
 * }}
 */
export function hideNotification(uid: number) {
    return {
        type: HIDE_NOTIFICATION,
        uid
    };
}

/**
 * Stops notifications from being displayed.
 *
 * @param {boolean} enabled - Whether or not notifications should display.
 * @returns {{
 *     type: SET_NOTIFICATIONS_ENABLED,
 *     enabled: boolean
 * }}
 */
export function setNotificationsEnabled(enabled: boolean) {
    return {
        type: SET_NOTIFICATIONS_ENABLED,
        enabled
    };
}

/**
 * Queues a notification for display.
 *
 * @param {Object} message - Message.
 *
 * @returns {{
 *     type: SHOW_TOAST_NOTIFICATION,
 *     message: {
 *              text,
 *              userId,
 *              type,
 *              id,
 *      },
 * }}
 */
export function showNotification(message: Object = {
    type: 'default'
}) {
    return {
        type: SHOW_TOAST_NOTIFICATION,
        message: {
            ...message,
            type: message.type || 'default',
            id: window.Date.now()
        }
    };
}
