// @flow

import { Component } from 'react';
import type { Dispatch } from 'redux';

import { getLocalParticipant } from '../../base/participants';
import { sendMessage, toggleChat, setPrivateMessageRecipient } from '../actions';
import { getUnreadSinceLastRead } from '../functions';

/**
 * The type of the React {@code Component} props of {@code AbstractChat}.
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
     * All the participants in the conference.
     */
    _participants: Array<Object>,

    /**
     * Function to send a text message.
     *
     * @protected
     */
    _onSendMessage: Function,

    /**
     * Function to toggle the chat window.
     */
    _onToggleChat: Function,

    /**
     * Whether or not to block chat access with a nickname input form.
     */
    _showNamePrompt: boolean,

    /**
     * The Redux dispatch function.
     */
    dispatch: Dispatch<any>,

    /**
     * Function to be used to translate i18n labels.
     */
    t: Function,

    /**
     * Function to be used to set private message recipient.
     */
    _setPrivateMessageRecipient: Function,

    /**
     * Private message recipient.
     */
    _privateMessageRecipient: Object,

    /**
     * The local participant.
     */
    _localParticipant: Object,

    /**
     * Messages since last read .
     */
    _messagesSinceLastRead: Array<Object>,
};

/**
 * Implements an abstract chat panel.
 */
export default class AbstractChat<P: Props, S> extends Component<P, S> {}

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
    console.log(state, 'statestatestatestatestate');
    const { isOpen, messages, privateMessageRecipient } = state['features/chat'];
    const participants = state['features/base/participants'];
    const _localParticipant = getLocalParticipant(state);

    const _messagesSinceLastRead = getUnreadSinceLastRead(state);

    console.log(state['features/chat'], 'messagesmessagesmessagesmessages');

    return {
        _isOpen: isOpen,
        _messages: messages,
        _participants: participants,
        _showNamePrompt: !_localParticipant.name,
        _localParticipant,
        _messagesSinceLastRead,
        _privateMessageRecipient: privateMessageRecipient
    };
}
