// @flow
import React, { Component } from 'react';

import { Avatar } from '../../../base/avatar';
import {
    Icon,
    IconRaisedHand,
    IconMicrophone,
    IconCamera,
    IconAdd,
    IconNoRaisedHand,
    IconCameraDisabled,
    IconMicrophoneEmpty,
    IconSpeaking
} from '../../../base/icons';
import { MEDIA_TYPE } from '../../../base/media';
import { OptionsPanel } from '../../../base/options-panel';
import { getLocalParticipant, PARTICIPANT_ROLE } from '../../../base/participants';
import { WaitingParticipantView } from '../../../base/waiting-participants/components';
import { connect } from '../../../base/redux';
import { getTrackByMediaTypeAndParticipant } from '../../../base/tracks';
import { showParticipantsList, showInvitePeople } from '../../../toolbox/actions.web';
import { clearWaitingNotification } from '../../../base/waiting-participants'

type Props = {
    participantsListOpen: boolean,
    participants: Array<Object>,
    _tracks: Array<Object>,
    _localParticipant: Object,
    _meetingDetails: Object,
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
        if (!this.props.participantsListOpen) {
            return null;
        }
        // else {
        //     APP.store.dispatch(clearWaitingNotification())
        // }

        const activeParticipants = (this.props.participants || []).length

        return (
            <OptionsPanel
                isOpen = { this.props.participantsListOpen }
                noBodyPadding = {true}
                bodyClass = 'flex-column'
                onClose = { () => APP.store.dispatch(showParticipantsList(false)) }
                title = { <div>
                    Participants ({this.props._waitingParticipantsLength + activeParticipants})
                    {this.props._localParticipant.role === 'moderator' && <button
                        className = 'participants-list__add'
                        onClick = { () => APP.store.dispatch(showInvitePeople(true)) }>
                        <Icon
                            size = { 12 }
                            src = { IconAdd } /> Add
                    </button>}
                </div> }>
                
                { 
                    this.props._isModerator &&
                    <WaitingParticipantView />
                }
                
                
                <div className = 'participants-list'>
                    {
                        //this.props._waitingParticipantsLength > 0 &&
                        this.props._isModerator && 
                        this.props._isWaitingEnabled && 
                        <div className = 'participants-list__header'>
                            <div>
                                { `Active (${(this.props.participants || []).length})` } 
                            </div>
                        </div>
                    }
                    
                    <ul className = 'participants-list__list'>
                        {

                            (this.props.participants || [])
                            .map(participant => {

                                const audioTrack = getTrackByMediaTypeAndParticipant(this.props._tracks, MEDIA_TYPE.AUDIO, participant.id);

                                const videoTrack = getTrackByMediaTypeAndParticipant(this.props._tracks, MEDIA_TYPE.VIDEO, participant.id);

                                return (<li key = { participant.id }>
                                    <div className = 'participants-list__label'>
                                        <Avatar
                                            participantId = { participant.id }
                                            size = { 32 } />
                                        <div title = {participant.name} className = 'participants-list__participant-name'>{participant.name}</div>
                                    </div>
                                    <div className = 'participants-list__controls'>
                                        <button><Icon
                                            size = { 18 }
                                            src = { participant.raisedHand ? IconRaisedHand : IconNoRaisedHand } /></button>
                                        <button>
                                            {participant.dominantSpeaker && <Icon
                                                size = { 18 }
                                                src = { IconSpeaking } />}
                                            {!participant.dominantSpeaker && <Icon
                                                size = { 18 }
                                                src = { !audioTrack || (audioTrack || {}).muted ? IconMicrophoneEmpty : IconMicrophone } />}</button>
                                        <button>
                                            <Icon
                                                size = { 18 }
                                                src = { !videoTrack || (videoTrack || {}).muted ? IconCameraDisabled : IconCamera } /></button>
                                    </div>
                                </li>);
                            }
                            )
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
    const tracks = state['features/base/tracks'];
    const localParticipant = getLocalParticipant(APP.store.getState());
    const isModerator = (localParticipant || {}).role === PARTICIPANT_ROLE.MODERATOR;

    return {
        participantsListOpen,
        participants,
        _tracks: tracks,
        _localParticipant: localParticipant,
        _isModerator: isModerator,
        _isWaitingEnabled: state['features/app-auth'].meetingDetails?.isWaitingEnabled,
        _waitingParticipantsLength: state['features/base/waiting-participants'].participants?.length || 0
    };
}

export default connect(mapStateToProps)(ParticipantsList);

