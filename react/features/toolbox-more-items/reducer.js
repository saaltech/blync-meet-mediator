// @flow

import { ReducerRegistry } from '../base/redux';

import {
    TOAST_NOTIFICATION_ENABLED,
    SHOW_TOAST_NOTIFICATION_OPTIONS,
    UPDATE_TOAST_NOTIFICATION_OPTIONS
} from './actionTypes';

declare var interfaceConfig: Object;

/**
 * Returns initial state for toolbox's part of Redux store.
 *
 * @private
 * @returns {{
 *     alwaysVisible: boolean,
 *     enabled: boolean,
 *     hovered: boolean,
 *     overflowMenuVisible: boolean,
 *     timeoutID: number,
 *     timeoutMS: number,
 *     visible: boolean
 * }}
 */
function _getInitialState() {
    return {
        notificationVisible: true,
        toastNotificationVisible: false,
        toastNotificationSettings: {
            showRaisedHand: true,
            showJoinedMeeting: true,
            showLeftMeeting: true,
            showChat: true
        }
    };
}

ReducerRegistry.register(
    'features/toolbox-more',
    (state: Object = _getInitialState(), action: Object) => {
        switch (action.type) {
        case TOAST_NOTIFICATION_ENABLED:
            return {
                ...state,
                notificationVisible: action.notificationVisible
            };

        case SHOW_TOAST_NOTIFICATION_OPTIONS:
            return {
                ...state,
                toastNotificationVisible: action.toastNotificationVisible
            };

        case UPDATE_TOAST_NOTIFICATION_OPTIONS:
            return {
                ...state,
                toastNotificationSettings: {
                    ...state.toastNotificationSettings,
                    ...action.options
                }
            };
        }


        return state;
    });
