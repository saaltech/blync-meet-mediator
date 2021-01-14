/* @flow */

import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { BiTime } from 'react-icons/bi';
import { BsPersonLinesFill } from 'react-icons/bs';
import { FaSyncAlt } from 'react-icons/fa';
import { GiSandsOfTime } from 'react-icons/gi';
import { HiOutlineRefresh } from 'react-icons/hi';
import sanitizeHtml from 'sanitize-html';

import ModalComponent from '../../../always-on-top/ModalComponent';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import { refreshCalendar } from '../../../calendar-sync/actions';
import { IFrame } from './Iframe'

type Props = {
    t: Object,
    calendarEvents: Object,
    calendarEventsGroup: Object,
    height: any
}
/**
 *
 */
function CalendarProfile(props: Props) {
    const [showModal, setShowModal] = useState(false);

    // selected calendar event
    const [selectedEvents, setSelectedEvents] = useState([]);

    const { t, calendarEvents, calendarEventsGroup } = props;

    const wrapperRef = React.createRef();

    const _closeModal = () => {
        setSelectedEvent(null);
        setShowModal(false);
    };

    /**
     * Collapse if clicked on outside of element.
     */
    const handleClickOutside = event => {
        if (wrapperRef && wrapperRef.current
            && !wrapperRef.current.contains(event.target)) {
            _closeModal();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
    });

    const defaultOptions = {
        // allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'br' ],
        allowedAttributes: {
            'a': ['href', 'name', 'target'] //,
            // 'div': [ 'style' ]
        }
    };

    const sanitize = (dirty, options) => ({
        __html: sanitizeHtml(
            dirty,
            {
                ...defaultOptions,
                ...options
            }
        )
    });

    const defaultOptionsOneLiner = {
        allowedTags: ['b', 'i', 'em', 'strong']
    };

    const sanitizeOneLiner = (dirty, options) => ({
        __html: sanitizeHtml(
            dirty,
            {
                ...defaultOptionsOneLiner,
                ...options
            }
        )
    });

    const _eventSelected = eventId => {
        const _selectedEvents = [...selectedEvents];
        const _selectedIndex = _selectedEvents.indexOf(eventId);
        if (_selectedIndex > -1) {
            const __selectedEvents = [
                ..._selectedEvents.splice(0, _selectedIndex),
                ..._selectedEvents.splice(_selectedIndex + 1)
            ];
            setSelectedEvents(__selectedEvents);

        } else {
            _selectedEvents.push(eventId);
            setSelectedEvents(_selectedEvents);
        }
        /* if (calEvent.description) {
            calEvent.description
                = `<div class='jifmeet'
                    style='font-family: open_sanslight,"Helvetica Neue",Helvetica,Arial,sans-serif!important; 
                        font-size: 15px;'>${calEvent.description}</div>`;
        } */
    };
    return (
        <div
            className={'calendarProfile'} >
            <div className='upcoming-meetings'>
                <div>{'Calendar'}</div>
                <div
                    className='jitsi-icon'
                    onClick={() => APP.store.dispatch(refreshCalendar())} >
                    <HiOutlineRefresh />
                    <div className='last-synced'> {`Last synced: ${moment().locale('en')
                        .format('DD MMM, hh:mm a')}`} </div>
                </div>
            </div>
            <div
                className='calendar-list' >
                {
                    Object.keys(calendarEventsGroup).map(key => (<div key={key} >
                        <div className='group-title'>
                            {
                                key === 'today' ? 'Today' : 'Tomorrow'
                            }
                        </div>

                        {
                            calendarEventsGroup[key].length === 0
                            && <div
                                className={'calendar__event calendar__event__disabled last no-meetings'}
                                key={-1} >
                                <div>{`No meetings for ${key === 'today' ? key : 'tomorrow'}`}</div>
                            </div>
                        }
                        {
                            calendarEventsGroup[key].map((event, index) =>
                                (<div
                                    className={`calendar__event ${event.description ? '' : 'calendar__event__disabled'} 
                                        ${index === calendarEventsGroup.today.length - 1 ? 'last' : ''}`}
                                    key={event.id} >
                                    <div
                                        className='calendar__event__title'
                                        title={event.title} >
                                        <div> {event.title} </div>
                                        {
                                            event.url
                                            && <div className="Join-wrapper"><a
                                                href={event.url}
                                                rel='noopener noreferrer' >
                                                {'Join'}
                                            </a></div>
                                        }
                                    </div>

                                    {
                                        event.startDate && event.endDate
                                        && <div className='calendar__event__time-container'>
                                            <div className='calendar__event__timing'>
                                                <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
                                                    <div>
                                                        <BiTime size={20} />
                                                    </div>
                                                </IconContext.Provider>
                                                <div>
                                                    {`${moment(event.startDate).locale('en')
                                                        .format(`${key === 'today' ? '' : 'DD MMM, '}hh:mm a`)}
                                                        ${event.endDate ? ` - ${moment(event.endDate).isSame(event.startDate, 'day') ?
                                                            moment(event.endDate).locale('en').format('hh:mm a') :
                                                            moment(event.endDate).locale('en').format('DD MMM, hh:mm a')}` : ''}`
                                                    }
                                                </div>

                                            </div>

                                            <div className='calendar__event__duration'>
                                                <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
                                                    <div>
                                                        <GiSandsOfTime size={20} />
                                                    </div>
                                                </IconContext.Provider>
                                                <div>
                                                    {`${moment.duration(moment(event.endDate).diff(moment(event.startDate))).asMinutes()} minutes`}
                                                </div>

                                            </div>
                                            <div
                                                className={'calendar__event__host-info'} >
                                                <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
                                                    <div>
                                                        <BsPersonLinesFill size={20} />
                                                    </div>
                                                </IconContext.Provider>
                                                <div>
                                                    {
                                                        event.organizer
                                                        && `Hosted By: ${event.organizer.displayName || event.organizer.email}
                                                    ${event.organizer.self ? '(You)' : ''}`
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    }


                                    {
                                        event.description
                                        && <>
                                            {selectedEvents.includes(event.id) && (<div
                                                className={`calendar__event__description__modal 
                                                ${event.description ? '' : 'no-content'}`} >
                                                <div dangerouslySetInnerHTML={
                                                    sanitize(event.description ? event.description : 'No content')} />
                                            </div>
                                            )}
                                            <div
                                                className='calendar__event__details'
                                                onClick={() => _eventSelected(event.id)} >
                                                 {selectedEvents.includes(event.id) ? 'View Less': 'View More'}
                                            </div>
                                        </>

                                    }
                                </div>))
                        }
                    </div>))
                }
            </div>


            <div className='coming-from-google'>
                <div> {'Integrated with '} </div>
                <img src='./../images/google_calendar.png' />
            </div>
        </div>
    );
}


/**
 */
function _mapStateToProps(state: Object) {
    const calendarEvents = state['features/calendar-sync'].events;
    const calendarEventsGroup = {
        'today': [],
        'others': []
    };
    const currentDay = moment().day();

    calendarEvents && calendarEvents.forEach(event => {
        if (moment(event.startDate).day() === currentDay) {
            calendarEventsGroup.today.push(event);
        } else {
            calendarEventsGroup.others.push(event);
        }
    });

    return {
        calendarEvents,
        calendarEventsGroup
    };
}

export default translate(connect(_mapStateToProps)(CalendarProfile));
