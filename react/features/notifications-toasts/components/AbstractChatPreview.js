// @flow

import { Component } from 'react';

// import type { Dispatch } from 'redux';

import { getLocalParticipant } from '../../base/participants';
import { } from '../actions';

/**
 * The type of the React {@code Component} props of {@code AbstractChatPreview}.
 */
export type Props = {

    /**
     * True if the chat window should be rendered.
     */
    _isOpen: boolean,

    /**
     * All the chat notifications in the conference.
     */
    _notifications: Array<Object>,

    /**
     * The local participant.
     */
    _localParticipant: Object,
};

/**
 * Implements an abstract chat panel.
 */
export default class AbstractChatPreview<P: Props, S> extends Component<P, S> {}

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
export function _mapDispatchToProps(
        // dispatch: Dispatch<any>
) {
    return {
    };
}

/**
 * Maps (parts of) the redux state to {@link Chat} React {@code Component}
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
    const {
        notifications
    } = state['features/notifications-toasts'];

    const {
        notificationVisible
    } = state['features/toolbox-more'];

    const _localParticipant = getLocalParticipant(state);


    return {
        _isOpen: notificationVisible,
        _notifications: notifications,
        _localParticipant
    };
}
