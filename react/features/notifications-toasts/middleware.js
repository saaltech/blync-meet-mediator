/* @flow */

// import { getCurrentConference } from '../base/conference';

import {
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,

    //     PARTICIPANT_ROLE,
    //     PARTICIPANT_UPDATED,
    //     getParticipantById,
    //     getParticipantDisplayName
    getLocalParticipant,
    getParticipantById
} from '../base/participants';
import {
    MiddlewareRegistry

    // StateListenerRegistry
} from '../base/redux';
import {
    ADD_MESSAGE
} from '../chat/actionTypes';


// import {
//     SHOW_NOTIFICATION
// } from './actionTypes';

import {

    // clearNotifications,
    showNotification

    // showParticipantJoinedNotification
} from './actions';

// import { NOTIFICATION_TIMEOUT } from './constants';
// import { joinLeaveNotificationsDisabled } from './functions';

declare var interfaceConfig: Object;

/**
 * Middleware that captures actions to display notifications.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    switch (action.type) {

    case ADD_MESSAGE: {
        const { dispatch, getState } = store;
        const { message, senderId } = action;
        const state = getState();

        const { toastNotificationSettings } = state['features/toolbox-more'];

        if (!toastNotificationSettings.showChat) {
            return;
        }

        const _localParticipant = getLocalParticipant(state);

        if (_localParticipant.id === senderId) {
            return next(action);
        }

        dispatch(showNotification({
            text: message,
            userId: senderId

        }));

        return next(action);
    }

    case PARTICIPANT_JOINED: {
        const result = next(action);
        const { participant: p } = action;
        const { dispatch, getState } = store;

        if (p.local) {
            return;
        }

        const state = getState();

        const { toastNotificationSettings } = state['features/toolbox-more'];

        if (!toastNotificationSettings.showJoined) {
            return;
        }

        dispatch(showNotification({
            userId: p.id,
            userName: p.name,
            type: PARTICIPANT_JOINED
        }));

        return result;
    }

    case PARTICIPANT_LEFT: {
        const { dispatch, getState } = store;


        const state = getState();

        const { toastNotificationSettings } = state['features/toolbox-more'];

        if (!toastNotificationSettings.showLeft) {
            return;
        }


        const participant = getParticipantById(
            store.getState(),
            action.participant.id
        );

        dispatch(showNotification({
            userId: participant.id,
            userName: participant.name,
            type: PARTICIPANT_LEFT
        }));

        return next(action);
    }
    }

    return next(action);
});
