/* @flow */

import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { FaSyncAlt, FaRegCalendarAlt } from 'react-icons/fa';

import { Avatar } from '../../base/avatar';
import { translate } from '../../base/i18n';
import {
    Icon,
    IconMenuDown,
    IconMenuUp,
    IconLogout
} from '../../base/icons';
import { connect } from '../../base/redux';
import { refreshCalendar } from '../../calendar-sync/actions';
import { signOut } from '../../google-api';
import googleApi from '../../google-api/googleApi';
import useRequest from '../../hooks/use-request';
import { resolveAppLogout } from '../actions';

/**
 *
 */
function CalendarProfile(props) {
    const [ menuExpanded, setMenuExpanded ] = useState(false);
    const [ joinEventId, setJoinEventId ] = useState(null);

    const { showMenu = false, t, calendarEvents, calendarEventsGroup } = props;

    const wrapperRef = React.createRef();

    /**
     * Alert if clicked on outside of element.
     */
    const handleClickOutside = event => {
        if (wrapperRef && wrapperRef.current
            && !wrapperRef.current.contains(event.target)) {
            showMenu && setMenuExpanded(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
    });

    const _setMenuExpanded = () => {
        showMenu && setMenuExpanded(!menuExpanded);
    };

    return (
        <div
            className = { 'calendarProfile' } >
            <div
                className = { 'calendar-icon' }
                onClick = { () => _setMenuExpanded() }><FaRegCalendarAlt /></div>
            {
                showMenu
            && <div
                className = 'menuIcon' >
                {
                    !menuExpanded
                        ? <Icon src = { IconMenuDown }
onClick = { () => _setMenuExpanded() } />
                        : <Icon src = { IconMenuUp }
onClick = { () => _setMenuExpanded() } />
                }
                {
                    menuExpanded
                    && <ul
                        className = { `profileMenu ${calendarEvents && calendarEvents.length > 0 ? '' : 'no-meetings'}` }
                        ref = { wrapperRef }>
                        {
                            <li className = 'calendar' >
                                <div className = 'upcoming-meetings'>
                                    <div>{ `${calendarEvents ? '' : 'No '}Upcoming meetings`}</div>
                                    <div
                                        className = 'jitsi-icon'
                                        onClick = { () => APP.store.dispatch(refreshCalendar()) } >
                                        <FaSyncAlt />
                                    </div>
                                </div>
                                {
                                    calendarEvents
                                    && <div className = 'calendar-list'>
                                        {
                                            Object.keys(calendarEventsGroup).map(key => <>
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
                                                            className = { `calendar__event ${event.url ? '' : 'calendar__event__disabled'} 
                                                            ${index === calendarEventsGroup.today.length - 1 ? 'last' : ''}` }
                                                            key = { event.id }
                                                            onMouseEnter = { () => setJoinEventId(event.id) } >
                                                            <div className = 'calendar__event__title'>
                                                                { event.title }
                                                            </div>
                                                            {
                                                                event.startDate
                                                            && <div className = 'calendar__event__timing'>
                                                                { `${moment(event.startDate).locale('en')
                                                                    .format(`${key === 'today' ? '' : 'DD MMM, '}hh:mm a`)}
                                                                    ${event.endDate ? ` - ${moment(event.endDate).locale('en')
                                                                    .format('hh:mm a')}` : ''}`
                                                                }
                                                            </div>
                                                            }
                                                            <div className = { `calendar__event__description ${event.description ? '' : 'no-content'}` } >
                                                                { event.description ? event.description : 'No content' }
                                                            </div>
                                                            {
                                                                event.url
                                                            && <div
                                                                className = { `calendar__event__join 
                                                                    ${joinEventId === event.id ? 'show' : 'hide'}` }>
                                                                <a
                                                                    href = { event.url }
                                                                    rel = 'noopener noreferrer'
                                                                    target = '_blank' >
                                                                    { 'Join' }
                                                                </a>
                                                            </div>
                                                            }
                                                        </div>))
                                                }
                                            </>)

                                        }
                                    </div>
                                }
                                
                            </li>
                        }
                    </ul>
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
