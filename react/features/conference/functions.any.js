import { toState } from '../base/redux';
import { areThereNotifications } from '../notifications';
import { getOverlayToRender } from '../overlay';
import { config } from '../../config'

/**
 * Tells whether or not the notifications should be displayed within
 * the conference feature based on the current Redux state.
 *
 * @param {Object|Function} stateful - The redux store state.
 * @returns {boolean}
 */
export function shouldDisplayNotifications(stateful) {
    const state = toState(stateful);
    const isAnyOverlayVisible = Boolean(getOverlayToRender(state));
    const { calleeInfoVisible } = state['features/invite'];

    return areThereNotifications(state)
      && !isAnyOverlayVisible
      && !calleeInfoVisible;
}

export function getAppSocketEndPoint() {
  return `/app`
}

export function getConferenceSocketBaseLink() {
  return `${window.location.origin}`+ //  `https://dev-blync.saal.ai/`+
      `${config.conferenceManager}/wss`
}

export function getWaitingParticipantsSocketTopic(state = {}) {
  return `/conference/${state['features/app-auth']?.meetingDetails?.meetingId}/participants`
}


export function setConferenceLastNToOne(act = false) {
  const { conference } = APP.store.getState()['features/base/conference'];
  if(act) {
      conference && conference.setLastN(1);
  }
  else {
      conference && conference.setLastN(window.config.channelLastN);
  }
}