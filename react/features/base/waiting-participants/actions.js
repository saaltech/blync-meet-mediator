import {
    WAITING_PARTICIPANTS,
    CLEAR_WAITING_PARTICIPANTS_NOTIFICATION,
    FLUSH_OUT_WAITING_LIST
} from './actionTypes';

/**
 * Create an action for when waiting participants list changes.
 *
 * @param {string} participants - Waiting participants array.
 * @returns {{
 *     type: WAITING_PARTICIPANTS,
 *     participants: [{
 *     }]
 * }}
 */
export function updateWaitingParticipantsList(participants = []) {
    return {
        type: WAITING_PARTICIPANTS,
        participants
    };
}

export function clearWaitingNotification() {
    return {
        type: CLEAR_WAITING_PARTICIPANTS_NOTIFICATION
    }
}

export function flushOutWaitingList() {
    return {
        type: FLUSH_OUT_WAITING_LIST
    }
}

