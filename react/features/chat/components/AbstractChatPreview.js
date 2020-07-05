// @flow

import { Component } from 'react';
import type { Dispatch } from 'redux';

import { getLocalParticipant } from '../../base/participants';
import { sendMessage, toggleChat, setPrivateMessageRecipient, markAsRead, markPublicAsRead } from '../actions';

/**
 * The type of the React {@code Component} props of {@code AbstractChatPreview}.
 */
export type Props = {

    /**
     * True if the chat window should be rendered.
     */
    _isOpen: boolean,

    /**
     * All the chat messages in the conference.
     */
    _messages: Array<Object>,

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
export function _mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        /**
         * Toggles the chat window.
         *
         * @returns {Function}
         */
        _onToggleChat() {
            dispatch(toggleChat());
        },

        /**
         * Sends a text message.
         *
         * @private
         * @param {string} text - The text message to be sent.
         * @returns {void}
         * @type {Function}
         */
        _onSendMessage(text: string) {
            dispatch(sendMessage(text));
        },

        _setPrivateMessageRecipient(participant: Object) {
            dispatch(setPrivateMessageRecipient(participant));
        },

        _markAsRead(localParticipant: Object, participant: Object) {
            dispatch(markAsRead(localParticipant, participant));
        },

        _markPublicAsRead() {
            dispatch(markPublicAsRead());
        }
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
        isOpen,
        messages
    } = state['features/chat'];

    const _localParticipant = getLocalParticipant(state);


    return {
        _isOpen: isOpen,
        _messages: messages,
        _localParticipant
    };
}
