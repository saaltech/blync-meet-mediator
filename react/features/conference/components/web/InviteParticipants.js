/* eslint-disable no-empty-function */
// @flow
import React, { Component } from 'react';

import { config } from '../../../../config';
import { OptionsPanel } from '../../../base/options-panel';
import { connect } from '../../../base/redux';
import useRequest from '../../../hooks/use-request';
import MeetingInfo from '../../../prejoin/components/MeetingInfo';
import { showInvitePeople } from '../../../toolbox/actions.web';

type Props = {
    _isOpen: boolean,
    _meetingDetails: Object
}


type State = {
    meetingDetails: Object,
}


const MeetingDetails = ({ meetingId, cb, children }) => {
    const [ doRequest ] = useRequest({
        url: `${config.conferenceManager + config.conferenceEP}/${meetingId}`,
        method: 'get',
        onSuccess: data => {
            cb(data);
        }
    });

    React.useEffect(() => {
        doRequest(true, true);
    }, []);

    return children;
};

/**
 * InviteParticipants react component.
 *
 * @class ParticipantsCount
 */
class InviteParticipants extends Component<Props, State> {

    state = {
        meetingDetails: null
    }

    /**
     * Implements React's {@link PureComponent#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        if (!this.props._isOpen) {
            return null;
        }

        const {
            meetingName,
            meetingId,
            isPrivate,
            meetingFrom,
            meetingTo
        } = this.props._meetingDetails;

        return (
            <OptionsPanel

                isOpen = { true }
                noBodyPadding = { true }
                onClose = { () => APP.store.dispatch(showInvitePeople(false)) }>
                <div className = 'invite-participants'>

                    <MeetingDetails
                        cb = { data => this.setState({ meetingDetails: data }) }
                        { ...this.props._meetingDetails } >
                        <MeetingInfo
                            isPrivate = {{
                                isPrivate,
                                setIsPrivate: () => {}
                            }}
                            meetNow = { false }
                            meetingFrom = {{
                                meetingFrom,
                                setMeetingFrom: () => {}
                            }}
                            meetingId = {{
                                meetingId
                            }}
                            meetingName = {{
                                meetingName,
                                setMeetingName: () => {}
                            }}

                            meetingPassword = {{
                                meetingPassword: (this.state.meetingDetails || {}).conferenceSecret,
                                setMeetingPassword: () => {}
                            }}

                            meetingTo = {{
                                meetingTo,
                                setMeetingTo: () => {}
                            }}
                            isFromConference= { true }
                            shareable = { true } />
                    </MeetingDetails>
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
    const { invitePeopleVisible } = state['features/toolbox'];
    const meetingDetails = APP.store.getState()['features/app-auth'].meetingDetails;

    return {
        _isOpen: invitePeopleVisible,
        _meetingDetails: meetingDetails
    };
}

export default connect(mapStateToProps)(InviteParticipants);

