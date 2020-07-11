// @flow

import { Component } from 'react';
import type { Dispatch } from 'redux';

import {
    updateToastNotificationOptions,
    showToastNotificationOptions
} from './actions';

/**
 * The type of the React {@code Component} props of {@code AbstractToastNotificationSetting}.
 */
export type Props = {

    _toastNotificationVisible: boolean,

    /**
     * The Redux dispatch function.
     */
    dispatch: Dispatch<any>,

    /**
     * Function to be used to translate i18n labels.
     */
    t: Function,

    _hideToastNotificationOptions: Function,
    _updateToastNotificationOptions: Function,
    _toastNotificationSettings: Object,
};

/**
 * Implements an abstract chat panel.
 */
export default class AbstractToastNotificationSetting<P: Props, S> extends Component<P, S> {}

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
        _updateToastNotificationOptions(options: Object) {
            dispatch(updateToastNotificationOptions(options));
        },
        _hideToastNotificationOptions() {
            dispatch(showToastNotificationOptions(false));
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
    const { toastNotificationVisible, toastNotificationSettings } = state['features/toolbox-more'];


    return {
        _toastNotificationSettings: toastNotificationSettings,
        _toastNotificationVisible: toastNotificationVisible
    };
}
