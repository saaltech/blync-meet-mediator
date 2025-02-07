
import React from 'react';

import { translate } from '../../base/i18n';
import { useState } from 'react';
import { InputField } from '../../base/premeeting';

function JoinMeetingForm(props) {
  const { meetingId, passwordError, isUserSignedOut, isSecretEnabled } = props;
  const { meetingPassword, setMeetingPassword } = props.meetingPassword;

  const { guestName, setGuestName } = props.guestName
  const { guestEmail, setGuestEmail } = props.guestEmail
    
  return (
      <div className="meetingInfo">

      {
          isUserSignedOut &&
          <>
            <div className="form-field">
                <div className = 'form-label mandatory'>{'Your Name'} <span>*</span></div>
                <InputField
                    onChange = {value => setGuestName(value.trim())}
                    placeHolder = { 'Type here' }
                />
            </div>

            <div className="form-field">
                <div className = 'form-label'>{'Email (optional)'}</div>
                <InputField
                    onChange = {value => setGuestEmail(value.trim())}
                    placeHolder = { 'Type here' }
                />
            </div>
          </>
      }


          <div className="form-field">
              <div className = 'form-label'>{'Meeting ID'}</div>
              <InputField
                  placeHolder = { 'Meeting ID' }
                  value = { meetingId } 
                  disabled = { true } 
               />
          </div>
        
        {
            isSecretEnabled &&
            <div className={`form-field ${passwordError ? 'password-error': ''}`}>
                <div className = 'form-label mandatory'>{'Password'} <span>*</span></div>
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
        }
          
          
        
      </div>
  );
};

export default translate(JoinMeetingForm);
