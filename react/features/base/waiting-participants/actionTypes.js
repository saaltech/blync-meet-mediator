// @flow

/**
 * Create an action to set the new waiting list participants.
 *
 * {
 *     type: SET_WAITING_PARTICIPANTS,
 *     participants: []
 * }
 */
export const SET_WAITING_PARTICIPANTS = 'SET_WAITING_PARTICIPANTS';


/**
 * Create an action for when there is a new waiting participant.
 *
 * {
 *     type: ADD_WAITING_PARTICIPANT,
 *     participants: []
 * }
 */
export const ADD_WAITING_PARTICIPANT = 'ADD_WAITING_PARTICIPANT'

export const REMOVE_WAITING_PARTICIPANTS = 'REMOVE_WAITING_PARTICIPANTS'

/**
 * Create an action for when the waiting list participants are seen.
 *
 * {
 *     type: CLEAR_WAITING_PARTICIPANTS_NOTIFICATION
 * }
 */
export const CLEAR_WAITING_PARTICIPANTS_NOTIFICATION = 'CLEAR_WAITING_PARTICIPANTS_NOTIFICATION';


/**
 * Create an action to clear out old store entry
 *
 * {
 *     type: FLUSH_OUT_WAITING_LIST
 * }
 */
export const FLUSH_OUT_WAITING_LIST = 'FLUSH_OUT_WAITING_LIST'

