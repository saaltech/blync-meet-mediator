/* @flow */

import React from 'react';

import { translate } from '../../base/i18n';

import { getUserAgentDetails } from '../../base/environment/utils';
import MeetingInfo from './MeetingInfo';
import useRequest from '../../hooks/use-request';
import { LoginComponent, Profile } from '../../app-auth';
import { InputField } from '../../base/premeeting';
import { getDisplayName, updateSettings } from '../../base/settings';
import { connect } from '../../base/redux';
import { setPrejoinPageErrorMessageKey } from '../';
import { setLocationURL } from '../../base/connection/actions.web';
import { openConnection } from '../../../../connection';
import Loading from '../../always-on-top/Loading';

import { config } from '../../../config'

import {
    Icon,
    IconLogo
} from '../../base/icons';

import {
    joinConference as joinConferenceAction,
    joinConferenceWithoutAudio as joinConferenceWithoutAudioAction,
    setSkipPrejoin as setSkipPrejoinAction,
    setJoinByPhoneDialogVisiblity as setJoinByPhoneDialogVisiblityAction
} from '../actions';

import { 
    getConferenceSocketBaseLink,
    getWaitingParticipantsSocketTopic,
    getAppSocketEndPoint } from '../../conference/functions';


import { useState, useEffect } from 'react';
import JoinMeetingForm from './JoinMeetingForm';
import { setFatalError } from '../../overlay';

import {
    getQueryVariable
} from '../functions';

import { setPostWelcomePageScreen } from '../../app-auth/actions';
import SockJsClient from 'react-stomp';

function GuestPrejoin(props) {
    let clientRef;
    const [ exiting, setExiting ] = useState(false);
    const [disableJoin, setDisableJoin] = useState(true);
    const [meetingId, setMeetingId] = useState(props.meetingId);
    const userAgent = getUserAgentDetails();
    useEffect(() => {
        // if(meetingId && !_isUserSignedOut && !continueAsGuest && !window.sessionStorage.getItem('isJWTSet')) {
        //     //Host has already signed-in, so there will be no JWT token in the url
        //     window.sessionStorage.setItem('isJWTSet', true);
        //     addTokenToURL()
        // }
        // else {
            setTimeout(async () => {
                if (_isUserSignedOut)
                    await unauthGetConference()
                else 
                    refreshTokenAndFetchConference()
            }, 3000)
        // }
        // Fetch the meeting details using the id in the address bar
        
    }, [meetingId]);

    const [meetingName, setMeetingName] = useState('');
    const [meetingPassword, setMeetingPassword] = useState('');
    const [meetingFrom, setMeetingFrom] = useState(null);
    const [meetingTo, setMeetingTo] = useState(null);
    const { joinConference, _isUserSignedOut = true, 
        joinMeeting, _jid, _user, _isGoogleSigninUser } = props;
    const [isMeetingHost, setIsMeetingHost] = useState(false)
    const [continueAsGuest, setContinueAsGuest] = useState(false);
    const [showJoinMeetingForm, setShowJoinMeetingForm] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState('')
    const [isSecretEnabled, setIsSecretEnabled] = useState(false)
    const [conferenceStatus, setConferenceStatus] = useState('')
    const [ enableWaitingRoom, setEnableWaitingRoom ] = useState(false);
    const [ participantRejected, setParticipantRejected ] = useState(false);
    const [ meetingEnded, setMeetingEnded ] = useState(false);

    const [guestName, setGuestName] = useState('')
    useEffect(() => {
        continueAsGuest && guestName.trim() !== "" &&
            props.updateSettings({
                displayName: guestName,
                email: guestEmail // Done to reset the avatar that might have been set in the previous session 
            })
    }, [guestName])

    const [guestEmail, setGuestEmail] = useState('')
    useEffect(() => {
        continueAsGuest &&
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

    const formWaitingParticipantRequestBody = () => {
        return {
            'conferenceId': meetingId,
            'jid': _jid,
            'email': guestEmail,
            'username': guestName
        };
    };

    const [ addWaitingParticipant, addWaitingParticipantError]  = useRequest({
        url: config.conferenceManager + config.unauthParticipantsEP,
        method: 'post',
        body: formWaitingParticipantRequestBody
    })

    const formJoinEventParticipantRequestBody = () => {
        return {
            "client": userAgent.getBrowserName(),
            "clientVersion": userAgent.getBrowserVersion(),
            "conferenceId": meetingId,
            "displayName": guestName || _user?.name,
            "jid": _jid,
            "loginType": _isUserSignedOut ? null : (_isGoogleSigninUser ? 'google' : 'default'),
            "os": userAgent.getOSName(),
            "osVersion": userAgent.getOSVersion(),
            "userId": _user?.id
        };
    };

    const [ participantJoin, participantJoinError]  = useRequest({
        url: config.conferenceManager + config.unauthParticipantsEP + '/joinevent',
        method: 'post',
        body: formJoinEventParticipantRequestBody
    });

    const verifySecretPostProcess = async (data) => {
        if (data.status === "SUCCESS") {
            window.sessionStorage.setItem('roomPassword', meetingPassword);

            // Insert guest details for waiting room functionality
            if(enableWaitingRoom) {
                await addWaitingParticipant(!_isUserSignedOut)
            }

            // Check if meeting has started, if not go to checkMeetingStatus(), else checkWaitingStatus()
            // and if waiting room was enabled, check if the current user is allowed to join
            if (conferenceStatus !== "STARTED" || enableWaitingRoom) {
                setMeetingConnected(false); //useEffect would trigger post actions
            }
            else {
                _joinConference();
            }
        }
        else {
            setShowPasswordError("Incorrect room password")
        }
    }

    const formVerifySecretBody = () => {
        return {
            conferenceId: meetingId,
            conferenceSecret: meetingPassword
        }
    }

    const [verifySecret, verifySecretErrors] = useRequest({
        url: config.conferenceManager + config.verifySecretEP,
        method: 'post',
        body: formVerifySecretBody,
        onSuccess: (data) => verifySecretPostProcess(data)
    });

    const [meetingConnected, setMeetingConnected] = useState(null)
    useEffect(() => {
        if(meetingConnected === false) {
            if (conferenceStatus !== "STARTED") {
                checkMeetingStatus();
            }
            else if(enableWaitingRoom) {
                checkWaitingStatus();
            }
        }
    }, [meetingConnected])

    const [meetingWaiting, setMeetingWaiting] = useState(false)

    const [meetingStatusCheck, meetingStatusErrors] = useRequest({
        url: config.conferenceManager + config.unauthConferenceEP + "/" + meetingId,
        method: 'get',
        onSuccess: (data) => {}
    });

    const [ waitingStatusCheck, waitingStatusCheckErrors ] = useRequest({
        url: `${config.conferenceManager}${config.unauthParticipantsEP}?conferenceId=${meetingId}&jid=${_jid}` ,
        method: 'get'
    });


    const updateConferenceState = (data) => {
        setMeetingId(data.conferenceId);
        setMeetingName(data.conferenceName);
        setMeetingFrom(data.scheduledFrom)
        setMeetingTo(data.scheduledTo)
        setEnableWaitingRoom(data.isWaitingEnabled)

        setIsMeetingHost(data.isHost)
        if(data.isHost && data.conferenceStatus === "STARTED") {
            window.sessionStorage.setItem('roomPassword', data.conferenceSecret);
            setMeetingPassword(data.conferenceSecret)
        }

        setShowJoinMeetingForm(!_isUserSignedOut && !data.isHost)

        setIsSecretEnabled(data.isSecretEnabled)
        setConferenceStatus(data.conferenceStatus);

        setDisableJoin(false)
        APP.store.dispatch(setPostWelcomePageScreen(null,
            {
                meetingId : data.conferenceId,
                meetingName : data.conferenceName,
                meetingFrom : data.scheduledFrom,
                meetingTo : data.scheduledTo,
                isWaitingEnabled: data.isWaitingEnabled
            })
        );
    }

    const refreshJidAndReinitializeApp = () => {
        const { locationURL } = APP.store.getState()['features/base/connection'];
        APP.store.dispatch(setLocationURL(locationURL))
        openConnection({
            retry: true,
            roomName: meetingId
        })
        .then(connection => {
            APP.conference.init({
                roomName: APP.conference.roomName
            })
        })
        .catch(err => {
            console.log("Unable to open new connection", err)
        });
    }

    const setMeetNowAndUpdatePage = (value) => {
        setMeetNow(value)
        isMeetNow(value)
    }

    const goToHome = () => {
        setExiting(true);
        window.location.href = window.location.origin;
    };

    const refreshTokenAndFetchConference = async (reinitializeApp = false) => {
        reinitializeApp && refreshJidAndReinitializeApp();
        // Do not navigate to session expiry page if the session has expired.
        // If session has expired, continue the guest/login flow in joining flow of the meeting.
        let res = await getConference(true, joinMeeting)
        if(!res) {
            await unauthGetConference()
        }
    }

    // const addTokenToURL = async () => {
    //     await getConference(true)
    //     // if(!getQueryVariable('jwt')) {
    //     //     window.location.href = window.location.href + "?jwt=" + APP.store.getState()['features/app-auth'].meetingAccessToken
    //     // }
    // }

    const startPoll = async (decider, statusRetriever) => {
        let joined = decider(await statusRetriever())

        if(!joined) {
            let intervalTimer = setInterval(async () => {
                decider(await statusRetriever(), intervalTimer)
            }, 5000)
        }
    }

    const updateWaitingStatus = (participant) => {
        if (participant) {
            if(participant.status === "APPROVED") {
                setMeetingConnected(true)
                _joinConference()
                return true;
            }
            else if(participant.status === "REJECTED") {
                setParticipantRejected(true);
                return true;
            }
            else if(participant.status === "UNRESOLVED"){
                setMeetingEnded(true);
                return true;
            }
        }
    }

    const checkWaitingStatus = async () => {
        setMeetingWaiting(true);
        
        // Once the above state meetingWaiting is set the socket is connected for this user
    }

    const checkMeetingStatus = async () => {
        const decideToJoin = (response, intervalTimer) => {
            if (response && response.conferenceStatus === "STARTED") {
                intervalTimer && clearInterval(intervalTimer);
                if(enableWaitingRoom) {
                    setTimeout(() => checkWaitingStatus(), 5000);
                    return false;
                }
                setMeetingConnected(true)
                _joinConference()
                return true;
            }
        }

        startPoll(decideToJoin, meetingStatusCheck)
        
    }

    const handleJoinNow = async () => {

        //Verify conference secret(when join form is displayed)
        if ((!_isUserSignedOut && showJoinMeetingForm) ||
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

    /**
     *
     */
    const _joinConference = () => {
        // Make the join now audit call
        participantJoin().then().catch(err => {
            console.error('Unable to audit the participant join event', err);
        })

        // Close any open socket connections
        closeSocketConnection();

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

    const closeSocketConnection = () => {
        if(clientRef && clientRef.client.connected) {
            clientRef.disconnect()
        }
    }

    return ( (fetchUnauthErrors || fetchErrors) ?  
        <div className={`hostPrejoin`}> <div className="invalid-meeting-code">{'Invalid meeting code'} </div></div> :
        <div className={`hostPrejoin`}>
            {
                exiting && <Loading />
            }
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
                                /*style={{
                                    visibility: (conferenceStatus === '' || conferenceStatus === "STARTED")
                                         ? 'hidden': 'visible'
                                }}*/
                            >
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
                meetingConnected !== null && meetingConnected == false ?
                <div className="waiting-display"> 
                    {
                        ( !participantRejected && !meetingEnded ) ?
                        <>
                            <h2> 
                            {
                                enableWaitingRoom  &&
                                <SockJsClient url={props._socketLink} topics={[props._participantsSocketTopic + '/' + _jid.split("/")[0] ]}
                                onMessage={(participant) => {
                                    updateWaitingStatus(participant)
                                }}
                                ref={ (client) => { clientRef = client }} />
                            }
                                    
                            {
                                meetingWaiting ? 
                                'Please wait, the meeting host will let you in soon.' 
                                :
                                'Please wait for the host to join the meeting...'
                            }
                            </h2>
                            <Icon src = { IconLogo } size={120}/>
                        </>
                        :
                        <>
                            <h2> 
                            {
                                meetingEnded ?
                                "The meeting has ended"
                                :
                                "The host apparently hasn't approved your request to join in. Please contact the meeting host."
                            }
                            </h2>

                            <div
                                className={`prejoin-page-button next`}
                                onClick={ goToHome }>
                                Exit
                            </div>
                        </>
                    }
                </div>
                :
                <>
                    {
                        (_isUserSignedOut && !continueAsGuest) &&
                        <>
                            <div className="no-account">
                                <div
                                    className={`prejoin-page-button guest ${disableJoin ? 'disabled' : ''}`} 
                                    onClick={() => !disableJoin && setContinueAsGuest(true)}>
                                    Continue without login
                                </div>
                            </div>
                            <div className="option-text-or">Or</div>
                            <LoginComponent
                                noSignInIcon={true}
                                closeAction={ () => {
                                    //Fetch the conference details for the logged in user
                                    setDisableJoin(true);
                                    refreshTokenAndFetchConference(true);

                                }}
                            />
                        </>
                    }

                    {
                        ((!_isUserSignedOut && showJoinMeetingForm) || 
                            (!_isUserSignedOut && !isMeetingHost) ||
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
                            ${(disableJoin || joinNowDisabled) ? 'disabled' : ''} `}
                            onClick={async () => (!disableJoin && !joinNowDisabled) && handleJoinNow()}>
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
        _isGoogleSigninUser: state['features/app-auth'].googleOfflineCode ? true : false,
        _user: state['features/app-auth'].user,
        _isUserSignedOut: !state['features/app-auth'].user || state['features/app-auth'].isUserSignedOut,
        _jid: state['features/base/connection'].connection?.xmpp?.connection?._stropheConn?.jid,
        _socketLink: getConferenceSocketBaseLink(),
        _participantsSocketTopic: getWaitingParticipantsSocketTopic(state)
    };
}

const mapDispatchToProps = {
    joinConference: joinConferenceAction,
    updateSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(translate(GuestPrejoin));
