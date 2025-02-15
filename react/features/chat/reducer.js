// @flow
import uuidv4 from 'uuid/v4';

import { SET_ACTIVE_MODAL_ID } from '../base/modal';
import { ReducerRegistry } from '../base/redux';

import {
    ADD_MESSAGE,
    CLEAR_MESSAGES,
    SET_PRIVATE_MESSAGE_RECIPIENT,
    TOGGLE_CHAT,
    MARK_AS_READ,
    MARK_PUBLIC_AS_READ,
    HIDE_CHAT
} from './actionTypes';
import { CHAT_VIEW_MODAL_ID } from './constants';

const DEFAULT_STATE = {
    isOpen: false,
    lastReadMessage: undefined,
    messages: [],
    privateMessageRecipient: undefined
};

ReducerRegistry.register('features/chat', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case ADD_MESSAGE: {
        const newMessage = {
            displayName: action.displayName,
            error: action.error,
            id: action.id,
            senderId: action.senderId,
            messageType: action.messageType,
            message: action.message,
            privateMessage: action.privateMessage,
            recipient: action.recipient,
            recipientId: action.recipientId,
            timestamp: action.timestamp,
            hasRead: action.hasRead,
            chatId: uuidv4()
        };

        // React native, unlike web, needs a reverse sorted message list.
        const messages = navigator.product === 'ReactNative'
            ? [
                newMessage,
                ...state.messages
            ]
            : [
                ...state.messages,
                newMessage
            ];

        if (navigator.product === 'ReactNative') {
            return {}
        }
        else {
            return {
                ...state,
                lastReadMessage:
                    action.hasRead ? newMessage : state.lastReadMessage,
                messages
            };
        }
    }

    case MARK_AS_READ: {
        const { remoteParticipant, localParticipant } = action;

        const messages = state.messages.map(msg => {
            const localSent = msg.displayName === localParticipant.name && msg.recipient === remoteParticipant.name;
            const localReceived = msg.recipient === localParticipant.name && msg.displayName === remoteParticipant.name;

            if ((localSent || localReceived) && msg.privateMessage) {
                return {
                    ...msg,
                    hasRead: true
                };
            }

            return msg;
        });

        return {
            ...state,
            messages
        };
    }

    case MARK_PUBLIC_AS_READ: {
        const messages = state.messages.map(msg => {

            if (msg.privateMessage) {
                return msg;
            }

            return {
                ...msg,
                hasRead: true
            };
        });

        return {
            ...state,
            messages
        };
    }

    case CLEAR_MESSAGES:
        return {
            ...state,
            lastReadMessage: undefined,
            messages: []
        };

    case SET_ACTIVE_MODAL_ID:
        if (action.activeModalId === CHAT_VIEW_MODAL_ID) {
            return updateChatState(state);
        }

        break;
    case SET_PRIVATE_MESSAGE_RECIPIENT:
        return {
            ...state,
            isOpen: Boolean(action.participant) || state.isOpen,
            privateMessageRecipient: action.participant
        };

    case TOGGLE_CHAT:
        return updateChatState(state);

    case HIDE_CHAT:
        return {
            ...state,
            isOpen: false
        };
    }


    return state;
});

/**
 * Updates the chat status on opening the chat view.
 *
 * @param {Object} state - The Redux state of the feature.
 * @returns {Object}
 */
function updateChatState(state) {
    return {
        ...state,
        isOpen: !state.isOpen,
        lastReadMessage: state.messages[
            navigator.product === 'ReactNative' ? 0 : state.messages.length - 1],
        privateMessageRecipient: state.isOpen ? undefined : state.privateMessageRecipient
    };
}
