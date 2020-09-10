// @flow

import VideoLayout from '../../../modules/UI/videolayout/VideoLayout.js';
import { CONFERENCE_JOINED, CONFERENCE_WILL_LEAVE } from '../base/conference';
import {
    DOMINANT_SPEAKER_CHANGED,
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_UPDATED,
    PIN_PARTICIPANT,
    getParticipantById
} from '../base/participants';
import {SCREEN_SHARE_PARTICIPANTS_UPDATED} from  './actions'
import { MiddlewareRegistry } from '../base/redux';
import { TRACK_ADDED, TRACK_REMOVED } from '../base/tracks';
import { SET_FILMSTRIP_VISIBLE, SET_FILMSTRIP_COLLAPSED } from '../filmstrip';

import './middleware.any';

declare var APP: Object;

/**
 * Middleware which intercepts actions and updates the legacy component
 * {@code VideoLayout} as needed. The purpose of this middleware is to redux-ify
 * {@code VideoLayout} without having to simultaneously react-ifying it.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry.register(store => next => action => {
    // Purposefully perform additional actions after state update to mimic
    // being connected to the store for updates.
    const result = next(action);

    switch (action.type) {
    case CONFERENCE_JOINED:
        VideoLayout.mucJoined();

        // window.VideoLayout = VideoLayout;

        setTimeout(() => VideoLayout.onHostChange(), 2000);
        break;

    case CONFERENCE_WILL_LEAVE:
        VideoLayout.reset();
        break;

    case SCREEN_SHARE_PARTICIPANTS_UPDATED: {
        store.dispatch({type: SET_FILMSTRIP_COLLAPSED, collapsed: true})
        break;
    }    

    case PARTICIPANT_JOINED:
        setTimeout(() => VideoLayout.onHostChange(), 2000);
        if (!action.participant.local) {
            VideoLayout.addRemoteParticipantContainer(
                getParticipantById(store.getState(), action.participant.id));
        }

        break;

    case PARTICIPANT_LEFT:
        VideoLayout.removeParticipantContainer(action.participant.id);

        break;

    case PARTICIPANT_UPDATED: {

        // Look for actions that triggered a change to connectionStatus. This is
        // done instead of changing the connection status change action to be
        // explicit in order to minimize changes to other code.
        if (typeof action.participant.connectionStatus !== 'undefined') {
            VideoLayout.onParticipantConnectionStatusChanged(
                action.participant.id,
                action.participant.connectionStatus);
        }

        setTimeout(() => VideoLayout.onHostChange(), 2000);

        break;
    }

    case DOMINANT_SPEAKER_CHANGED:
        VideoLayout.onDominantSpeakerChanged(action.participant.id);
        break;

    case PIN_PARTICIPANT:
        VideoLayout.onPinChange(action.participant.id);
        break;

    case SET_FILMSTRIP_VISIBLE:
        VideoLayout.resizeVideoArea();
        break;

    case TRACK_ADDED:
        if (!action.track.local) {
            VideoLayout.onRemoteStreamAdded(action.track.jitsiTrack);
        }


        break;
    case TRACK_REMOVED:
        if (!action.track.local) {
            VideoLayout.onRemoteStreamRemoved(action.track.jitsiTrack);
        }

        break;
    }

    return result;
});
