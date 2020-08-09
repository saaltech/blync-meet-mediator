// @flow

import { ReducerRegistry, set } from '../redux';

import {
    SET_WAITING_PARTICIPANTS,
    ADD_WAITING_PARTICIPANT,
    REMOVE_WAITING_PARTICIPANTS,
    CLEAR_WAITING_PARTICIPANTS_NOTIFICATION,
    FLUSH_OUT_WAITING_LIST
} from './actionTypes';

const DEFAULT_STATE = { isNewList: false, participants: [] }

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
        case SET_WAITING_PARTICIPANTS:
            return {
                isNewList: true,
                participants: action.participants
            }

        case ADD_WAITING_PARTICIPANT:
            let returnState = {
                ...state,
                participants: [...state.participants]
            }

            let added = false

            action.participants.forEach((participant) => {
                if(state.participants.filter((p) => participant.jid === p.jid) == 0) {
                    added = true
                    returnState['participants'].push(participant)
                }
            }) 

            if(added) {
                returnState['isNewList'] = true
            }

            return returnState;

        case REMOVE_WAITING_PARTICIPANTS:

            let participants = state.participants.filter((p) => 
                !action.jids.includes(p.jid))

            return {
                ...state,
                participants
            };

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
