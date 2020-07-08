// @flow

import { ReducerRegistry } from '../base/redux';

import {
    TOAST_NOTIFICATION_ENABLED
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
        notificationVisiable: true
    };
}

ReducerRegistry.register(
    'features/toolbox-more',
    (state: Object = _getInitialState(), action: Object) => {
        switch (action.type) {
        case TOAST_NOTIFICATION_ENABLED:
            return {
                ...state,
                notificationVisiable: action.notificationVisiable
            };
        }

        return state;
    });
