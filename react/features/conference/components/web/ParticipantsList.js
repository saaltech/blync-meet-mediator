// @flow
import React, { Component } from 'react';

import { Avatar } from '../../../base/avatar';
import { Icon, IconRaisedHand, IconMicrophone, IconCamera, IconAdd } from '../../../base/icons';
import { OptionsPanel } from '../../../base/options-panel';
import { connect } from '../../../base/redux';
import { showParticipantsList, showInvitePeople } from '../../../toolbox/actions.web';


type Props = {
    participantsListOpen: boolean,
    participants: Array<Object>
}

/**
 * ParticipantsList react component.
 *
 * @class ParticipantsCount
 */
class ParticipantsList extends Component<Props> {
    /**
     * Implements React's {@link PureComponent#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {

        return (
            <OptionsPanel
                isOpen = { this.props.participantsListOpen }
                onClose = { () => APP.store.dispatch(showParticipantsList(false)) }
                title = { <div>
                    Participants ({this.props.participants.length})
                    <button
                        className = 'participants-list__add'
                        onClick = { () => APP.store.dispatch(showInvitePeople(true)) }>
                        <Icon
                            size = { 12 }
                            src = { IconAdd } /> Add
                    </button>
                </div> }>
                <div className = 'participants-list'>

                    <ul className = 'participants-list__list'>
                        {

                            (this.props.participants || [])
                            .map(participant => (<li key = { participant.id }>
                                <div className = 'participants-list__label'>
                                    <Avatar
                                        participantId = { participant.id }
                                        size = { 32 } />
                                    <div className = 'participants-list__participant-name'>{participant.name}</div>
                                </div>
                                <div className = 'participants-list__controls'>
                                    <button><Icon
                                        size = { 18 }
                                        src = { IconRaisedHand } /></button>
                                    <button><Icon
                                        size = { 18 }
                                        src = { IconMicrophone } /></button>
                                    <button><Icon
                                        size = { 18 }
                                        src = { IconCamera } /></button>
                                </div>
                            </li>))
                        }
                    </ul>
                </div>
            </OptionsPanel>
        );
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code ParticipantsList} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function mapStateToProps(state) {
    const { participantsListOpen } = state['features/toolbox'];
    const participants = state['features/base/participants'];

    return {
        participantsListOpen,
        participants
    };
}

export default connect(mapStateToProps)(ParticipantsList);

