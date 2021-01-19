
import moment from 'moment';
import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { IconContext } from 'react-icons';
import { FaCalendarAlt, FaLock, FaUnlock } from 'react-icons/fa';
import { BsPencil } from 'react-icons/bs';
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
import { HiCheckCircle } from 'react-icons/hi';
import { IoIosCloseCircle } from 'react-icons/io';
import sanitizeHtml from 'sanitize-html';
import { validationFromNonComponents } from '../../../features/app-auth';
import { bootstrapCalendarIntegration, ERRORS } from '../../calendar-sync';

import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { InputField } from '../../base/premeeting';
import logger from '../../settings/logger';
import { AudioSettingsButton, VideoSettingsButton } from '../../toolbox/components';
import Preview from '../../../features/base/premeeting/components/web/Preview';

import ShareMeeting from './ShareMeeting';

import {
    Icon,
    IconCalendar
} from '../../base/icons';


function MeetingInfo(props) {
    const [isMeetingNameEdit, setIsMeetingNameEdit] = useState(false);
    const [isMeetingDetailsOpen, setIsMeetingDetailsOpen] = useState(false);
    const [selectedMeetingDetails, setSelectedMeetingDetails] = useState(null);
    const meetNow = props.meetNow;
    const isBackPressed = props.isBackPressed || false;
    const isFromConference = props.isFromConference || false;
    const shareable = props.shareable;
    const isFromGuest = props.isFromGuest || false;
    const isMeetingHost = props.isMeetingHost || false;
    const { meetingId, setMeetingId } = props.meetingId;
    const { meetingName, setMeetingName } = props.meetingName;
    const { meetingPassword, setMeetingPassword, validation } = props.meetingPassword;
    const { isPrivate, setIsPrivate } = props.isPrivate || false;
    const { enableWaitingRoom, setEnableWaitingRoom } = props.enableWaitingRoom || false;
    const { meetingFrom, setMeetingFrom } = props.meetingFrom;
    const { meetingTo, setMeetingTo } = props.meetingTo;
    const isPureJoinFlow = props.isPureJoinFlow;

    const isMeetingBeingCreated = meetNow || shareable;

    function onClickEdit() {
        setIsMeetingNameEdit(true);
    }

    const defaultOptions = {
        // allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'br' ],
        allowedAttributes: {
            'a': ['href', 'name', 'target'] //,
            // 'div': [ 'style' ]
        }
    };

    function onClickDetailsArrow() {
        setIsMeetingDetailsOpen(!isMeetingDetailsOpen);
    }

    function sanitize(dirty, options) {
        return ({
            __html: sanitizeHtml(
                dirty,
                {
                    ...defaultOptions,
                    ...options
                }
            )
        })
    }
    function handleMeetingNameBlur() {
        setIsMeetingNameEdit(false);
    }

    function generatePassword() {
        return Math.random().toString(36).slice(2, 7);
    }

    useEffect(() => {
        async function calenderData() {
            if (isFromGuest && props._isGoogleSigninUser) {
                const refreshTokenResponse = await validationFromNonComponents(true, true);

                refreshTokenResponse
                    && APP.store.dispatch(bootstrapCalendarIntegration())
                        .catch(err => {
                            logger.error('Meeting Info Google oauth bootstrapping failed', err)
                        });

            }
        }
        calenderData();
    }, []);

    useEffect(() => {
        if (meetingId) {
            const _calenderEvent = props.calendarEvents.length ? [...props.calendarEvents] : [];
            for (let index = 0; index < _calenderEvent.length; index++) {
                if (_calenderEvent[index].url && _calenderEvent[index].url.includes(meetingId)) {
                    setSelectedMeetingDetails({ ..._calenderEvent[index] });
                    break;
                }
            }

        }
    }, [props.calendarEvents]);

    useEffect(() => {
        if (!meetNow) {
            let _current = moment();
            let _min = _current.minutes();
            let updated = (Math.floor(_min / 15) + 1) * 15;
            let _from = _current.add(updated - _min, 'minutes');
            let _to = moment(_current).add(60, 'minutes');
            setMeetingFrom(_from);
            setMeetingTo(_to);
        }
    }, [meetNow]);

    const meetingUrl = !meetNow && `${window.location.origin}/${meetingId}`;
    return (
        <div className='meetingInfo'>
            {
                (!isPureJoinFlow && !meetNow && shareable) ? (
                    <>
                        <div
                            className='shareable-meeting-title'
                            style={!meetingName ? { color: '#969696' } : {}}>
                            {isBackPressed && !isFromConference ? 'Your meeting has been successfully updated' : ''}
                            {!isBackPressed && !isFromConference ? 'Your meeting has been successfully created' : ''}
                            <div className="meeting-name-schedule">
                                {meetingName}
                            </div>
                            <div className="meeting-id-schedule">
                                {meetingId}
                            </div>
                        </div>
                        <div>
                            {meetingFrom && (
                                <div className="meeting-detail-info detail-heading-margin">
                                    <div className="detail-heading">
                                        From
                            </div>
                                    <div className="detail-heading-value">
                                        {
                                            moment(meetingFrom).locale('en').format('DD MMM, hh:mm a')
                                        }
                                    </div>
                                </div>
                            )}
                            {meetingTo && (
                                <div className="meeting-detail-info">
                                    <div className="detail-heading">
                                        To
                            </div>
                                    <div className="detail-heading-value">
                                        {
                                            moment(meetingTo).locale('en').format('DD MMM, hh:mm a')
                                        }
                                    </div>
                                </div>
                            )}
                            {enableWaitingRoom && (
                                <div className="meeting-detail-info detail-heading-margin">
                                    <div className="detail-heading">
                                        Waiting Room
                            </div>
                                    <div className="detail-heading-value">
                                        {enableWaitingRoom ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>
                            )}
                            {isPrivate && (
                                <div className="meeting-detail-info detail-heading-margin">
                                    <div className="detail-heading">
                                        Password
                            </div>
                                    <div className="detail-heading-value">
                                        {meetingPassword}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                        <>
                            {shareable ? <div className="meeting-created-updated-info">{isBackPressed ? 'Your meeting has been successfully updated' : 'Your meeting has been successfully created'}</div> : <></>}
                            <div
                                className={`meeting-title ${!shareable ? 'meeting-padding' : ''}`}
                                title={meetingName ? meetingName : meetingId}
                                style={!meetingName ? { color: '#969696' } : {}}>
                                {(shareable || isFromGuest) ? <div className="input-meeting-wrapper">{meetingName ? meetingName : 'Enter Meeting Name'}</div> : (
                                    <>
                                        {isMeetingNameEdit ? (
                                            <input
                                                className="input-meeting"
                                                type="text"
                                                maxLength={'50'}
                                                autoFocus
                                                onBlur={handleMeetingNameBlur}
                                                onFocus={() => { setIsMeetingNameEdit(true); }}
                                                onChange={(event) => { setMeetingName(event.target.value) }}
                                                value={meetingName ? meetingName : ''}
                                            />
                                        ) : (
                                                <div className="input-meeting-wrapper" onClick={onClickEdit}>{meetingName ? meetingName : 'Enter Meeting Name'}</div>
                                            )}
                                        {!isMeetingNameEdit && (
                                            <IconContext.Provider value={{ style: { color: 'black' } }}>
                                                <span className="edit-icon-wrap" onClick={onClickEdit}>
                                                    <BsPencil size={20} />
                                                </span>
                                            </IconContext.Provider>
                                        )}
                                    </>
                                )}

                            </div>
                            <div className='meeting-id'>{meetingId}
                                {selectedMeetingDetails && selectedMeetingDetails.description ? (<div className="meeting-details" style={{ marginLeft: '10px' }}>Details
                                    <IconContext.Provider value={{ style: { color: '#00C062' } }}>
                                        <span className="meeting-details-arrow" onClick={onClickDetailsArrow}>
                                            {isMeetingDetailsOpen ? <RiArrowUpSLine size={25} /> : <RiArrowDownSLine size={25} />}
                                        </span>
                                    </IconContext.Provider>
                                </div>
                                ) : <></>
                                }
                                {isMeetingDetailsOpen ? (
                                    <div className="meeting-details-container">
                                        <div
                                            className={`description__modal 
                                                ${selectedMeetingDetails.description ? '' : 'no-content'}`} >
                                            <div dangerouslySetInnerHTML={
                                                sanitize(selectedMeetingDetails.description ? selectedMeetingDetails.description : 'No content')} />
                                        </div>
                                        <div className='coming-from-google-content'>
                                            <div> {'Meeting Details from '} </div>
                                            <img src='./../images/google_calendar.png' />
                                        </div>
                                    </div>
                                ) : <></>
                                }
                            </div>
                        </>
                    )
            }

            {
                (meetNow || (isPureJoinFlow && isPureJoinFlow.isMeetingHost))
                && (
                    <div className='you-are-host-wrapper'>
                        <div className='you-are-host'> <span className="you-text">You</span> are the host of this meeting</div>
                        {meetNow && shareable && (<div className="password-wrapper">
                            <IconContext.Provider value={{ style: { color: isPrivate ? '#00C062' : '#D1D1D1' } }}>

                                {isPrivate ? <FaLock size={15} /> : <FaUnlock size={15} />}
                            </IconContext.Provider>
                            <div className={`password-meeting ${!isPrivate ? 'fade-color' : ''}`}>{isPrivate ? `Password: ${meetingPassword}` : 'No Password'}</div>
                        </div>
                        )}
                        {meetNow && shareable && (<div className="password-wrapper">
                            <IconContext.Provider value={{ style: { color: enableWaitingRoom ? '#00C062' : '#D1D1D1' } }}>
                                {enableWaitingRoom ? <HiCheckCircle size={15} /> : <IoIosCloseCircle size={15} />}
                            </IconContext.Provider>
                            <div className={`password-meeting ${!enableWaitingRoom ? 'fade-color' : ''}`}>Waiting Room</div>
                        </div>
                        )}
                    </div>)
            }
            {/* {
                (isPureJoinFlow || shareable) && meetingFrom &&
                <div className={'date-info'}>
                    {
                        moment(meetingFrom).locale('en').format('DD MMM, hh:mm a')
                    }
                    {
                        meetingTo && (
                            ` - ${moment(meetingTo).isSame(meetingFrom, 'day') ?
                                moment(meetingTo).locale('en').format('hh:mm a') :
                                moment(meetingTo).locale('en').format('DD MMM, hh:mm a')}`)
                    }
                </div>
            } */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {
                    !meetNow && !isPureJoinFlow && !shareable
                    && <div className='date-field-container' style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
                        <div
                            className='form-label mandatory'
                            style={{
                                textAlign: 'left',
                                marginTop: '10px',
                                marginBottom: '10px',
                                marginRight: '10px',
                                position: 'relative'
                            }}>
                            <div style={{ display: 'inline-block' }}>{'From '}</div>
                            <span>*</span>
                            <IconContext.Provider value={{ style: { color: 'blue' } }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '1px',
                                    left: '60px',
                                    zIndex: 1
                                }}>
                                    <FaCalendarAlt size={20} />
                                </div>
                            </IconContext.Provider>
                        </div>
                        <DatePicker
                            onChangeRaw={(e) => e.preventDefault()}
                            className='picker-field'
                            popperClassName={'date-time-popper'}
                            placeholderText='Select start date/time'
                            minDate={new Date()}
                            minTime={new Date()}
                            maxTime={new Date().setHours(24)}
                            selected={meetingFrom && new Date(meetingFrom)}
                            timeIntervals={15}
                            onChange={value => {
                                if (moment(value).isSameOrBefore(new Date())) {
                                    return false;
                                }
                                setMeetingFrom(value);
                                const nd = new Date(value.getTime());

                                nd.setHours(nd.getHours() + 1);
                                setMeetingTo(nd);
                            }}
                            showTimeSelect={true}
                            timeFormat='HH:mm'
                            dateFormat='MMM d, h:mm aa' />
                    </div>
                }
                {
                    !meetNow && !isPureJoinFlow && !shareable
                    && <div className='date-field-container' style={{ display: 'flex' }}>
                        <div
                            className='form-label mandatory'
                            style={{
                                textAlign: 'left',
                                marginTop: '10px',
                                marginBottom: '10px',
                                marginRight: '10px',
                                position: 'relative'
                            }}>
                            {'To'}
                            <IconContext.Provider value={{ style: { color: 'blue' } }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '-2px',
                                    left: '33px',
                                    zIndex: 1
                                }}>
                                    <FaCalendarAlt size={20} />
                                </div>
                            </IconContext.Provider>
                        </div>
                        <DatePicker
                            onChangeRaw={(e) => e.preventDefault()}
                            className='picker-field'
                            popperClassName={'date-time-popper'}
                            placeholderText='Select end date/time'
                            minDate={meetingFrom}

                            // minTime = { (() => {
                            //     const from = moment(meetingFrom);
                            //     const d = new Date(meetingFrom);

                            //     d.setHours(d.getHours());
                            //     const isSameDay = moment(meetingFrom).isSame(moment(), 'day');

                            //     if (isSameDay) {
                            //         return d;
                            //     }

                            //     return moment()
                            //     .startOf('day')
                            //     .toDate();
                            // })() }
                            // maxTime = { (() => {
                            //     const d = new Date();

                            //     d.setHours(24);

                            //     return d;
                            // })() }
                            selected={meetingTo && new Date(meetingTo)}
                            timeIntervals={15}
                            onChange={value => {
                                if (moment(value).isSameOrBefore(meetingFrom)) {
                                    return false;
                                }
                                else {
                                    setMeetingTo(value)
                                }
                            }}
                            showTimeSelect={true}
                            timeFormat='HH:mm'
                            dateFormat='MMM d, h:mm aa' />
                    </div>
                }
            </div>

            {
                !isPureJoinFlow && (!shareable) &&
                <div className='form-field make-private enable-meeting-wrap' style={{ display: 'flex' }}>
                    {/* <Switch
                            onChange={() => {
                                setEnableWaitingRoom(!enableWaitingRoom);
                            }}
                            checked={enableWaitingRoom}
                            // id='enableWaitingRoom'
                            disabled={shareable} /> */}
                    <label
                        className='form-label enable-room'
                        htmlFor='enableWaitingRoom'>
                        {'Enable waiting room'}
                    </label>
                    <label className="switch" style={{ marginLeft: '83px' }}>
                        <input type="checkbox"
                            checked={enableWaitingRoom}
                            onChange={() => {
                                setEnableWaitingRoom(!enableWaitingRoom);
                            }}
                            disabled={shareable} />
                        <span className="slider round"></span>
                    </label>
                </div>
            }

            {
                !isPureJoinFlow && (!shareable)
                && <div className='form-field make-private' style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* <InputField
                        type='checkbox'
                        onChange={() => {
                            setIsPrivate(!isPrivate);
                            isPrivate && setMeetingPassword('');
                        }}
                        value={isPrivate}
                        id='makePrivate'
                        disabled={shareable} /> */}
                    <div className="make-private-room">
                        <label
                            className='form-label'
                            htmlFor='makePrivate'>
                            {'Enable Password'}
                        </label>
                        <label className="switch" style={{ marginLeft: '40px' }}>
                            <input type="checkbox"
                                checked={isPrivate}
                                onChange={() => {
                                    setIsPrivate(!isPrivate);
                                    setMeetingPassword(generatePassword());
                                    isPrivate && setMeetingPassword('');
                                }}
                                disabled={shareable} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    {/* <div className='form-label sub-label'>{'(Participants require password to enter this meeting)'}</div> */}
                </div>
            }

            {
                !isPureJoinFlow && (!shareable) && isPrivate
                && <div className={`form-field meeting-password ${isPrivate && !(meetingPassword && meetingPassword.length >= 5) ? 'error-password' : ''}`}>
                    <InputField
                        onChange={value => setMeetingPassword(value.trim())}
                        placeHolder={'Meeting password'}
                        maxLength={'15'}
                        value={meetingPassword}
                        disablePaste={isMeetingBeingCreated}
                        disabled={shareable || !isPrivate}
                        onKeyPress={(e) => {
                            if (validation ?.action) {
                                validation.action(e);
                            }
                        }} />

                    {
                        validation ?.message
                            && <div className='input-message'>{validation.message}</div>
              }
                </div>
            }
            {
                ((shareable && meetNow) || (isFromGuest && isMeetingHost)) && (
                    <Preview
                        videoMuted={props.videoMuted}
                        videoTrack={props.videoTrack} >
                        <div className='media-btn-container'>
                            <AudioSettingsButton visible={true} />
                            <VideoSettingsButton visible={true} />
                        </div>
                        {props.previewFooter}
                    </Preview>
                )
            }

            {
                shareable
                && <>
                    {!meetNow && (<div className='divider' />)}
                    <ShareMeeting
                        meetingId={meetingId}
                        isFromConference={isFromConference}
                        meetingUrl={meetingUrl}
                        meetingName={meetingName}
                        meetingFrom={meetingFrom}
                        meetingTo={meetingTo}
                        meetingPassword={meetingPassword} />
                </>
            }
        </div >
    );
}


function _mapStateToProps(state: Object) {
    const calendarEvents = state['features/calendar-sync'].events;
    // const calendarEvents = [{
    //     allDay: undefined,
    //     attendees: undefined,
    //     calendarId: "primary",
    //     description: "Neehal Shaikh is inviting you to a meeting.↵↵Topic: Jifmeet standup↵↵Join the meeting:↵https://meet.jifmeet.com/42-1610449875315-756?join=true↵↵Meeting ID: 42-1610449875315-756↵Password: xyz789",
    //     endDate: 1610517600000,
    //     id: "6aflr7nc81g7co650cvmtcejlp_20210113T053000Z",
    //     organizer: {
    //         email: "neehal@saal.ai",
    //         self: true
    //     },
    //     startDate: 1610515800000,
    //     title: "Jifmeet standup (on meet.jifmeet.com)",
    //     url: "https://localhost:8080/42-1610449875315-756?join=true"
    // }, {
    //     allDay: undefined,
    //     attendees: undefined,
    //     calendarId: "primary",
    //     description: undefined,
    //     endDate: 1610539200000,
    //     id: "0ivrsc2cj503fq5kqe4b98h9rb_20210113T113000Z",
    //     organizer: {
    //         email: "neehal@saal.ai",
    //         self: true
    //     },
    //     startDate: 1610537400000,
    //     title: "HealthShield Reporting",
    //     url: null
    // }, {
    //     allDay: undefined,
    //     attendees: undefined,
    //     calendarId: "primary",
    //     description: "Neehal Shaikh is inviting you to a meeting.↵↵Topic: Jifmeet standup↵↵Join the meeting:↵https://meet.jifmeet.com/42-1610449875315-756?join=true↵↵Meeting ID: 42-1610449875315-756↵Password: xyz789",
    //     endDate: 1610604000000,
    //     id: "6aflr7nc81g7co650cvmtcejlp_20210114T053000Z",
    //     organizer: {
    //         email: "neehal@saal.ai",
    //         self: true
    //     },
    //     startDate: 1610602200000,
    //     title: "Jifmeet standup (on meet.jifmeet.com)",
    //     url: "https://localhost:8080/48-1611044650993-393?join=true"
    // }];
    return {
        calendarEvents,
        _isUserSignedOut: !state['features/app-auth'].user || state['features/app-auth'].isUserSignedOut,
        _isGoogleSigninUser: Boolean(state['features/app-auth'].googleOfflineCode)
    };
}

export default translate(connect(_mapStateToProps)(MeetingInfo));