import {
    SET_WAITING_PARTICIPANTS,
    ADD_WAITING_PARTICIPANTS,
    REMOVE_WAITING_PARTICIPANTS,
    CLEAR_WAITING_PARTICIPANTS_NOTIFICATION,
    FLUSH_OUT_WAITING_LIST
} from './actionTypes';

/**
 * Create an action for when waiting participants list changes.
 *
 * @param {string} participants - Waiting participants array.
 * @returns {{
 *     type: SET_WAITING_PARTICIPANTS,
 *     participants: [{
 *     }]
 * }}
 */
/*export function updateWaitingParticipantsList(participants = []) {
    return {
        type: SET_WAITING_PARTICIPANTS,
        participants
    };
}*/

/**
 * Create an action to add a participant to waiting participants list.
 *
 * @param {Object[]} participants - Waiting participants.
 * @returns {{
 *     type: ADD_WAITING_PARTICIPANTS,
 *     participants: []
 * }}
 */
export function addWaitingParticipants(participants = []) {
    return {
        type: ADD_WAITING_PARTICIPANTS,
        participants
    };
}

/**
 * Create an action to remove participants with certain jids.
 *
 * @param {string[]} jids - Waiting participant jids.
 * @returns {{
 *     type: REMOVE_WAITING_PARTICIPANTS,
 *     jids: []
 * }}
 */
export function removeWaitingParticipants(jids = []) {
    return {
        type: REMOVE_WAITING_PARTICIPANTS,
        jids
    }
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

