
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
  const [isPrivate, setIsPrivate] = useState(false);
  const {meetingFrom, setMeetingFrom} = props.meetingFrom;
  const {meetingTo, setMeetingTo} = props.meetingTo;

  const meetingUrl = !meetNow && window.location.origin + "/" +meetingId
    
  return (
      <div className="meetingInfo">
        <div className="meeting-title">{meetingName}</div>
        <div className="meeting-id">{meetingId}</div>
        {
            !meetNow &&
            <div className="you-are-host">Date time field here</div>
        }
        {
            meetNow &&
            <div className="you-are-host"> You are the host of this meeting</div>
        }
        {
          (!shareable || (isPrivate && shareable)) &&
          <div className="form-field make-private">
              <InputField
                  type = "checkbox"
                  onChange = {() => setIsPrivate(!isPrivate)}
                  value = { isPrivate } 
                  id = "makePrivate"
                  disabled = { shareable }/>
              <label className = 'form-label' htmlFor="makePrivate">
              {'Make this a private meeting'}
              </label>
              <div className = 'form-label sub-label'>{'(Participants will need a meeting link along with password to join this meeting)'}</div>
          </div>
        }
        

        { 
          (!shareable || (shareable && isPrivate)) &&
          <div className="form-field meeting-password">
              <InputField
                  onChange = {value => setMeetingPassword(value.trim())}
                  placeHolder = { 'Meeting password' }
                  value = { meetingPassword } 
                  disabled = { shareable || !isPrivate } />
          </div>
        }
        

        
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
