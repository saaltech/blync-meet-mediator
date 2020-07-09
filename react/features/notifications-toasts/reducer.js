// @flow

import { ReducerRegistry } from '../base/redux';

import {
    CLEAR_NOTIFICATIONS,
    HIDE_NOTIFICATION,
    SET_NOTIFICATIONS_ENABLED,
    SHOW_TOAST_NOTIFICATION
} from './actionTypes';


/**
 * The initial state of the feature notifications.
 *
 * @type {array}
 */
const DEFAULT_STATE = {
    enabled: true,
    notifications: []
};

/**
 * Reduces redux actions which affect the display of notifications.
 *
 * @param {Object} state - The current redux state.
 * @param {Object} action - The redux action to reduce.
 * @returns {Object} The next redux state which is the result of reducing the
 * specified {@code action}.
 */
ReducerRegistry.register('features/notifications-toasts',
    (state = DEFAULT_STATE, action) => {
        switch (action.type) {
        case CLEAR_NOTIFICATIONS:
            return {
                ...state,
                notifications: []
            };
        case HIDE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(
                    notification => notification.uid !== action.uid)
            };

        case SET_NOTIFICATIONS_ENABLED:
            return {
                ...state,
                enabled: action.enabled
            };

        case SHOW_TOAST_NOTIFICATION: {
            const newNotification = [
                ...state.notifications,
                action.message
            ];

            return {
                ...state,
                notifications: newNotification
            }; }
        }

        return state;
    });
