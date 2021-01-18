
import moment from 'moment';
import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { IconContext } from 'react-icons';
import { FaCalendarAlt, FaLock, FaUnlock } from 'react-icons/fa';
import { BsPencil } from 'react-icons/bs';
import { HiCheckCircle } from 'react-icons/hi';
import { IoIosCloseCircle } from 'react-icons/io';

import { translate } from '../../base/i18n';
import { InputField } from '../../base/premeeting';
import { AudioSettingsButton, VideoSettingsButton } from '../../toolbox/components';
import Preview from '../../../features/base/premeeting/components/web/Preview';

import ShareMeeting from './ShareMeeting';

import {
    Icon,
    IconCalendar
} from '../../base/icons';


function MeetingInfo(props) {
    const [isMeetingNameEdit, setIsMeetingNameEdit] = useState(false);
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

    function handleMeetingNameBlur() {
        setIsMeetingNameEdit(false);
    }

    function generatePassword() {
        return Math.random().toString(36).slice(2, 7);
    }
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
                            <div className='meeting-id'>{meetingId}</div>
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
            {((shareable && meetNow) || (isFromGuest && isMeetingHost)) && (
                <Preview
                    videoMuted={props.videoMuted}
                    videoTrack={props.videoTrack} >
                    <div className='media-btn-container'>
                        <AudioSettingsButton visible={true} />
                        <VideoSettingsButton visible={true} />
                    </div>
                    {props.previewFooter}
                </Preview>
            )}

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

export default translate(MeetingInfo);
