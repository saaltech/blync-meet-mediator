/* @flow */

import React, { useState } from 'react';


import { config } from '../../../config';
import { Profile } from '../../app-auth';
import { setPostWelcomePageScreen } from '../../app-auth/actions';
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
    const [ meetNow, setMeetNow ] = useState(true);
    const [ meetingId, setMeetingId ] = useState(props.meetingDetails.meetingId);
    const [ meetingName, setMeetingName ] = useState(props.meetingDetails.meetingName);
    const [ isPrivate, setIsPrivate ] = useState(false);
    const [ meetingPassword, setMeetingPassword ] = useState('');
    const [ meetingFrom, setMeetingFrom ] = useState('');
    const [ meetingTo, setMeetingTo ] = useState(null);
    const { isMeetNow } = props;
    const [ shareable, setShareable ] = useState(false);
    const { joinConference } = props;

    const [ getConference, fetchErrors ] = useRequest({
        url: `${config.conferenceManager + config.conferenceEP}/${meetingId}`,
        method: 'get',
        onSuccess: data => updateConferenceState(data)
    });

    const formRequestBody = () => {
        return {
            'conferenceId': meetingId,
            'conferenceName': meetingName,
            'conferenceSecret': meetingPassword,
            'scheduledFrom': meetingFrom, // "2020-07-08T09:34:00.567Z",
            'scheduledTo': meetingTo // "2020-07-08T09:34:00.567Z"
        };
    };

    const [ updateConference, updateErrors ] = useRequest({
        url: config.conferenceManager + config.conferenceEP,
        method: 'put',
        body: formRequestBody,
        onSuccess: data => updateConferenceState(data)
    });

    const [ saveConference, saveErrors ] = useRequest({
        url: config.conferenceManager + config.conferenceEP,
        method: 'post',
        body: formRequestBody,
        onSuccess: data => updateConferenceState(data)
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
    };

    const setMeetNowAndUpdatePage = value => {
        setMeetNow(value);
        isMeetNow(value);
    };

    const goToHome = () => {
        window.location.href = window.location.origin;
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

        // Make DB save call
        await saveConference(true);

        APP.store.dispatch(setPostWelcomePageScreen(null,
        {
            meetingId,
            meetingName,
            meetingPassword,
            meetingFrom,
            meetingTo,
            meetNow
        }
        ));

        /* if (meetNow) {
        props.onJoin()
      }
      else {*/
        setShareableAction(true);

        // }


    };

    const setShareableAction = _shareable => {
        /* if(joinNow) {
        window.location.href = window.location.origin + "?back=true";
        return;
      }*/

        setShareable(_shareable);

        if (meetNow && _shareable) {
            props.showTrackPreviews(true);
        } else {
            props.showTrackPreviews(false);
        }
    };

    const scheduleDisabled = !meetNow && !meetingFrom;

    return (
        <div className = { 'hostPrejoin' }>

            {
                shareable
            && <Icon
                className = 'backArrow'
                src = { IconArrowBack }
                onClick = { () => setShareableAction(!shareable) } />
            }

            {
                shareable && meetNow
            && <div className = 'page-title'> Join Now </div>
            }

            <div className = 'profileSection'>
                <Profile />
            </div>

            <div className = 'modesSection'>
                {
                    !shareable
            && <ul>
                <li
                    className = { `${meetNow ? 'selected' : ''}` }
                    onClick = { () => setMeetNowAndUpdatePage(true) }>
                    Meet Now
                </li>
                <li
                    className = { `${!meetNow ? 'selected' : ''}` }
                    onClick = { () => setMeetNowAndUpdatePage(false) }>
                    Schedule
                </li>
            </ul>
                }


                <MeetingInfo
                    shareable = { shareable }
                    meetNow = { meetNow }
                    meetingId = {{
                        meetingId
                    }}
                    meetingName = {{
                        meetingName,
                        setMeetingName
                    }}
                    isPrivate = {{
                        isPrivate,
                        setIsPrivate
                    }}
                    meetingPassword = {{
                        meetingPassword,
                        setMeetingPassword
                    }}
                    meetingFrom = {{
                        meetingFrom,
                        setMeetingFrom
                    }}
                    meetingTo = {{
                        meetingTo,
                        setMeetingTo
                    }} />

                {
                    !shareable
                && <div
                    className = { `prejoin-page-button next 
                        ${scheduleDisabled ? 'disabled' : ''} 
                        ${isPrivate && !meetingPassword ? 'disabled' : ''} 
                        ` }
                    onClick = { saveConferenceAction }>
                    Next
                </div>
                }
                {
                    shareable && meetNow
                && <div
                    className = 'prejoin-page-button next'
                    onClick = { () => {
                        APP.store.dispatch(setPrejoinPageErrorMessageKey('submitting'));
                        joinConference();
                    } }>
                    Join Now
                </div>
                }

                {
                    shareable && !meetNow
                && <div
                    className = 'prejoin-page-button next'
                    onClick = { goToHome }>Close</div>
                }

                {
                    !(shareable && !meetNow)
                && <div
                    className = 'cancel'
                    onClick = { goToHome }>Cancel</div>
                }


            </div>
        </div>
    );
}

function mapStateToProps(state): Object {
    return {
        meetingDetails: APP.store.getState()['features/app-auth'].meetingDetails
    };
}

const mapDispatchToProps = {
    joinConference: joinConferenceAction
};

export default connect(mapStateToProps, mapDispatchToProps)(translate(HostPrejoin));
