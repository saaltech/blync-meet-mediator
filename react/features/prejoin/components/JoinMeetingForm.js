
import React from 'react';

import { translate } from '../../base/i18n';
import { useState } from 'react';
import { InputField } from '../../base/premeeting';

function JoinMeetingForm(props) {
  const { meetingId, passwordError, isUserSignedOut } = props;
  const { meetingPassword, setMeetingPassword } = props.meetingPassword;

  const { guestName, setGuestName } = props.guestName
  const { guestEmail, setGuestEmail } = props.guestEmail
    
  return (
      <div className="meetingInfo">

      {
          isUserSignedOut &&
          <>
            <div className="form-field">
                <div className = 'form-label'>{'Your Name'}</div>
                <InputField
                    onChange = {value => setGuestName(value.trim())}
                    placeHolder = { 'Type here' }
                />
            </div>

            <div className="form-field">
                <div className = 'form-label'>{'Email'}</div>
                <InputField
                    onChange = {value => setGuestEmail(value.trim())}
                    placeHolder = { 'Type here' }
                />
            </div>
          </>
      }


          <div className="form-field">
              <div className = 'form-label'>{'Meeting Code'}</div>
              <InputField
                  placeHolder = { 'Meeting ID' }
                  value = { meetingId } 
                  disabled = { true } 
               />
          </div>
        
          <div className={`form-field ${passwordError ? 'password-error': ''}`}>
              <div className = 'form-label'>{'Password'}</div>
              <InputField
                  onChange = {value => setMeetingPassword(value.trim())}
                  placeHolder = { 'Meeting password' }
                  value = { meetingPassword }
              />

                {
                    passwordError &&
                    <div className={`error-block`}> { passwordError }</div>
                }
          </div>
          
        
      </div>
  );
};

export default translate(JoinMeetingForm);
