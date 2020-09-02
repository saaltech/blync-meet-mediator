/**
 * Selector for calculating the number of unread chat messages.
 *
 * @param {Object} state - The redux state.
 * @returns {number} The number of unread messages.
 */
 export function getWaitingParticipantCount(state: Object)  {
    const waitingPartObj = state['features/base/waiting-participants'];
    let waitingParticipants = 0
    if(waitingPartObj.isNewList) {
        waitingParticipants = waitingPartObj.participants.length;
    }
    return waitingParticipants;
}