/* @flow */

import React from 'react';

import { translate } from '../../base/i18n';

import MeetingInfo from './MeetingInfo'; 
import useRequest from '../../hooks/use-request';
import { LoginComponent, Profile } from '../../app-auth';
import { InputField } from '../../base/premeeting';
import { connect } from '../../base/redux';
import { setPrejoinPageErrorMessageKey } from '../';
import {
    Icon,
    IconArrowBack
} from '../../base/icons';

import { config } from '../../../config'


import {
    joinConference as joinConferenceAction,
    joinConferenceWithoutAudio as joinConferenceWithoutAudioAction,
    setSkipPrejoin as setSkipPrejoinAction,
    setJoinByPhoneDialogVisiblity as setJoinByPhoneDialogVisiblityAction
} from '../actions';


import { useState, useEffect } from 'react';
import JoinMeetingForm from './JoinMeetingForm';
import { setFatalError } from '../../overlay';

function GuestPrejoin(props) {
  const [meetingId, setMeetingId] = useState(props.meetingId);
  const [meetingName, setMeetingName] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');
  const [meetingFrom, setMeetingFrom] = useState(null);
  const [meetingTo, setMeetingTo] = useState(null);
  const [hostId, setHostId] = useState('');
  const [hideLogin, setHideLogin] = useState(true)
  const { joinConference, _isUserSignedOut = true } = props;
  const [isMeetingHost, setIsMeetingHost] = useState(false)
  const [shareable, setShareable] = useState(false);
  const [continueAsGuest, setContinueAsGuest] = useState(false);
  const [showJoinMeetingForm, setShowJoinMeetingForm] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState('')

  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  useEffect(() => {
    // Fetch the meeting details using the id in the address bar
    setTimeout(async () => { 
        if(_isUserSignedOut)
            await unauthGetConference()
        else
            await getConference()
    }, 3000)
  }, [meetingId]);

  const [ unauthGetConference, fetchUnauthErrors ] = useRequest({
    url: config.conferenceManager + config.unauthConferenceEP + '/'+ meetingId,
    method: 'get',
    onSuccess: (data) => updateConferenceState(data)
  });

  const [ getConference, fetchErrors ] = useRequest({
    url: config.conferenceManager + config.conferenceEP + '/'+ meetingId,
    method: 'get',
    onSuccess: (data) => updateConferenceState(data)
  });

  const formVerifySecretBody = () => {
        return {
        conferenceId: meetingId,
        conferenceSecret: meetingPassword
        }
    }

  const [ verifySecret, verifySecretErrors ] = useRequest({
    url: config.conferenceManager + config.verifySecretEP,
    method: 'post',
    body: formVerifySecretBody,
    onSuccess: (data) => updateConferenceState(data)
  });

  

  const updateConferenceState = (data) => {
        setMeetingId(data.conferenceId);
        setMeetingName(data.conferenceName);
        setMeetingFrom(data.scheduledFrom)
        setMeetingTo(data.scheduledTo)

        //TODO: uncomment this below after completing the not host flow
        setIsMeetingHost(/*data.isHost ||*/ false)
  }
  
  const setMeetNowAndUpdatePage = (value) => {
    setMeetNow(value)
    isMeetNow(value)
  }

  const goToHome = () => {
    window.location.href = window.location.origin
  }

  const addTokenToURL = async () => {
      await getConference()
      window.location.href = window.location.href + "?jwt=" + APP.store.getState()['features/app-auth'].meetingAccessToken
  }

  const handleJoinNow = async () => {

        //Verify conference secret(when join form is displayed)
        if(showJoinMeetingForm || 
            (!_isUserSignedOut && !isMeetingHost) ||
            continueAsGuest) {
                let response = await verifySecret(true)
                if(response.status === "SUCCESS") {
                    window.sessionStorage.setItem('roomPassword', meetingPassword);
                    _joinConference();
                }
                else {
                    setShowPasswordError("Incorrect room password")
                }

            return;
        }

        if(isMeetingHost) {
            _joinConference();
        }
        else {
            setShowJoinMeetingForm(true)
        }

  }

  const _joinConference = () => {
    APP.store.dispatch(setPrejoinPageErrorMessageKey('submitting'));
    joinConference();
  }

  return (
      <div className={`hostPrejoin`}>
        {/* onClick={() => setHideLogin(false)} */}
        {
            !_isUserSignedOut ?
            <>
                <div className="profileSection">
                    <Profile />
                </div>
            </>
            :
            <>
                {
                    !continueAsGuest &&
                    <div className="login-message">
                        <span>Please</span>
                        <span className="sign-in-link"> sign in </span> 
                        <span>if you are the host.</span>
                    </div>
                }
            </>
        }
            
        <MeetingInfo 
            shareable={false}
            isPureJoinFlow={{
                isMeetingHost
            }}
            meetingId={{
                meetingId
            }}
            meetingName={{
                meetingName, setMeetingName
            }}
            meetingPassword={{
                meetingPassword, setMeetingPassword
            }}
            meetingFrom={{
                meetingFrom, setMeetingFrom
            }}
            meetingTo={{
                meetingTo, setMeetingTo
            }}
        />


        {
            (_isUserSignedOut && !continueAsGuest) &&  
            <>
                <LoginComponent 
                    closeAction={() => {
                        //Reload the page with JWT token
                        addTokenToURL()
                    }}
                />

                <div className="no-account">
                    <div>Don't have an account?</div>
                    <div onClick={() => setContinueAsGuest(true)}> Continue as a Guest </div>
                </div>
            </>
        }
        
        {
            showJoinMeetingForm || (!_isUserSignedOut && !isMeetingHost) ||
            continueAsGuest &&
            <JoinMeetingForm 
                isUserSignedOut = {_isUserSignedOut}
                meetingId = {meetingId}
                meetingPassword={{
                    meetingPassword, setMeetingPassword
                }}
                guestName={{
                    guestName, setGuestName
                }}
                guestEmail={{
                    guestEmail, setGuestEmail
                }}
                passwordError={showPasswordError}
            />

        }

        {
            (!_isUserSignedOut || continueAsGuest) &&
            <div className="prejoin-page-button next" 
                onClick={async () => handleJoinNow()}>
                Join Now
            </div>
        }
            
        </div>
  );
};

function mapStateToProps(state): Object {
    return {
        //meetingDetails: APP.store.getState()['features/app-auth'].meetingDetails,
        _isUserSignedOut : state['features/app-auth'].isUserSignedOut,
        _user : state['features/app-auth'].user
    };
}

const mapDispatchToProps = {
    joinConference: joinConferenceAction
};

export default connect(mapStateToProps, mapDispatchToProps)(translate(GuestPrejoin));
