/* @flow */

import moment from 'moment';
import React, { useState, useEffect } from 'react';

import { Avatar } from '../../base/avatar';
import { translate } from '../../base/i18n';
import {
    Icon,
    IconMenuDown,
    IconMenuUp,
    IconLogout
} from '../../base/icons';
import { connect } from '../../base/redux';
// import { refreshCalendar } from '../../calendar-sync/actions';
import { signOut } from '../../google-api';
import googleApi from '../../google-api/googleApi';
import useRequest from '../../hooks/use-request';
import { resolveAppLogout } from '../actions';

/**
 *
 */
function Profile(props) {
    const [ menuExpanded, setMenuExpanded ] = useState(false);
    const [ joinEventId, setJoinEventId ] = useState(null);

    const { showMenu = false, user = {}, t, disableMenu = true, postLogout,
        calendarEvents } = props;

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

    const logout = () => {
        if (googleApi.isSignedIn()) {
            APP.store.dispatch(signOut());
        }
        APP.store.dispatch(resolveAppLogout());
        postLogout && postLogout();
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
    });

    const _setMenuExpanded = () => {
        showMenu && setMenuExpanded(!menuExpanded)
    }


    return (
        <div
            className = { 'userProfile' } >
            <Avatar
                className = 'avatarProfile'
                displayName = { user.name }
                size = { '54' }
                url = { user.avatar } />
            <div
                className = { 'userName' }
                onClick = { () => _setMenuExpanded() }>{ user.name }</div>
            {
                showMenu
            && <div
                className = 'menuIcon' >
                {
                    !menuExpanded
                        ? <Icon src = { IconMenuDown } onClick = { () => _setMenuExpanded() } />
                        : <Icon src = { IconMenuUp } onClick = { () => _setMenuExpanded() } />
                }
                {
                    menuExpanded
                    && <ul
                        className = { `profileMenu ${calendarEvents && calendarEvents.length > 0 ? 'wide' : ''}` }
                        ref = { wrapperRef }>
                        <li>
                            <div
                                className = 'menu-action'
                                onClick = { logout } >
                                <Icon src = { IconLogout } />
                                <div className = 'menuLabel'>
                                    { t('profile.logout') }
                                </div>
                            </div>
                        </li>
                        {
                            calendarEvents
                            && <li className = 'calendar' >
                                <div className = 'upcoming-meetings'> <div>Upcoming meetings</div>
                                    {/*<Icon
                                        onClick = { () => APP.store.dispatch(refreshCalendar()) }
                                        size = { 20 }
                                        src = { IconWaiting } />*/}
                                </div>
                                {
                                    calendarEvents.map(event =>
                                        (<div
                                            className = { `calendar__event ${event.url ? '' : 'calendar__event__disabled'}` }
                                            onMouseEnter = { () => setJoinEventId(event.id) }
                                            key = { event.id } >
                                            <div className = 'calendar__event__title'>
                                                { event.title }
                                            </div>
                                            {
                                                event.startDate
                                                && <div className = 'calendar__event__timing'>
                                                    { `${moment(event.startDate).locale('en')
                                                        .format('DD MMM, hh:mm a')}
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
    return {
        user: state['features/app-auth'].user || {},
        calendarEvents: state['features/calendar-sync'].events
    };
}

export default translate(connect(_mapStateToProps)(Profile));
