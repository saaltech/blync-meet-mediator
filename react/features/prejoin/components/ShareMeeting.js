/* @flow */

import React from 'react';

import { translate } from '../../base/i18n';

import MeetingInfo from './MeetingInfo'; 
import useRequest from '../../hooks/use-request';
import { Profile } from '../../app-auth'
import CopyMeetingUrl from '../../base/premeeting/components/web/CopyMeetingUrl';


import { useState } from 'react';

function ShareMeeting(props) {
  const [meetingId, setMeetingId] = useState(null);
  const { meetingUrl } = props

  return (
      <div className={`shareMeeting`}>
        <div>Share Meeting Details</div>
        <CopyMeetingUrl meetingUrl={meetingUrl}/>
      </div>
  );
};

export default translate(ShareMeeting);
