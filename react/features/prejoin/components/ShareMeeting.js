/* @flow */

import React, { useState } from 'react';


import { Profile } from '../../app-auth';
import { getRoomName } from '../../base/conference';
import { getInviteURL } from '../../base/connection';
import { translate } from '../../base/i18n';
import { getLocalParticipant } from '../../base/participants';
import CopyMeetingUrl from '../../base/premeeting/components/web/CopyMeetingUrl';
import { connect } from '../../base/redux';
import useRequest from '../../hooks/use-request';
import CopyMeetingLinkSection from '../../invite/components/add-people-dialog/web/CopyMeetingLinkSection';
import InviteByEmailSection from '../../invite/components/add-people-dialog/web/InviteByEmailSection';
import { getInviteText } from '../../invite/functions';

import MeetingInfo from './MeetingInfo';


declare var interfaceConfig: Object;

function ShareMeeting(props) {
    const [ meetingId, setMeetingId ] = useState(null);
    const {
        meetingUrl,
        t,
        _conferenceName,
        _localParticipantName,
        _inviteUrl,
        _locationUrl,
        meetingName,
        meetingFrom,
        meetingPassword } = props;

    const inviteSubject = t('addPeople.inviteMoreMailSubject', {
        appName: interfaceConfig.APP_NAME
    });

    const invite = getInviteText({
        _conferenceName,
        _localParticipantName,
        _inviteUrl,
        _locationUrl,
        _dialIn: {},
        _liveStreamViewURL: null,
        _password: meetingPassword,
        _fromDate: meetingFrom,
        _meetingName: meetingName,
        phoneNumber: null,
        t
    });

    return (
        <div className = { 'shareMeeting' }>
            <div className = 'label'>Share Meeting Details</div>

            <CopyMeetingLinkSection
                url = { _inviteUrl }
                custom = { true } />
            <InviteByEmailSection
                inviteSubject = { inviteSubject }
                inviteText = { invite }
                custom = { true } />

            {/* <CopyMeetingUrl meetingUrl={meetingUrl}/> */}
        </div>
    );
}

const mapStateToProps = state => {
    const localParticipant = getLocalParticipant(state);

    return {
        _conferenceName: getRoomName(state),
        _dialIn: state['features/invite'],
        _inviteUrl: getInviteURL(state),
        _localParticipantName: localParticipant?.name,
        _locationUrl: state['features/base/connection'].locationURL
    };
};

export default translate(connect(mapStateToProps, {})(ShareMeeting));
