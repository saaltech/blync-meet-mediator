import { isSuboptimalBrowser } from '../base/environment';
import { translateToHTML } from '../base/i18n';
import { toState } from '../base/redux';
import {
    areThereNotifications,
    showWarningNotification
} from '../notifications';
import { getOverlayToRender } from '../overlay';
import { config } from '../../config'

/**
 * Shows the suboptimal experience notification if needed.
 *
 * @param {Function} dispatch - The dispatch method.
 * @param {Function} t - The translation function.
 * @returns {void}
 */
export function maybeShowSuboptimalExperienceNotification(dispatch, t) {
    if (isSuboptimalBrowser()) {
        dispatch(
            showWarningNotification(
                {
                    titleKey: 'notify.suboptimalExperienceTitle',
                    description: translateToHTML(
                        t,
                        'notify.suboptimalBrowserWarning',
                        {
                            recommendedBrowserPageLink: `${window.location.origin}/static/recommendedBrowsers.html`
                        }
                    )
                }
            )
        );
    }
}

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
