
import React from 'react';

import { translate } from '../../base/i18n';
import { useState } from 'react';
import { InputField } from '../../base/premeeting';

import { AudioSettingsButton, VideoSettingsButton } from '../../toolbox/components';
import Preview from '../../../features/base/premeeting/components/web/Preview';

function JoinMeetingForm(props) {
    const { meetingId, passwordError, isUserSignedOut, isSecretEnabled } = props;
    const { meetingPassword, setMeetingPassword } = props.meetingPassword;

    const { guestName, setGuestName } = props.guestName
    const { guestEmail, setGuestEmail } = props.guestEmail

    return (
        <div className="meetingInfo">
            <Preview
                videoMuted={props.videoMuted}
                videoTrack={props.videoTrack} >
                <div className='media-btn-container'>
                    <AudioSettingsButton visible={true} />
                    <VideoSettingsButton visible={true} />
                </div>
                {props.previewFooter}
            </Preview>

            {
                isUserSignedOut &&
                <>
                    <div className="form-field-guest">
                        <div className='form-label-guest mandatory'>{'Your Name'} <span>*</span></div>
                        <InputField
                            onChange={value => setGuestName(value.trim())}
                            placeHolder={'Type here'}
                        />
                    </div>

                    <div className="form-field-guest">
                        <div className='form-label-guest'>{'Email (optional)'}</div>
                        <InputField
                            onChange={value => setGuestEmail(value.trim())}
                            placeHolder={'Type here'}
                        />
                    </div>
                </>
            }


            {/* <div className="form-field-guest">
                <div className='form-label-guest'>{'Meeting ID'}</div>
                <InputField
                    placeHolder={'Meeting ID'}
                    value={meetingId}
                    disabled={true}
                />
            </div> */}

            {
                isSecretEnabled &&
                <div className={`form-field-guest ${passwordError ? 'password-error' : ''}`}>
                    <div className='form-label-guest mandatory'>{'Password'} <span>*</span></div>
                    <InputField
                        onChange={value => setMeetingPassword(value.trim())}
                        placeHolder={'Meeting password'}
                        value={meetingPassword}
                    />

                    {
                        passwordError &&
                        <div className={`error-block`}> {passwordError}</div>
                    }
                </div>
            }



        </div>
    );
};

export default translate(JoinMeetingForm);
