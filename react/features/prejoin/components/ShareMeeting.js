/* @flow */

import React from 'react';

import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { getLocalParticipant } from '../../base/participants';
import { getRoomName } from '../../base/conference';
import { getInviteURL } from '../../base/connection';

import MeetingInfo from './MeetingInfo'; 
import useRequest from '../../hooks/use-request';
import { Profile } from '../../app-auth'
import CopyMeetingUrl from '../../base/premeeting/components/web/CopyMeetingUrl';
import CopyMeetingLinkSection from '../../invite/components/add-people-dialog/web/CopyMeetingLinkSection';
import InviteByEmailSection from '../../invite/components/add-people-dialog/web/InviteByEmailSection';
import { getInviteText } from '../../invite/functions';
import { useState } from 'react';

declare var interfaceConfig: Object;

function ShareMeeting(props) {
  const [meetingId, setMeetingId] = useState(null);
  const { meetingUrl, t, _conferenceName, _localParticipantName,
    _inviteUrl, _locationUrl } = props

  const inviteSubject = t('addPeople.inviteMoreMailSubject', {
      appName: interfaceConfig.APP_NAME
  });

  const invite = getInviteText({
    _conferenceName,
    _localParticipantName,
    _inviteUrl,
    _locationUrl,
    _dialIn: {},
    _liveStreamViewURL : null,
    phoneNumber: null,
    t
});

  return (
      <div className={`shareMeeting`}>
        <div className="label">Share Meeting Details</div>

        <CopyMeetingLinkSection url = { _inviteUrl } custom={true}/>
        <InviteByEmailSection
            inviteSubject = { inviteSubject }
            inviteText = { invite } 
            custom={true}/>

       {/* <CopyMeetingUrl meetingUrl={meetingUrl}/> */}
      </div>
  );
};

const mapStateToProps = (state) => {
  const localParticipant = getLocalParticipant(state);

  return {
      _conferenceName: getRoomName(state),
      _dialIn: state['features/invite'],
      _inviteUrl: getInviteURL(state),
      _localParticipantName: localParticipant?.name,
      _locationUrl: state['features/base/connection'].locationURL
  };
}

export default translate(connect(mapStateToProps, {})(ShareMeeting));
