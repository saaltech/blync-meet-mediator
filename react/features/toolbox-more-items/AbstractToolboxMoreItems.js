// @flow

import { Component } from 'react';
import type { Dispatch } from 'redux';

import { setOverflowMenuVisible } from '../toolbox';

import {
    enableNotification,
    showToastNotificationOptions
} from './actions';

/**
 * The type of the React {@code Component} props of {@code AbstractToolboxMoreItems}.
 */
export type Props = {

    /**
     * True if the chat window should be rendered.
     */
    _overflowMenuVisible: boolean,

    /**
     * The Redux dispatch function.
     */
    dispatch: Dispatch<any>,

    /**
     * Function to be used to translate i18n labels.
     */
    t: Function,

    _onClosePanel: Function,

    _hideNotification: Function,

    _showNotification: Function,

    _notificationVisible: boolean,

    _showToastNotificationOptions: Function,

    _hideToastNotificationOptions: Function,
};

/**
 * Implements an abstract chat panel.
 */
export default class AbstractToolboxMoreItems<P: Props, S> extends Component<P, S> {}

/**
 * Maps redux actions to the props of the component.
 *
 * @param {Function} dispatch - The redux action {@code dispatch} function.
 * @returns {{
 *     _onSendMessage: Function,
 *     _onToggleChat: Function
 * }}
 * @private
 */
export function _mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        dispatch,

        /**
         * Toggles notifications.
         *
         * @returns {Function}
         */
        _onClosePanel() {
            dispatch(setOverflowMenuVisible(false));
        },

        /**
         * Closes notifications.
         *
         * @returns {Function}
         */
        _hideNotification() {
            dispatch(enableNotification(false));
        },

        /**
         * Closes notifications.
         *
         * @returns {Function}
         */
        _showNotification() {
            dispatch(enableNotification(true));
        },

        _showToastNotificationOptions() {
            dispatch(showToastNotificationOptions(true));

            // dispatch(setOverflowMenuVisible(false));
        },

        _hideToastNotificationOptions() {
            dispatch(showToastNotificationOptions(false));
            dispatch(setOverflowMenuVisible(true));
        }
    };
}

/**
 * Maps (parts of) the redux state to {@link ToolBoxMoreItems} React {@code Component}
 * props.
 *
 * @param {Object} state - The redux store/state.
 * @private
 * @returns {{
 *     _isOpen: boolean,
 *     _messages: Array<Object>,
 *     _showNamePrompt: boolean
 * }}
 */
export function _mapStateToProps(state: Object) {
    const { notificationVisible } = state['features/toolbox-more'];

    const { overflowMenuVisible } = state['features/toolbox'];


    return {
        _overflowMenuVisible: overflowMenuVisible,
        _notificationVisible: notificationVisible
    };
}
