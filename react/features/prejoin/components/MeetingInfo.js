
import React from 'react';

import { translate } from '../../base/i18n';
import { useState } from 'react';
import { InputField } from '../../base/premeeting';
import ShareMeeting from './ShareMeeting';

function MeetingInfo(props) {
  const meetNow = props.meetNow;
  const shareable = props.shareable;
  const {meetingId, setMeetingId} = props.meetingId;
  const {meetingName, setMeetingName} = props.meetingName;
  const [meetingPassword, setMeetingPassword] = useState('');
  const [isPrivate, setIsPrivate] = useState(meetingPassword ? true : false);
  const {meetingFrom, setMeetingFrom} = props.meetingFrom;
  const {meetingTo, setMeetingTo} = props.meetingTo;

  const meetingUrl = !meetNow && window.location.origin + "/" +meetingId
    
  return (
      <div className="meetingInfo">
        <div className="meeting-title">{meetingName}</div>
        <div className="meeting-id">{meetingId}</div>
        {
            !meetNow &&
            <div>Date time field here</div>
        }
        {
            meetNow &&
            <div className="you-are-host"> You are the host of this meeting</div>
        }

        <div className="form-field">
            <div className = 'form-label'>{'(Participants will need a meeting link along with password to join this meeting)'}</div>
            <InputField
                onChange = {value => setMeetingPassword(value.trim())}
                placeHolder = { 'Meeting password' }
                value = { meetingPassword } />
        </div>

        
        {
          shareable && 
          <>
            <br />
            <hr />
            <br />
            <ShareMeeting meetingUrl={meetingUrl}/>
          </>
          
        }
        
      </div>
  );
};

export default translate(MeetingInfo);
