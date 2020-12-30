/* @flow */

import React, { useState, useEffect } from 'react';
import SockJsClient from 'react-stomp';
import { IconContext } from 'react-icons';
import { FaCalendarAlt } from 'react-icons/fa';

import { setPrejoinPageErrorMessageKey } from '../';
import { openConnection } from '../../../../connection';
import { config } from '../../../config';
import Loading from '../../always-on-top/Loading';
import { LoginComponent, Profile } from '../../app-auth';
import { setPostWelcomePageScreen } from '../../app-auth/actions';
import { setLocationURL } from '../../base/connection/actions.web';
import { getUserAgentDetails } from '../../base/environment/utils';
import { translate } from '../../base/i18n';
import {
    Icon,
    IconLogo
} from '../../base/icons';
import { connect } from '../../base/redux';
import { updateSettings } from '../../base/settings';
import {
    getConferenceSocketBaseLink,
    getWaitingParticipantsSocketTopic
} from '../../conference/functions';
import useRequest from '../../hooks/use-request';
import { redirectOnInvalidMeeting } from '../../welcome/functions';
import {
    joinConference as joinConferenceAction,
    joinConferenceWithoutAudio as joinConferenceWithoutAudioAction,
    setSkipPrejoin as setSkipPrejoinAction,
    setJoinByPhoneDialogVisiblity as setJoinByPhoneDialogVisiblityAction
} from '../actions';
import {
    // setPrejoinVideoTrackMuted
} from '../functions';

import { AudioSettingsButton, VideoSettingsButton } from '../../toolbox/components';
import Preview from '../../../features/base/premeeting/components/web/Preview';


import JoinMeetingForm from './JoinMeetingForm';
import MeetingInfo from './MeetingInfo';


/**
 */
function GuestPrejoin(props) {
    let clientRef;
    const [exiting, setExiting] = useState(false);
    const [disableJoin, setDisableJoin] = useState(true);
    const [meetingId, setMeetingId] = useState(props.meetingId);
    const userAgent = getUserAgentDetails();
    const [meetingName, setMeetingName] = useState('');
    const [meetingPassword, setMeetingPassword] = useState('');
    const [meetingFrom, setMeetingFrom] = useState(null);
    const [meetingTo, setMeetingTo] = useState(null);
    const { joinConference, _isUserSignedOut = true,
        joinMeeting, _jid, _user, _isGoogleSigninUser } = props;
    const [isMeetingHost, setIsMeetingHost] = useState(false);
    const [continueAsGuest, setContinueAsGuest] = useState(false);
    const [showJoinMeetingForm, setShowJoinMeetingForm] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState('');
    const [isSecretEnabled, setIsSecretEnabled] = useState(false);
    const [conferenceStatus, setConferenceStatus] = useState('');
    const [enableWaitingRoom, setEnableWaitingRoom] = useState(false);
    const [participantRejected, setParticipantRejected] = useState(false);
    const [meetingEnded, setMeetingEnded] = useState(false);

    useEffect(() => {
        setTimeout(async () => {
            if (_isUserSignedOut) {
                await unauthGetConference();
            } else {
                refreshTokenAndFetchConference();
            }
        }, 3000);
    }, [meetingId]);

    const [guestName, setGuestName] = useState('');

    useEffect(() => {
        continueAsGuest && guestName.trim() !== ''
            && props.updateSettings({
                displayName: guestName,
                email: guestEmail // Done to reset the avatar that might have been set in the previous session
            });
    }, [guestName]);

    const [guestEmail, setGuestEmail] = useState('');

    useEffect(() => {
        continueAsGuest
            && props.updateSettings({
                email: guestEmail
            });
    }, [guestEmail]);

    const [unauthGetConference, fetchUnauthErrors] = useRequest({
        url: `${config.conferenceManager + config.unauthConferenceEP}/${meetingId}`,
        method: 'get',
        onSuccess: data => updateConferenceState(data)
    });

    const [getConference, fetchErrors] = useRequest({
        url: `${config.conferenceManager + config.conferenceEP}/${meetingId}`,
        method: 'get',
        onSuccess: data => updateConferenceState(data)
    });

    const formWaitingParticipantRequestBody = () => {
        return {
            'conferenceId': meetingId,
            'jid': _jid,
            'email': guestEmail,
            'username': guestName
        };
    };

    const [addWaitingParticipant, addWaitingParticipantError] = useRequest({
        url: config.conferenceManager + config.unauthParticipantsEP,
        method: 'post',
        body: formWaitingParticipantRequestBody
    });

    const formJoinEventParticipantRequestBody = () => {
        return {
            'client': userAgent.getBrowserName(),
            'clientVersion': userAgent.getBrowserVersion(),
            'conferenceId': meetingId,
            'displayName': guestName || _user ?.name,
            'jid': _jid,
            'loginType': _isUserSignedOut ? null : _isGoogleSigninUser ? 'google' : 'default',
            'os': userAgent.getOSName(),
            'osVersion': userAgent.getOSVersion(),
            'userId': _user ?.id
        };
    };

    const [participantJoin, participantJoinError] = useRequest({
        url: `${config.conferenceManager + config.unauthParticipantsEP}/joinevent`,
        method: 'post',
        body: formJoinEventParticipantRequestBody
    });

    const verifySecretPostProcess = async data => {
        if (data.status === 'SUCCESS') {
            window.sessionStorage.setItem('roomPassword', meetingPassword);

            // Insert guest details for waiting room functionality
            if (enableWaitingRoom) {
                await addWaitingParticipant(!_isUserSignedOut);
            }

            // Check if meeting has started, if not go to checkMeetingStatus(), else checkWaitingStatus()
            // and if waiting room was enabled, check if the current user is allowed to join
            if (conferenceStatus !== 'STARTED' || enableWaitingRoom) {
                setMeetingConnected(false); // useEffect would trigger post actions
            } else {
                _joinConference();
            }
        } else {
            setShowPasswordError('Incorrect room password');
        }
    };

    const formVerifySecretBody = () => {
        return {
            conferenceId: meetingId,
            conferenceSecret: meetingPassword
        };
    };

    const [verifySecret, verifySecretErrors] = useRequest({
        url: config.conferenceManager + config.verifySecretEP,
        method: 'post',
        body: formVerifySecretBody,
        onSuccess: data => verifySecretPostProcess(data)
    });

    const [meetingConnected, setMeetingConnected] = useState(null);

    useEffect(() => {
        if (meetingConnected === false) {
            if (conferenceStatus !== 'STARTED') {
                checkMeetingStatus();
            } else if (enableWaitingRoom) {
                checkWaitingStatus();
            }
        }
    }, [meetingConnected]);

    const [meetingWaiting, setMeetingWaiting] = useState(false);

    const [meetingStatusCheck, meetingStatusErrors] = useRequest({
        url: `${config.conferenceManager + config.unauthConferenceEP}/${meetingId}`,
        method: 'get',
        onSuccess: data => { }
    });

    const [waitingStatusCheck, waitingStatusCheckErrors] = useRequest({
        url: `${config.conferenceManager}${config.unauthParticipantsEP}?conferenceId=${meetingId}&jid=${_jid}`,
        method: 'get'
    });

    const updateConferenceState = data => {
        setMeetingId(data.conferenceId);
        setMeetingName(data.conferenceName);
        setMeetingFrom(data.scheduledFrom);
        setMeetingTo(data.scheduledTo);
        setEnableWaitingRoom(data.isWaitingEnabled);

        setIsMeetingHost(data.isHost);
        if (data.isHost && data.conferenceStatus === 'STARTED') {
            window.sessionStorage.setItem('roomPassword', data.conferenceSecret);
            setMeetingPassword(data.conferenceSecret);
        }

        setShowJoinMeetingForm(!_isUserSignedOut && !data.isHost);

        setIsSecretEnabled(data.isSecretEnabled);
        setConferenceStatus(data.conferenceStatus);

        setDisableJoin(false);
        APP.store.dispatch(setPostWelcomePageScreen(null,
            {
                meetingId: data.conferenceId,
                meetingName: data.conferenceName,
                meetingFrom: data.scheduledFrom,
                meetingTo: data.scheduledTo,
                isWaitingEnabled: data.isWaitingEnabled
            })
        );
    };

    const refreshJidAndReinitializeApp = () => {
        const { locationURL } = APP.store.getState()['features/base/connection'];

        APP.store.dispatch(setLocationURL(locationURL));
        openConnection({
            retry: true,
            roomName: meetingId
        })
            .then(connection => {
                APP.conference.init({
                    roomName: APP.conference.roomName
                });
            })
            .catch(err => {
                console.log('Unable to open new connection', err);
            });
    };

    const setMeetNowAndUpdatePage = value => {
        setMeetNow(value);
        isMeetNow(value);
    };

    const goToHome = () => {
        setExiting(true);
        window.location.href = window.location.origin;
    };

    const refreshTokenAndFetchConference = async (reinitializeApp = false) => {
        reinitializeApp && refreshJidAndReinitializeApp();

        // Do not navigate to session expiry page if the session has expired.
        // If session has expired, continue the guest/login flow in joining flow of the meeting.
        const res = await getConference(true, joinMeeting);

        if (!res) {
            await unauthGetConference();
        }
    };

    const startPoll = async (decider, statusRetriever) => {
        const joined = decider(await statusRetriever());

        if (!joined) {
            const intervalTimer = setInterval(async () => {
                decider(await statusRetriever(), intervalTimer);
            }, 5000);
        }
    };

    const updateWaitingStatus = participant => {
        if (participant) {
            if (participant.status === 'APPROVED') {
                setMeetingConnected(true);
                _joinConference();

                return true;
            } else if (participant.status === 'REJECTED') {
                setParticipantRejected(true);

                return true;
            } else if (participant.status === 'UNRESOLVED') {
                setMeetingEnded(true);

                return true;
            }
        }
    };

    const checkWaitingStatus = async () => {
        setMeetingWaiting(true);

        // Once the above state meetingWaiting is set the socket is connected for this user
    };

    const checkMeetingStatus = async () => {
        const decideToJoin = (response, intervalTimer) => {
            if (response && response.conferenceStatus === 'STARTED') {
                intervalTimer && clearInterval(intervalTimer);
                if (enableWaitingRoom) {
                    setTimeout(() => checkWaitingStatus(), 5000);

                    return false;
                }
                setMeetingConnected(true);
                _joinConference();

                return true;
            }
        };

        startPoll(decideToJoin, meetingStatusCheck);
    };

    const handleJoinNow = async () => {

        // Verify conference secret(when join form is displayed)
        if ((!_isUserSignedOut && showJoinMeetingForm)
            || (!_isUserSignedOut && !isMeetingHost)
            || continueAsGuest) {
            await verifySecret();

            return;
        }

        if (isMeetingHost) {
            _joinConference();
        } else {
            setShowJoinMeetingForm(true);
        }

    };

    /**
     *
     */
    const _joinConference = () => {
        // Make the join now audit call
        participantJoin().then()
            .catch(err => {
                console.error('Unable to audit the participant join event', err);
            });

        // Close any open socket connections
        closeSocketConnection();

        APP.store.dispatch(setPrejoinPageErrorMessageKey('submitting'));
        joinConference();
    };

    const joinNowDisabled = continueAsGuest
        && (guestName.trim() === '' || (isSecretEnabled && meetingPassword.trim() === ''));

    useEffect(() => {
        if (!_isUserSignedOut || continueAsGuest) {
            props.showTrackPreviews(true);
        } else {
            props.showTrackPreviews(false);
        }
    });

    const closeSocketConnection = () => {
        if (clientRef && clientRef.client.connected) {
            clientRef.disconnect();
        }
    };

    if (fetchUnauthErrors || fetchErrors) {
        setTimeout(() => {
            // setPrejoinVideoTrackMuted(true);
        }, 500);
        redirectOnInvalidMeeting(meetingId);
    }

    return <div className="hostPrejoinWrap">
        <div className="meet-now">
            <IconContext.Provider value={{
                style: {
                    color: 'blue'
                }
            }}>
                <FaCalendarAlt size={40} />
            </IconContext.Provider>
            <span className="meet-now-label">Join a meeting</span>
            {
                !_isUserSignedOut
                    ? (<div className='profileSection'>
                        <Profile
                            postLogout={goToHome}
                            showMenu={true} />
                    </div>) : <></>
            }
        </div>
        {fetchUnauthErrors || fetchErrors
            ? <div className={'hostPrejoin'}> <div className='invalid-meeting-code'>{'Invalid Meeting ID'} </div></div>
            : <div className={'hostPrejoin'}>
                <div
                    onClick={props.onClickClose}
                    className="close-icon"></div>
                <div style={{ width: '70%', margin: '0 auto' }}>
                    {
                        exiting && <Loading />
                    }
                    {/* {
                        !_isUserSignedOut
                            ? <div className='profileSection'>
                                <Profile />
                            </div>
                            : <>
                                {
                                    !continueAsGuest
                                    && <div
                                        className='login-message'>
                                        <span>Please</span>
                                        <span className='sign-in-link'> sign in </span>
                                        <span>if you are the host.</span>
                                    </div>
                                }
                            </>
                    } */}

                    <MeetingInfo
                        isPureJoinFlow={{
                            isMeetingHost
                        }}
                        meetingFrom={{
                            meetingFrom,
                            setMeetingFrom
                        }}
                        meetingId={{
                            meetingId
                        }}
                        meetingName={{
                            meetingName,
                            setMeetingName
                        }}
                        meetingPassword={{
                            meetingPassword,
                            setMeetingPassword
                        }}
                        meetingTo={{
                            meetingTo,
                            setMeetingTo
                        }}
                        isFromGuest={true}
                        shareable={false} />

                    {
                        enableWaitingRoom && _jid
                        && <SockJsClient
                            onMessage={participant => {
                                updateWaitingStatus(participant);
                            }}
                            ref={client => {
                                clientRef = client;
                            }}
                            topics={[`${props._participantsSocketTopic}/${_jid.split('/')[0]}`]}
                            url={props._socketLink} />
                    }

                    {
                        meetingConnected !== null && meetingConnected === false
                            ? <div className='waiting-display'>
                                {
                                    !participantRejected && !meetingEnded
                                        ? <>
                                            <Preview
                                                videoMuted={props.videoMuted}
                                                videoTrack={props.videoTrack} >
                                                <div className='media-btn-container'>
                                                    <AudioSettingsButton visible={true} />
                                                    <VideoSettingsButton visible={true} />
                                                </div>
                                                {props.previewFooter}
                                            </Preview>
                                            <div className="waiting-content">
                                                <div className="request-content">
                                                {
                                                    meetingWaiting
                                                        ? 'Please wait, the meeting host will let you in soon.'
                                                        : 'Please wait for the host to join the meeting...'
                                                }
                                            </div>
                                                <Icon
                                                    size={40}
                                                    src={IconLogo} />
                                            </div>
                                        </>
                                        : <>
                                            <h2>
                                                {
                                                    meetingEnded
                                                        ? 'The meeting has ended'
                                                        : 'The host apparently hasn\'t approved your request to join in. Please contact the meeting host.'
                                                }
                                            </h2>

                                            <div
                                                className={'prejoin-page-button next'}
                                                onClick={goToHome}>
                                                Exit
                                    </div>
                                        </>
                                }
                            </div>
                            : <>
                                {
                                    (_isUserSignedOut && !continueAsGuest)
                                    && <>
                                        <LoginComponent
                                            closeAction={() => {
                                                // Fetch the conference details for the logged in user
                                                setDisableJoin(true);
                                                refreshTokenAndFetchConference(true);

                                            }}
                                            noSignInIcon={true} />
                                        <div className='no-account'>
                                            <div
                                                className={`prejoin-page-button guest ${disableJoin ? 'disabled' : ''}`}
                                                onClick={() => !disableJoin && setContinueAsGuest(true)}>
                                                Continue without login
                                </div>
                                        </div>

                                    </>
                                }

                                {
                                    ((!_isUserSignedOut && showJoinMeetingForm)
                                        || (!_isUserSignedOut && !isMeetingHost)
                                        || continueAsGuest)
                                    && (<>
                                        <Preview
                                            videoMuted={props.videoMuted}
                                            videoTrack={props.videoTrack} >
                                            <div className='media-btn-container'>
                                                <AudioSettingsButton visible={true} />
                                                <VideoSettingsButton visible={true} />
                                            </div>
                                            {props.previewFooter}
                                        </Preview>
                                        <JoinMeetingForm
                                            guestEmail={{
                                                guestEmail,
                                                setGuestEmail
                                            }}
                                            guestName={{
                                                guestName,
                                                setGuestName
                                            }}
                                            isSecretEnabled={isSecretEnabled}
                                            isUserSignedOut={_isUserSignedOut}
                                            meetingId={meetingId}
                                            meetingPassword={{
                                                meetingPassword,
                                                setMeetingPassword
                                            }}
                                            passwordError={showPasswordError} />
                                    </>)
                                }

                                {
                                    (!_isUserSignedOut || continueAsGuest)
                                    && <div
                                        className={`prejoin-page-button next 
                            ${disableJoin || joinNowDisabled ? 'disabled' : ''} `}
                                        onClick={async () => (!disableJoin && !joinNowDisabled) && handleJoinNow()}>
                                        Join Now
                        </div>
                                }
                            </>
                    }

                </div>
            </div>
        }
    </div>
        ;
}

/**
 */
function mapStateToProps(state): Object {
    return {
        _isGoogleSigninUser: Boolean(state['features/app-auth'].googleOfflineCode),
        _user: state['features/app-auth'].user,
        _isUserSignedOut: !state['features/app-auth'].user || state['features/app-auth'].isUserSignedOut,
        _jid: state['features/base/connection'].connection ?.xmpp ?.connection ?._stropheConn ?.jid,
        _socketLink: getConferenceSocketBaseLink(),
        _participantsSocketTopic: getWaitingParticipantsSocketTopic(state)
    };
}

const mapDispatchToProps = {
    joinConference: joinConferenceAction,
    updateSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(translate(GuestPrejoin));
