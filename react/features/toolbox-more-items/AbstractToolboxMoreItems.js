// @flow

import { Component } from 'react';
import type { Dispatch } from 'redux';

import { setOverflowMenuVisible } from '../toolbox';

/**
 * The type of the React {@code Component} props of {@code AbstractToolboxMoreItems}.
 */
export type Props = {

    /**
     * True if the chat window should be rendered.
     */
    _isOpen: boolean,

    /**
     * The Redux dispatch function.
     */
    dispatch: Dispatch<any>,

    /**
     * Function to be used to translate i18n labels.
     */
    t: Function,

    _onClose: Function,
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
        /**
         * Toggles the chat window.
         *
         * @returns {Function}
         */
        _onClose() {
            dispatch(setOverflowMenuVisible(false));
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
    const { overflowMenuVisible: isOpen } = state['features/toolbox'];

    return {
        _isOpen: isOpen
    };
}
