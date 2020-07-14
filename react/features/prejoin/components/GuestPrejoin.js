/* @flow */

import React from 'react';

import { translate } from '../../base/i18n';

import MeetingInfo from './MeetingInfo';
import useRequest from '../../hooks/use-request';
import { LoginComponent, Profile } from '../../app-auth';
import { InputField } from '../../base/premeeting';
import { getDisplayName, updateSettings } from '../../base/settings';
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

import {
    getQueryVariable
} from '../functions';

import { setPostWelcomePageScreen } from '../../app-auth/actions';

function GuestPrejoin(props) {
    const [meetingId, setMeetingId] = useState(props.meetingId);
    useEffect(() => {
        if(meetingId && !_isUserSignedOut && !continueAsGuest && !window.sessionStorage.getItem('isJWTSet')) {
            //Host has already signed-in, so there will be no JWT token in the url
            window.sessionStorage.setItem('isJWTSet', true);
            addTokenToURL()
        }
        else {
            setTimeout(async () => {
                if (_isUserSignedOut)
                    await unauthGetConference()
                else 
                    await getConference(true)
            }, 3000)
        }
        // Fetch the meeting details using the id in the address bar
        
    }, [meetingId]);

    const [meetingName, setMeetingName] = useState('');
    const [meetingPassword, setMeetingPassword] = useState('');
    const [meetingFrom, setMeetingFrom] = useState(null);
    const [meetingTo, setMeetingTo] = useState(null);
    const { joinConference, _isUserSignedOut = true } = props;
    const [isMeetingHost, setIsMeetingHost] = useState(false)
    const [continueAsGuest, setContinueAsGuest] = useState(false);
    const [showJoinMeetingForm, setShowJoinMeetingForm] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState('')
    const [isSecretEnabled, setIsSecretEnabled] = useState(false)
    const [conferenceStatus, setConferenceStatus] = useState('')

    const [guestName, setGuestName] = useState('')
    useEffect(() => {
        continueAsGuest && guestName.trim() !== "" &&
            props.updateSettings({
                displayName: guestName
            })
    }, [guestName])

    const [guestEmail, setGuestEmail] = useState('')
    useEffect(() => {
        continueAsGuest && guestEmail.trim() !== "" &&
            props.updateSettings({
                email: guestEmail
            })
    }, [guestEmail])

    const [unauthGetConference, fetchUnauthErrors] = useRequest({
        url: config.conferenceManager + config.unauthConferenceEP + '/' + meetingId,
        method: 'get',
        onSuccess: (data) => updateConferenceState(data)
    });

    const [getConference, fetchErrors] = useRequest({
        url: config.conferenceManager + config.conferenceEP + '/' + meetingId,
        method: 'get',
        onSuccess: (data) => updateConferenceState(data)
    });

    const formVerifySecretBody = () => {
        return {
            conferenceId: meetingId,
            conferenceSecret: meetingPassword
        }
    }

    const handleVerifySecret = (data) => {
        if (data.status === "SUCCESS") {
            window.sessionStorage.setItem('roomPassword', meetingPassword);
            checkMeetingStatus();
        }
        else {
            setShowPasswordError("Incorrect room password")
        }
    }

    const [verifySecret, verifySecretErrors] = useRequest({
        url: config.conferenceManager + config.verifySecretEP,
        method: 'post',
        body: formVerifySecretBody,
        onSuccess: (data) => handleVerifySecret(data)
    });


    const [meetingStarted, setMeetingStarted] = useState(null)

    const [meetingStatusCheck, meetingStatusErrors] = useRequest({
        url: config.conferenceManager + config.unauthConferenceEP + "/" + meetingId,
        method: 'get',
        onSuccess: (data) => {}
    });


    const updateConferenceState = (data) => {
        setMeetingId(data.conferenceId);
        setMeetingName(data.conferenceName);
        setMeetingFrom(data.scheduledFrom)
        setMeetingTo(data.scheduledTo)

        //TODO: comment the section below after completing the non-host flow
        // data.isHost = false

        setIsMeetingHost(data.isHost)

        setShowJoinMeetingForm(!_isUserSignedOut && !data.isHost)

        setIsSecretEnabled(data.isSecretEnabled)
        setConferenceStatus(data.conferenceStatus);

        APP.store.dispatch(setPostWelcomePageScreen(null,
            {
                meetingId : data.conferenceId,
                meetingName : data.conferenceName,
                meetingFrom : data.scheduledFrom,
                meetingTo : data.scheduledTo
            })
        );
    }

    const setMeetNowAndUpdatePage = (value) => {
        setMeetNow(value)
        isMeetNow(value)
    }

    const goToHome = () => {
        window.location.href = window.location.origin
    }

    const addTokenToURL = async () => {
        await getConference(true)
        if(!getQueryVariable('jwt')) {
            window.location.href = window.location.href + "?jwt=" + APP.store.getState()['features/app-auth'].meetingAccessToken
        }
    }

    const checkMeetingStatus = async () => {
        setMeetingStarted(false);
        const decideToJoin = (response, intervalTimer) => {
            if (response && response.conferenceStatus === "STARTED") {
                intervalTimer && clearInterval(intervalTimer);
                setMeetingStarted(true)
                _joinConference()
                return true;
            }
        }

        let joined = decideToJoin(await meetingStatusCheck())

        if(!joined) {
            let intervalTimer = setInterval(async () => {
                decideToJoin(await meetingStatusCheck(), intervalTimer)
            }, 5000)
        }
        
    }

    const handleJoinNow = async () => {

        //Verify conference secret(when join form is displayed)
        if (showJoinMeetingForm ||
            (!_isUserSignedOut && !isMeetingHost) ||
            continueAsGuest) {
            await verifySecret()
            return;
        }

        if (isMeetingHost) {
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

    const joinNowDisabled = continueAsGuest
        && (guestName.trim() === "" || (isSecretEnabled && meetingPassword.trim() === ""))

    

    useEffect(() => {
        if((!_isUserSignedOut || continueAsGuest)) {
            props.showTrackPreviews(true)
        }
        else {
            props.showTrackPreviews(false)
        }
    })

    return ( (fetchUnauthErrors || fetchErrors) ?  <div className={`hostPrejoin`}> {'Invalid meeting code'} </div> :
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
                            <div className="login-message" 
                                style={{
                                    visibility: (conferenceStatus === '' || conferenceStatus === "STARTED")
                                         ? 'hidden': 'visible'
                                }}>
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
                meetingStarted !== null && meetingStarted == false ?
                <div className="waiting-display">
                    <h2>Please wait for the host to join the meeting...</h2>
                    <img src={"images/loading.png"} />
                </div>
                :
                <>
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
                        (showJoinMeetingForm || (!_isUserSignedOut && !isMeetingHost) ||
                        continueAsGuest ) &&
                        <JoinMeetingForm
                            isSecretEnabled={isSecretEnabled}
                            isUserSignedOut={_isUserSignedOut}
                            meetingId={meetingId}
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
                        <div
                            className={`prejoin-page-button next 
                            ${joinNowDisabled ? 'disabled' : ''} `}
                            onClick={async () => !joinNowDisabled && handleJoinNow()}>
                            Join Now
                        </div>
                    }
                </>
            }
            

        </div>
    );
};

function mapStateToProps(state): Object {
    return {
        //meetingDetails: APP.store.getState()['features/app-auth'].meetingDetails,
        _isUserSignedOut: state['features/app-auth'].isUserSignedOut,
        _user: state['features/app-auth'].user,
        _displayName: getDisplayName(state)
    };
}

const mapDispatchToProps = {
    joinConference: joinConferenceAction,
    updateSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(translate(GuestPrejoin));
