
import moment from 'moment';
import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { IconContext } from 'react-icons';
import { FaCalendarAlt } from 'react-icons/fa';
import { BsPencil } from 'react-icons/bs';
import { GiCombinationLock } from 'react-icons/gi';
import { AiFillCheckCircle } from 'react-icons/ai';

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

    const meetingUrl = !meetNow && `${window.location.origin}/${meetingId}`;

    return (
        <div className='meetingInfo'>
            {
                (!isPureJoinFlow && !meetNow && shareable) ? (
                    <>
                        <div
                            className='shareable-meeting-title'
                            style={!meetingName ? { color: '#969696' } : {}}>{'Your meeting has been successfully created'}
                        </div>
                        <div>
                            <div className="meeting-detail-info  detail-heading-margin">
                                <div className="detail-heading">
                                    Topic
                            </div>
                                <div className="detail-heading-value">
                                    {meetingName}
                                </div>
                            </div>
                            <div className="meeting-detail-info detail-heading-margin">
                                <div className="detail-heading">
                                    Meeting ID
                            </div>
                                <div className="detail-heading-value">
                                    {meetingId}
                                </div>
                            </div>
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
                            <div
                                className='meeting-title'
                                title={meetingName ? meetingName : meetingId}
                                style={!meetingName ? { color: '#969696' } : {}}>
                                {(shareable || isFromGuest) ? <>{meetingName ? meetingName : 'Enter Meeting Name'}</> : (
                                    <>
                                        {isMeetingNameEdit ? (
                                            <input
                                                className="input-meeting"
                                                type="text"
                                                autoFocus
                                                onBlur={handleMeetingNameBlur}
                                                onChange={(event) => { setMeetingName(event.target.value) }}
                                                value={meetingName ? meetingName : ''}
                                            />
                                        ) : (
                                                <>{meetingName ? meetingName : 'Enter Meeting Name'}</>
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
                        <div className='you-are-host'> You are the host of this meeting</div>
                        {meetNow && shareable && isPrivate && (<div className="password-wrapper">
                            <IconContext.Provider value={{ style: { color: 'green' } }}>

                                <GiCombinationLock size={15} />
                            </IconContext.Provider>
                            <div className="password-meeting">Password: {meetingPassword}</div>
                        </div>
                        )}
                        {meetNow && shareable && enableWaitingRoom && (<div className="password-wrapper">
                            <IconContext.Provider value={{ style: { color: 'green' } }}>
                                <AiFillCheckCircle size={15} />
                            </IconContext.Provider>
                            <div className="password-meeting">Waiting Room</div>
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
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
                            onChange={value => {
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
                            onChange={value => setMeetingTo(value)}
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
                            {'Make this a private meeting'}
                        </label>
                        <label className="switch" style={{ marginLeft: '40px' }}>
                            <input type="checkbox"
                                checked={isPrivate}
                                onChange={() => {
                                    setIsPrivate(!isPrivate);
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
                && <div className='form-field meeting-password'>
                    <InputField
                        onChange={value => setMeetingPassword(value.trim())}
                        placeHolder={'Meeting password'}
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
