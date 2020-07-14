
import moment from 'moment';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import { translate } from '../../base/i18n';
import { InputField } from '../../base/premeeting';

import ShareMeeting from './ShareMeeting';


function MeetingInfo(props) {
    const meetNow = props.meetNow;
    const shareable = props.shareable;
    const { meetingId, setMeetingId } = props.meetingId;
    const { meetingName, setMeetingName } = props.meetingName;
    const { meetingPassword, setMeetingPassword } = props.meetingPassword;
    const { isPrivate, setIsPrivate } = props.isPrivate || false;
    const { meetingFrom, setMeetingFrom } = props.meetingFrom;
    const { meetingTo, setMeetingTo } = props.meetingTo;
    const isPureJoinFlow = props.isPureJoinFlow;


    const meetingUrl = !meetNow && `${window.location.origin}/${meetingId}`;

    return (
        <div className = 'meetingInfo'>
            <div
                className = 'meeting-title'
                style = { !meetingName ? { color: '#969696' } : {} }>{meetingName ? meetingName : meetingId}</div>
            <div className = 'meeting-id'>{meetingId}</div>
            {
                !meetNow && !isPureJoinFlow
            && <div className = 'you-are-host'>
                <div
                    className = 'form-label mandatory'
                    style = {{
                        textAlign: 'left',
                        marginBottom: '10px'
                    }}>
                    {'From Time '}
                    {
                        !shareable
                    && <span>*</span>
                    }
                </div>
                <DatePicker
                    className = 'picker-field'
                    popperClassName = { 'date-time-popper' }
                    placeholderText = 'Select start date/time'
                    disabled = { shareable }
                    minDate = { new Date() }
                    minTime = { new Date() }
                    maxTime = { new Date().setHours(24) }
                    selected = { meetingFrom && new Date(meetingFrom) }
                    onChange = { value => {
                        setMeetingFrom(value);
                        setMeetingTo(null);
                    } }
                    showTimeSelect = { true }
                    timeFormat = 'HH:mm'
                    dateFormat = 'MMMM d, yyyy h:mm aa' />
            </div>
            }
            {
                !meetNow && !isPureJoinFlow
            && <div className = 'you-are-host'>
                <div
                    className = 'form-label mandatory'
                    style = {{
                        textAlign: 'left',
                        marginBottom: '10px'
                    }}>
                    {'To Time'}
                    {
                        !shareable
                    && <span>*</span>
                    }
                </div>
                <DatePicker
                    className = 'picker-field'
                    popperClassName = { 'date-time-popper' }
                    placeholderText = 'Select end date/time'
                    disabled = { shareable }
                    minDate = { meetingFrom }

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
                    selected = { meetingTo && new Date(meetingTo) }
                    onChange = { value => setMeetingTo(value) }
                    showTimeSelect = { true }
                    timeFormat = 'HH:mm'
                    dateFormat = 'MMMM d, yyyy h:mm aa' />
            </div>
            }
            {
                (meetNow || (isPureJoinFlow && isPureJoinFlow.isMeetingHost))
            && <div className = 'you-are-host'> You are the host of this meeting</div>
            }
            {
                !isPureJoinFlow && (!shareable || (isPrivate && shareable))
          && <div className = 'form-field make-private'>
              <InputField
                  type = 'checkbox'
                  onChange = { () => {
                      setIsPrivate(!isPrivate);
                      isPrivate && setMeetingPassword('');
                  } }
                  value = { isPrivate }
                  id = 'makePrivate'
                  disabled = { shareable } />
              <label
                  className = 'form-label'
                  htmlFor = 'makePrivate'>
                  {'Make this a private meeting'}
              </label>
              <div className = 'form-label sub-label'>{'(Participants require password to enter this meeting)'}</div>
          </div>
            }

            {
                !isPureJoinFlow && (!shareable || (shareable && isPrivate))
          && <div className = 'form-field meeting-password'>
              <InputField
                  onChange = { value => setMeetingPassword(value.trim()) }
                  placeHolder = { 'Meeting password' }
                  value = { meetingPassword }
                  disabled = { shareable || !isPrivate } />
          </div>
            }

            {
                shareable
          && <>
              <div className = 'divider' />
              <ShareMeeting
                  meetingId = { meetingId }
                  meetingUrl = { meetingUrl }
                  meetingName = { meetingName }
                  meetingFrom = { meetingFrom }
                  meetingTo = { meetingTo }
                  meetingPassword = { meetingPassword } />
          </>
            }
        </div>
    );
}

export default translate(MeetingInfo);
