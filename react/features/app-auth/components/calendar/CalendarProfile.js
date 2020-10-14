/* @flow */

import moment from 'moment';
import React, { useState } from 'react';
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
    const [ joinEventId, setJoinEventId ] = useState(null);
    const [ showModal, setShowModal ] = useState(false);

    // selected calendar event
    const [ selectedEvent, setSelectedEvent ] = useState(null);

    const { t, calendarEvents, calendarEventsGroup } = props;

    const defaultOptions = {
        // allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'br' ],
        allowedAttributes: {
            'a': [ 'href', 'name', 'target' ]
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
        allowedTags: [ 'b', 'i', 'em', 'strong' ]
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

    const _eventSelected = calEvent => {
        setSelectedEvent(calEvent);
        setShowModal(true);
    };

    const _closeModal = () => {
        setSelectedEvent(null);
        setShowModal(false);
    };

    return (
        <div
            className = { 'calendarProfile' } >
            <div className = 'upcoming-meetings'>
                <div>{ `${calendarEvents ? '' : 'No '}Upcoming meetings`}</div>
                <div
                    className = 'jitsi-icon'
                    onClick = { () => APP.store.dispatch(refreshCalendar()) } >
                    <HiOutlineRefresh />
                </div>
            </div>
            {
                calendarEvents
                && <div
                    className = 'calendar-list'
                    style = {{ maxHeight: props.height - 200 }} >
                    {
                        Object.keys(calendarEventsGroup).map(key => (<div key = { key } >
                            {
                                calendarEventsGroup[key].length > 0
                                && <div className = 'group-title'>
                                    {
                                        key === 'today' ? 'Today' : 'Tomorrow'
                                    }
                                </div>
                            }
                            {
                                calendarEventsGroup[key].map((event, index) =>
                                    (<div
                                        className = { `calendar__event ${event.description ? '' : 'calendar__event__disabled'} 
                                        ${index === calendarEventsGroup.today.length - 1 ? 'last' : ''}` }
                                        key = { event.id }
                                        onMouseEnter = { () => setJoinEventId(event.id) } >
                                        <div
                                            className = 'calendar__event__title'
                                            title = { event.title } >
                                            <div> { event.title } </div>
                                            {
                                                event.url
                                                && <div><a
                                                    href = { event.url }
                                                    rel = 'noopener noreferrer'
                                                    target = '_blank' >
                                                    { 'Join' }
                                                </a></div>
                                            }
                                        </div>
                                        
                                        {
                                            event.startDate && event.endDate
                                        && <div className = 'calendar__event__time-container'>
                                            <div className = 'calendar__event__duration'>
                                                <IconContext.Provider value = {{ style: { verticalAlign: 'middle' } }}>
                                                    <div>
                                                        <GiSandsOfTime size = { 20 } />
                                                    </div>
                                                </IconContext.Provider>
                                                <div>
                                                    { `${moment.duration(moment(event.endDate).diff(moment(event.startDate))).asMinutes()} minutes`}
                                                </div>
                                                
                                            </div>
                                            <div className = 'calendar__event__timing'>
                                                <IconContext.Provider value = {{ style: { verticalAlign: 'middle' } }}>
                                                    <div>
                                                        <BiTime size = { 20 } />
                                                    </div>
                                                </IconContext.Provider>
                                                <div>
                                                    { `${moment(event.startDate).locale('en')
                                                        .format(`${key === 'today' ? '' : 'DD MMM, '}hh:mm a`)}
                                                        ${event.endDate ? ` - ${moment(event.endDate).locale('en')
                                                        .format('hh:mm a')}` : ''}`
                                                    }
                                                </div>
                                                
                                            </div>
                                        </div>
                                        }
                                        <div
                                            className = { 'calendar__event__host-info' } >
                                            <IconContext.Provider value = {{ style: { verticalAlign: 'middle' } }}>
                                                <div>
                                                    <BsPersonLinesFill size = { 20 } />
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

                                        {
                                            event.description
                                            && <div
                                                className = 'calendar__event__details'
                                                onClick = { () => _eventSelected(event) } >
                                                { 'Details' }
                                            </div>
                                        }
                                    </div>))
                            }
                        </div>))
                    }
                    {
                        showModal && selectedEvent && selectedEvent.description
                        && <ModalComponent
                            closeAction = { () => _closeModal() }>
                            <div className = 'content'>
                                <div
                                    className = 'calendar__event__title __modal'
                                    title = { selectedEvent.title } >
                                    { selectedEvent.title }
                                </div>
                                {
                                    selectedEvent.startDate
                                    && <div className = 'calendar__event__timing __modal'>
                                        { `${moment(selectedEvent.startDate).locale('en')
                                            .format('DD MMM, hh:mm a')}
                                            ${selectedEvent.endDate ? ` - ${moment(selectedEvent.endDate).locale('en')
                                            .format('hh:mm a')}` : ''}`
                                        }
                                    </div>
                                }
                                <div
                                    className = { `calendar__event__description__modal 
                                                    ${selectedEvent.description ? '' : 'no-content'}` }
                                    dangerouslySetInnerHTML = {
                                        sanitize(selectedEvent.description ? selectedEvent.description : 'No content') } />  

                                {
                                    selectedEvent.url
                                    && <a
                                        href = { selectedEvent.url }
                                        rel = 'noopener noreferrer'
                                        target = '_blank' >
                                        <div
                                            className = { `calendar__event__join __modal
                                            ${joinEventId === selectedEvent.id ? 'show' : 'hide'}` }>
                                            { 'Join' }
                                        </div>
                                    </a>
                                }
                            </div>
                        </ModalComponent>
                    }
                </div>
            }
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
