/* @flow */

import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { RiVideoChatFill } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import { FaRegCalendarAlt, FaRegAddressCard, FaLock, FaShareAlt } from 'react-icons/fa';
import { Menu, Dropdown } from 'antd';
import { GoKebabVertical } from 'react-icons/go';

import { BiTime } from 'react-icons/bi';
import { BsPersonLinesFill } from 'react-icons/bs';
import { FaSyncAlt } from 'react-icons/fa';
import { GiSandsOfTime } from 'react-icons/gi';
import { HiCheckCircle } from 'react-icons/hi';
import sanitizeHtml from 'sanitize-html';
import ShareMeeting from '../../../prejoin/components/ShareMeeting';

import ModalComponent from '../../../always-on-top/ModalComponent';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import { refreshCalendar } from '../../../calendar-sync/actions';
import { IFrame } from './Iframe'

type Props = {
    t: Object,
    calendarEvents: Object,
    height: any
}
/**
 *
 */
function ManageMeetings(props: Props) {
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [menuExpanded, setMenuExpanded] = useState(false);

    // selected calendar event
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([{ 'topic': 'anuj', id: '12', url: 'yes' }, { 'topic': 'anuj', id: '13', url: 'yes' }, { 'topic': 'anuj', id: '14', url: 'yes' }]);

    const { t } = props;

    const wrapperRef = React.createRef();

    /**
     * Collapse if clicked on outside of element.
     */
    const handleClickOutside = event => {
        if (wrapperRef && wrapperRef.current
            && !wrapperRef.current.contains(event.target)) {
            setMenuExpanded(false);
        }
    };

    /**
     * Collapse if clicked on outside of element.
     */

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
    });


    const menu = (
        <Menu>
            <Menu.Item key="0">
                <div style={{ display: 'flex' }}>
                    <div style={{
                        marginRight: '30px',
                        marginTop: '5px'
                    }}>
                        <IconContext.Provider value={{
                            style: {
                                color: '#005C85'
                            }
                        }}>
                            <FaShareAlt size={20} />

                        </IconContext.Provider>

                    </div>
                    <div>
                        <div>Share meeting Details
                    </div>
                        <div>
                            <ShareMeeting isShowLabel={false} />
                        </div>
                    </div>
                </div>
            </Menu.Item>
            <Menu.Item key="1">
                <a href="http://www.taobao.com/">2nd menu item</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3">3rd menu item</Menu.Item>
        </Menu>
    );

    return (
        <div
            className={'manageMeeting'} >
            <div className='upcoming-meetings'>
                <div>{'Manage Meetings'}</div>
            </div>

            {
                <div
                    className='meeting-list' >
                    {
                        calendarEvents.length === 0
                        && <div
                            className={'calendar__event calendar__event__disabled last no-meetings'}
                            key={-1} >
                            <div>{`No meetings`}</div>
                        </div>
                    }
                    {
                        calendarEvents.map((event, index) =>
                            (<div className="meeting-wrapper">
                                <div className="meeting-topic-wrapper">
                                    <div className="topic-name">
                                        {`Topic : ${event.topic}`}
                                    </div>
                                    <div className="menu-details" onClick={() => { setMenuExpanded(true); setSelectedId(event.id) }}>
                                        <Dropdown arrow={true} placement={'bottomCenter'} overlay={menu} trigger={['click']}>
                                            <a><IconContext.Provider value={{
                                                style: {
                                                    color: '#005C85'
                                                }
                                            }}>
                                                <GoKebabVertical size={20} />
                                            </IconContext.Provider>
                                            </a>
                                        </Dropdown>
                                        <div className='menuIcon'>
                                            {
                                                menuExpanded && selectedId === event.id
                                                // && <Dropdown overlay={menu} trigger={['click']}>

                                                // </Dropdown>
                                                // && <ul
                                                //     className='profileMenu'
                                                //     ref={wrapperRef}>
                                                //     <li>
                                                //         <div><IconContext.Provider value={{
                                                //             style: {
                                                //                 color: '#005C85'
                                                //             }
                                                //         }}>
                                                //             <FaShareAlt size={15} />

                                                //         </IconContext.Provider>
                                                //         </div>
                                                //         <div>
                                                //             <div>Share meeting Details
                                                //             </div>
                                                //             <div>
                                                //                 sharing icons
                                                //             </div>
                                                //         </div>
                                                //         {/* <Icon src={IconLogout} /> */}
                                                //     </li>
                                                //     <li onClick={() => { }}>
                                                //         <div>icon</div>
                                                //         <div>
                                                //             edit
                                                //             </div>
                                                //         {/* <Icon src={IconLogout} /> */}
                                                //     </li>
                                                //     <li onClick={() => { }}>
                                                //         <div>icon</div>
                                                //         <div>
                                                //             delete
                                                //             </div>
                                                //         {/* <Icon src={IconLogout} /> */}
                                                //     </li>
                                                // </ul>
                                            }
                                        </div>

                                    </div>
                                </div>
                                <div className="meeting-details-wrapper">
                                    <div className="meeting-detail-first-row">
                                        <div className="meeting-url">
                                            <div className="meeting-url-icon">
                                                <IconContext.Provider value={{
                                                    style: {
                                                        color: '#00C062'
                                                    }
                                                }}>

                                                    <RiVideoChatFill size={20} />
                                                </IconContext.Provider>
                                            </div>
                                            <div className="meeting-url-link"> anuj idhd hhdn shhs </div>
                                        </div>
                                        <div className="meeting-date">
                                            <div className="meeting-calendar-icon">
                                                <IconContext.Provider value={{
                                                    style: {
                                                        color: '#00C062'
                                                    }
                                                }}>

                                                    <FaRegCalendarAlt size={20} />
                                                </IconContext.Provider>
                                            </div>
                                            <div className="meeting-calendar-date"> anuj idhd hhdn shhs </div>
                                        </div>
                                    </div>

                                    <div className="meeting-detail-second-row">
                                        <div className="meeting-id-details">
                                            <div className="meeting-id-icon">
                                                <IconContext.Provider value={{
                                                    style: {
                                                        color: '#00C062'
                                                    }
                                                }}>

                                                    <FaRegAddressCard size={20} />
                                                </IconContext.Provider>
                                            </div>
                                            <div className="meeting-id">{'ID: anuj idhd hhdn shhs '}</div>
                                        </div>
                                        <div className="meeting-password-details">
                                            <div className="meeting-password-icon">
                                                <IconContext.Provider value={{
                                                    style: {
                                                        color: '#00C062'
                                                    }
                                                }}>

                                                    <FaLock size={15} />
                                                </IconContext.Provider>
                                            </div>
                                            <div className="meeting-password"> anuj idhd hhdn shhs </div>
                                        </div>
                                        <div className="meeting-waiting-room-details">
                                            <div className="meeting-waiting-room-icon">
                                                <IconContext.Provider value={{
                                                    style: {
                                                        color: '#00C062'
                                                    }
                                                }}>

                                                    <HiCheckCircle size={20} />
                                                </IconContext.Provider>
                                            </div>
                                            <div className="meeting-waiting-room"> anuj idhd hhdn shhs </div>
                                        </div>
                                        <div className="meeting-start">
                                            <div className="meeting-start-container">Start</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                </div>
            }
        </div>
    );
}


export default translate(ManageMeetings);
