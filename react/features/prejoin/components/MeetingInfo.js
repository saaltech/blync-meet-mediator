
import moment from 'moment';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { IconContext } from 'react-icons';
import { FaCalendarAlt } from 'react-icons/fa';

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
    const meetNow = props.meetNow;
    const shareable = props.shareable;
    const { meetingId, setMeetingId } = props.meetingId;
    const { meetingName, setMeetingName } = props.meetingName;
    const { meetingPassword, setMeetingPassword, validation } = props.meetingPassword;
    const { isPrivate, setIsPrivate } = props.isPrivate || false;
    const { enableWaitingRoom, setEnableWaitingRoom } = props.enableWaitingRoom || false;
    const { meetingFrom, setMeetingFrom } = props.meetingFrom;
    const { meetingTo, setMeetingTo } = props.meetingTo;
    const isPureJoinFlow = props.isPureJoinFlow;

    const isMeetingBeingCreated = meetNow || shareable;


    const meetingUrl = !meetNow && `${window.location.origin}/${meetingId}`;

    return (
        <div className='meetingInfo'>
            <div
                className='meeting-title'
                title={meetingName ? meetingName : meetingId}
                style={!meetingName ? { color: '#969696' } : {}}>{meetingName ? meetingName : meetingId}</div>
            <div className='meeting-id'>{meetingId}</div>
            {
                (meetNow || (isPureJoinFlow && isPureJoinFlow.isMeetingHost))
                && <div className='you-are-host'> You are the host of this meeting</div>
            }
            {
                (isPureJoinFlow || shareable) && meetingFrom &&
                <div className={'date-info'}>
                    {
                        moment(meetingFrom).locale('en').format('DD MMM, hh:mm a')
                    }
                    {
                        meetingTo && (` - ${moment(meetingTo).locale('en').format('hh:mm a')}`)
                    }
                </div>
            }
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {
                    !meetNow && !isPureJoinFlow && !shareable
                    && <div className='date-field-container' style={{ marginRight: '20px' }}>
                        <div
                            className='form-label mandatory'
                            style={{
                                textAlign: 'left',
                                marginBottom: '10px',
                                position: 'relative'
                            }}>
                            {'From Time '}
                            <span>*</span>
                            <IconContext.Provider value={{ style: { color: 'blue' } }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '38px',
                                    left: '-5px',
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
                            dateFormat='MMM d, yyyy h:mm aa' />
                    </div>
                }
                {
                    !meetNow && !isPureJoinFlow && !shareable
                    && <div className='date-field-container'>
                        <div
                            className='form-label mandatory'
                            style={{
                                textAlign: 'left',
                                marginBottom: '10px',
                                position: 'relative'
                            }}>
                            {'To Time'}
                            <IconContext.Provider value={{ style: { color: 'blue' } }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '38px',
                                    left: '-5px',
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
                            dateFormat='MMM d, yyyy h:mm aa' />
                    </div>
                }
            </div>

            {
                !isPureJoinFlow && (!shareable || enableWaitingRoom) &&
                <div className='form-field make-private' style={{ display: 'flex' }}>
                    {/* <Switch
                            onChange={() => {
                                setEnableWaitingRoom(!enableWaitingRoom);
                            }}
                            checked={enableWaitingRoom}
                            // id='enableWaitingRoom'
                            disabled={shareable} /> */}
                    <label
                        className='form-label'
                        htmlFor='enableWaitingRoom'>
                        {'Enable waiting room'}
                    </label>
                    <label className="switch" style={{ marginLeft: '83px' }}>
                        <input type="checkbox"
                            value={enableWaitingRoom}
                            onChange={() => {
                                setEnableWaitingRoom(!enableWaitingRoom);
                            }}
                            disabled={shareable} />
                        <span className="slider round"></span>
                    </label>
                </div>
            }

            {
                !isPureJoinFlow && (!shareable || (isPrivate && shareable))
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
                    <div style={{ display: 'flex' }}>
                        <label
                            className='form-label'
                            htmlFor='makePrivate'>
                            {'Make this a private meeting'}
                        </label>
                        <label className="switch" style={{ marginLeft: '40px' }}>
                            <input type="checkbox"
                                value={isPrivate}
                                onChange={() => {
                                    setIsPrivate(!isPrivate);
                                    isPrivate && setMeetingPassword('');
                                }}
                                disabled={shareable} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className='form-label sub-label'>{'(Participants require password to enter this meeting)'}</div>
                </div>
            }

            {
                !isPureJoinFlow && (!shareable || (shareable && isPrivate))
                && <div className='form-field meeting-password' style={{ margin: '0px' }}>
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
            {shareable && meetNow && (
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
                    <div className='divider' />
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
