// @flow

import { ReducerRegistry, set } from '../redux';

import {
    WAITING_PARTICIPANTS,
    CLEAR_WAITING_PARTICIPANTS_NOTIFICATION,
    FLUSH_OUT_WAITING_LIST
} from './actionTypes';

const DEFAULT_STATE = { newList: false, participants: [] }

/**
 * Listen for actions which updates the set of waiting participants in
 * the conference.
 *
 * @param {Participant[]} state - List of waiting participants.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @returns {Participant[]}
 */
ReducerRegistry.register('features/base/waiting-participants', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case WAITING_PARTICIPANTS:
            return {
                isNewList: true,
                participants: action.participants
            }
        case CLEAR_WAITING_PARTICIPANTS_NOTIFICATION:
            return {
                ...state,
                isNewList: false
            }
        case FLUSH_OUT_WAITING_LIST:
            return DEFAULT_STATE
    }

    return state;
});
