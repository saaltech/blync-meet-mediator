/* @flow */

import React, { useState, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { FaCalendarAlt } from 'react-icons/fa';

import { config } from '../../../config';
import Loading from '../../always-on-top/Loading';
import { Profile } from '../../app-auth';
import { setPostWelcomePageScreen } from '../../app-auth/actions';
import { getUserAgentDetails } from '../../base/environment/utils';
import { translate } from '../../base/i18n';
import {
    Icon,
    IconArrowBack
} from '../../base/icons';
import { InputField } from '../../base/premeeting';
import { connect } from '../../base/redux';
import useRequest from '../../hooks/use-request';
import { setPrejoinPageErrorMessageKey } from '../../prejoin';
import {
    joinConference as joinConferenceAction,
    joinConferenceWithoutAudio as joinConferenceWithoutAudioAction,
    setSkipPrejoin as setSkipPrejoinAction,
    setJoinByPhoneDialogVisiblity as setJoinByPhoneDialogVisiblityAction
} from '../actions';

import MeetingInfo from './MeetingInfo';


function HostPrejoin(props) {
    const [meetNow, setMeetNow] = useState(true);
    const [meetingId, setMeetingId] = useState((props.meetingId || ''));
    const [meetingName, setMeetingName] = useState('');
    const [isPrivate, setIsPrivate] = useState(true);
    const [meetingPassword, setMeetingPassword] = useState('');
    const [meetingFrom, setMeetingFrom] = useState('');
    const [meetingTo, setMeetingTo] = useState(null);
    const [enableWaitingRoom, setEnableWaitingRoom] = useState(true);
    const { isMeetNow, _isGoogleSigninUser, _user, _jid } = props;
    const [shareable, setShareable] = useState(false);
    const { joinConference, actions, syncStoreFromParentWindowStore } = props;
    const [exiting, setExiting] = useState(false);
    const [clearErrors, setClearErrors] = useState(true);
    const userAgent = getUserAgentDetails();

    const [getConference, fetchErrors] = useRequest({
        url: `${config.conferenceManager + config.conferenceEP}/${meetingId}`,
        method: 'get',
        onSuccess: data => updateConferenceState(data)
    });

    function generatePassword() {
        return Math.random().toString(36).slice(2, 7);
    }

    useEffect(() => {
        syncStoreFromParentWindowStore();
        setClearErrors(true);
        setMeetNow(actions === 'meetNow');
        const _name = props._user.name;
        const _names = _name.split(' ');
        setMeetingName(`${_names[0]}'s Meeting`);
        setMeetingPassword(generatePassword());
    }, []);
    const formRequestBody = () => {
        return {
            'conferenceId': meetingId,
            'conferenceName': meetingName,
            'conferenceSecret': meetingPassword,
            'scheduledFrom': meetNow ? '' : meetingFrom, // "2020-07-08T09:34:00.567Z",
            'scheduledTo': meetNow ? '' : meetingTo, // "2020-07-08T09:34:00.567Z"
            'isWaitingEnabled': enableWaitingRoom
        };
    };

    const [updateConference, updateErrors] = useRequest({
        url: config.conferenceManager + config.conferenceEP,
        method: 'put',
        body: formRequestBody,
        onSuccess: data => updateConferenceState(data)
    });

    const [saveConference, saveErrors] = useRequest({
        url: config.conferenceManager + config.conferenceEP,
        method: 'post',
        body: formRequestBody,
        onSuccess: data => {
            if (meetNow) {
                props.setIsVideoMuted(true);
            }
            updateConferenceState(data)
        }
    });

    const updateConferenceState = data => {
        /*
            {
                "conferenceId": "string",
                "conferenceName": "string",
                "conferenceStatus": "NOT_STARTED",
                "conferenceSecret": "string",
                "createdDateTime": "2020-07-08T09:43:59.668Z",
                "hostJids": [
                    "string"
                ],
                "id": "string",
                "lastModifiedDateTime": "2020-07-08T09:43:59.668Z",
                "ownerId": "string",
                "scheduledFrom": "2020-07-08T09:43:59.668Z",
                "scheduledTo": "2020-07-08T09:43:59.668Z"
            }
        */
        setMeetingId(data.conferenceId);
        setMeetingName(data.conferenceName);
        setMeetingPassword(data.conferenceSecret);
        setMeetingFrom(data.scheduledFrom);
        setMeetingTo(data.scheduledTo);
        setEnableWaitingRoom(data.isWaitingEnabled);
    };

    const setMeetNowAndUpdatePage = value => {
        setClearErrors(true);
        setMeetNow(value);
        isMeetNow(value);
    };

    const goToHome = () => {
        setExiting(true);

        // notify external apps
        APP.API.notifyReadyToClose();

        window.location.href = `${window.location.origin}?actions=create`;
    };

    const saveConferenceAction = async () => {
        //
        /*
        - Save/Update new conference (call the API)
        - Store this info in redux ['features/app-auth'].meetingDetails
        - call the prejoin page. if meetNow
      */

        if (scheduleDisabled || (isPrivate && !meetingPassword)) {
            return;
        }

        // Store just the meetingId and meetNow flag in redux. (Until backend is integrated store full object)
        if (meetNow) {
            setMeetingFrom('');
            setMeetingTo('');
        }

        if (!isPrivate) {
            setMeetingPassword('');
        }

        setClearErrors(false);

        // Make DB save call
        const res = await saveConference(true);

        if (!res) {
            return;
        }

        APP.store.dispatch(setPostWelcomePageScreen(null,
            {
                meetingId,
                meetingName,
                meetingPassword,
                meetingFrom: meetNow ? '' : meetingFrom,
                meetingTo: meetNow ? '' : meetingTo,
                meetNow,
                isWaitingEnabled: enableWaitingRoom
            }
        ));

        /* if (meetNow) {
        props.onJoin()
      }
      else {*/
        setShareableAction(true);

        // }


    };

    const setShareableAction = (_shareable, isFromBack = false) => {
        /* if(joinNow) {
        window.location.href = window.location.origin + "?back=true";
        return;
      }*/

        setShareable(_shareable);
        if (isFromBack) {
            props.setIsVideoMuted(false);
        }
        if (meetNow && _shareable) {
            props.showTrackPreviews(true);
        } else {
            props.showTrackPreviews(false);
        }
    };

    const formJoinEventParticipantRequestBody = () => {
        return {
            "client": userAgent.getBrowserName(),
            "clientVersion": userAgent.getBrowserVersion(),
            "conferenceId": meetingId,
            "displayName": _user ?.name,
            "jid": _jid,
            "loginType": _isGoogleSigninUser ? 'google' : 'default',
            "os": userAgent.getOSName(),
            "osVersion": userAgent.getOSVersion(),
            "userId": _user ?.id
        };
    };

    const [participantJoin, participantJoinError] = useRequest({
        url: config.conferenceManager + config.unauthParticipantsEP + '/joinevent',
        method: 'post',
        body: formJoinEventParticipantRequestBody
    });

    const scheduleDisabled = !meetNow && !meetingFrom;

    return (
        <div className="hostPrejoinWrap">
            {
                exiting && <Loading />
            }
            <div className="meet-now">
                {meetNow ? (<>
                    <div className="meet-now-image-wrapper">
                        <img className="meet-now-image" src="../../../../images/prejoin-meet-now.svg" alt='' />
                    </div>
                    {/* <IconContext.Provider value={{
                        style: {
                            color: 'blue'
                        }
                    }}>
                        <FaCalendarAlt size={40} />
                    </IconContext.Provider> */}
                    <span className="meet-now-label">Meet Now</span>
                    <div className='profileSection'>
                        <Profile
                            postLogout={goToHome}
                            showMenu={true} />
                    </div>
                </>) : (
                        <>
                            <div className="schedule-image-wrapper">
                                <img className="schedule-image" src="../../../../images/prejoin-meet-now.svg" alt='' />
                            </div>
                            <span className="meet-now-label">Schedule a meeting</span>
                            <div className='profileSection'>
                                <Profile
                                    postLogout={goToHome}
                                    showMenu={true} />
                            </div>
                        </>
                    )
                }
            </div>
            <div className="hostPrejoin-container">
                <div className="background-width left-background-image"></div>
                <div className={'hostPrejoin'}>
                    <div
                        onClick={props.onClickClose}
                        className="close-icon"></div>

                    {
                        shareable
                        && <Icon
                            className='backArrow'
                            src={IconArrowBack}
                            onClick={() => setShareableAction(!shareable, true)} />
                    }

                    {/* {
                shareable && meetNow
                && <div className='page-title'> Join Now </div>
            } */}


                    <div className='modesSection'>
                        {/* {
                    !shareable
                    && <div className="meetNow">
                        {actions === 'schedule' ? 'Schedule' : 'MeetNow'}
                    </div>
                //     <ul>
                //         <li
                //             className={`${meetNow ? 'selected' : ''}`}
                //             onClick={() => setMeetNowAndUpdatePage(true)}>
                //             Meet Now
                // </li>
                //         <li
                //             className={`${!meetNow ? 'selected' : ''}`}
                //             onClick={() => setMeetNowAndUpdatePage(false)}>
                //             Schedule
                // </li>
                //     </ul>
                } */}

                        <MeetingInfo
                            shareable={shareable}
                            meetNow={meetNow}
                            videoMuted={props.videoMuted}
                            videoTrack={props.videoTrack}
                            previewFooter={props.previewFooter}
                            meetingId={{
                                meetingId
                            }}
                            meetingName={{
                                meetingName,
                                setMeetingName
                            }}
                            enableWaitingRoom={{
                                enableWaitingRoom,
                                setEnableWaitingRoom
                            }}
                            isPrivate={{
                                isPrivate,
                                setIsPrivate
                            }}
                            meetingPassword={{
                                meetingPassword,
                                setMeetingPassword,
                                validation: {
                                    message: 'Only alphabets and numbers are allowed.',
                                    action: e => {
                                        const re = /[0-9a-zA-Z]+/g;
                                        if (!re.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }
                                }
                            }}
                            meetingFrom={{
                                meetingFrom,
                                setMeetingFrom
                            }}
                            meetingTo={{
                                meetingTo,
                                setMeetingTo
                            }} />

                        {
                            !shareable
                            && <div
                                className={`prejoin-page-button next 
                        ${scheduleDisabled ? 'disabled' : ''} 
                        ${isPrivate && !meetingPassword ? 'disabled' : ''} 
                        ${!meetingName ? 'disabled' : ''}
                        ` }
                                onClick={saveConferenceAction}>
                                {meetNow ? 'Next' : 'Schedule'}
                            </div>
                        }
                        {
                            shareable && meetNow
                            && <div
                                className='prejoin-page-button join'
                                onClick={() => {
                                    // Make the join now audit call
                                    participantJoin().then().catch(err => {
                                        console.error('Unable to audit the host participant join event', err);
                                    });
                                    APP.store.dispatch(setPrejoinPageErrorMessageKey('submitting'));
                                    joinConference();
                                }}>
                                Meet Now
                </div>
                        }
                        {/* <div style={{ marginTop: '10px', borderBottom: '1px solid gray' }} /> */}

                        {
                            shareable && !meetNow
                            && <div
                                className='prejoin-page-button close'
                                onClick={goToHome}>Close</div>
                        }

                        {
                            !(shareable && !meetNow)
                            && <div
                                className='cancel'
                                onClick={goToHome}>Cancel</div>
                        }

                        {
                            saveErrors && !clearErrors
                            && <div className={'error-block'}> {'Unable to process your new meeting request right now. Please try again after some time.'}</div>
                        }


                    </div>
                </div>
                <div className=" background-width right-background-image"></div>
            </div>
        </div>
    );
}

function mapStateToProps(state): Object {
    return {
        _isGoogleSigninUser: state['features/app-auth'].googleOfflineCode ? true : false,
        _user: state['features/app-auth'].user,
        _jid: state['features/base/connection'].connection ?.xmpp ?.connection ?._stropheConn ?.jid,
        meetingDetails: state['features/app-auth'].meetingDetails
    };
}

const mapDispatchToProps = {
    joinConference: joinConferenceAction
};

export default connect(mapStateToProps, mapDispatchToProps)(translate(HostPrejoin));
