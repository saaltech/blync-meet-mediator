// @flow

import {
    ADD_MESSAGE,
    CLEAR_MESSAGES,
    CLOSE_CHAT,
    SEND_MESSAGE,
    SET_PRIVATE_MESSAGE_RECIPIENT,
    MARK_AS_READ,
    MARK_PUBLIC_AS_READ,
    HIDE_CHAT
} from './actionTypes';

/**
 * Adds a chat message to the collection of messages.
 *
 * @param {Object} messageDetails - The chat message to save.
 * @param {string} messageDetails.displayName - The displayName of the
 * participant that authored the message.
 * @param {boolean} messageDetails.hasRead - Whether or not to immediately mark
 * the message as read.
 * @param {string} messageDetails.message - The received message to display.
 * @param {string} messageDetails.messageType - The kind of message, such as
 * "error" or "local" or "remote".
 * @param {string} messageDetails.timestamp - A timestamp to display for when
 * the message was received.
 * @returns {{
 *     type: ADD_MESSAGE,
 *     displayName: string,
 *     hasRead: boolean,
 *     message: string,
 *     messageType: string,
 *     timestamp: string,
 * }}
 */
export function addMessage(messageDetails: Object) {
    return {
        type: ADD_MESSAGE,
        ...messageDetails
    };
}

/**
 * Clears the chat messages in Redux.
 *
 * @returns {{
 *     type: CLEAR_MESSAGES
 * }}
 */
export function clearMessages() {
    return {
        type: CLEAR_MESSAGES
    };
}

/**
 * Action to signal the closing of the chat dialog.
 *
 * @returns {{
 *     type: CLOSE_CHAT
 * }}
 */
export function closeChat() {
    return {
        type: CLOSE_CHAT
    };
}

/**
 * Sends a chat message to everyone in the conference.
 *
 * @param {string} message - The chat message to send out.
 * @param {boolean} ignorePrivacy - True if the privacy notification should be ignored.
 * @returns {{
 *     type: SEND_MESSAGE,
 *     ignorePrivacy: boolean,
 *     message: string
 * }}
 */
export function sendMessage(message: string, ignorePrivacy: boolean = false) {
    return {
        type: SEND_MESSAGE,
        ignorePrivacy,
        message
    };
}

/**
 * Initiates the sending of a private message to the supplied participant.
 *
 * @param {Participant} participant - The participant to set the recipient to.
 * @returns {{
 *     participant: Participant,
 *     type: SET_PRIVATE_MESSAGE_RECIPIENT
 * }}
 */
export function setPrivateMessageRecipient(participant: Object) {
    return {
        participant,
        type: SET_PRIVATE_MESSAGE_RECIPIENT
    };
}

/**
 * Toggles display of the chat side panel.
 *
 * @returns {{
 *     type: HIDE_CHAT
 * }}
 */
export function hideChat() {
    return {
        type: HIDE_CHAT
    };
}



/**
 * Marks message as read.
 *
 * @param {Object} localParticipant - The participant.
 * @param {Object} remoteParticipant - The localeParticipant.
 *
 * @returns {{
 *     localParticipant: Object,
 *     remoteParticipant: Object,
 *     type: MARK_AS_READ
 * }}
 */
export function markAsRead(
        localParticipant: Object, remoteParticipant: Object): Object {
    return {
        localParticipant,
        remoteParticipant,
        type: MARK_AS_READ
    };
}

/**
 * Marks public messages as read.
 *
 * @returns {{
 *     type: MARK_PUBLIC_AS_READ
 * }}
 */
export function markPublicAsRead(): Object {
    return {
        type: MARK_PUBLIC_AS_READ
    };
}
   