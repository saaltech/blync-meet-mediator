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
import { getLocalParticipant } from '../../../base/participants';
import { connect } from '../../../base/redux';
import { getTrackByMediaTypeAndParticipant } from '../../../base/tracks';
import { showParticipantsList, showInvitePeople } from '../../../toolbox/actions.web';


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

        return (
            <OptionsPanel
                isOpen = { this.props.participantsListOpen }
                onClose = { () => APP.store.dispatch(showParticipantsList(false)) }
                title = { <div>
                    Participants ({this.props.participants.length})
                    {this.props._localParticipant.role === 'moderator' && <button
                        className = 'participants-list__add'
                        onClick = { () => APP.store.dispatch(showInvitePeople(true)) }>
                        <Icon
                            size = { 12 }
                            src = { IconAdd } /> Add
                    </button>}
                </div> }>
                <div className = 'participants-list'>

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
                                        <div className = 'participants-list__participant-name'>{participant.name}</div>
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

    return {
        participantsListOpen,
        participants,
        _tracks: tracks,
        _localParticipant: localParticipant
    };
}

export default connect(mapStateToProps)(ParticipantsList);

