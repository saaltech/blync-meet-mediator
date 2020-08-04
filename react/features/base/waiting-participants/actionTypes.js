// @flow

/**
 * Create an action for when there is a new waiting list participants.
 *
 * {
 *     type: WAITING_PARTICIPANTS,
 *     participants: []
 * }
 */
export const WAITING_PARTICIPANTS = 'WAITING_PARTICIPANTS';

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