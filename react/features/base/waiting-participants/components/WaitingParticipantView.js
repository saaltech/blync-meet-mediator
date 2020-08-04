// @flow

import React, { Component } from 'react';

import { Avatar } from '../../../base/avatar';
import { translate } from '../../i18n';
import { Container, TintedView } from '../../react';
import { connect } from '../../redux';
import type { StyleType } from '../../styles';
import useRequest from '../../../hooks/use-request';
import { useState, useEffect } from 'react';
import { config } from '../../../../config';
import {
    Icon,
    IconMenuUp,
    IconMenuDown
} from '../../../base/icons';

/**
 * Implements a React Component which displays the waiting participants and option to admit/reject them.
 *
 * @extends Component
 */
function WaitingParticipantView(props) {

    const {
            _waitingList = [],
            _conferenceId
        } = props;

    // Holds the jid of the waiting participant on whom the action is to be taken.
    const [ jid, setJid ] = useState('')

    // Holds the host's decision to admit/reject the waiting participant.
    const [ status, setStatus ] = useState(false);

    //Holds the collapse state of the waiting list participants container
    const [ collapsed, setCollapsed ] = useState(false);


    const formWaitingParticipantRequestBody = () => {
        return {
            'conferenceId': _conferenceId,
            'jid': jid,
            'status': status
        };
    };

    const [ _updateWaitingParticipant ] = useRequest({
        url: `${config.conferenceManager + config.unauthParticipantsEP}`,
        method: 'put',
        body: formWaitingParticipantRequestBody
    });


    const updateWaitingParticipant = async (jid, admit) => {
        setJid(jid);
        setStatus(admit);
        console.log(jid, admit);
        await _updateWaitingParticipant();
    }

    // Toggle waiting participants collapse view
    const toggleContainer = () => {
        setCollapsed(!collapsed)
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */

    return (
        <>
            {
                _waitingList.length > 0 &&
                <div className = 'waiting-list'>
                    <div className = 'waiting-list__header'
                        onClick = { toggleContainer }>
                        <div>
                            { `Waiting to join (${_waitingList.length}) ...` } 
                        </div>
                        <div>
                            <Icon
                                size = { 24 }
                                color = { '#3a3a3a' }
                                src = { collapsed ? IconMenuDown : IconMenuUp } 
                            />
                        </div>
                    </div>
                    <div className = {`waiting-list__content ${collapsed ? 'collapsed' : ''}`}>
                        <div className="waiting-actions__all">
                            <button 
                                className='waiting-actions__all__btn'
                                onClick = {() => {
                                    updateWaitingParticipant('all', true)
                                }}
                            >
                                {'Admit All'}
                            </button>

                            <button 
                                className='waiting-actions__all__btn'
                                onClick = {() => {
                                    updateWaitingParticipant('all', false)
                                }}
                            >
                                {'Reject All'}
                            </button>
                        </div>
                        <ul className = {`participants-list__list`}>
                            {
                                _waitingList
                                .map(participant => {
                                    return (<li key = { participant.jid }>
                                        <div className = 'participants-list__label'>
                                            <Avatar size={ 32 } 
                                                displayName={ participant.username } 
                                                url={ participant.avatarUrl }/>
                                            <div 
                                                title = {participant.username}
                                                className = 'participants-list__participant-name'>
                                                {participant.username}
                                            </div>
                                        </div>
                                        <div className = 'participants-list__controls'>
                                            <button 
                                                className='waiting-actions reject'
                                                onClick = {() => {
                                                    updateWaitingParticipant(participant.jid, false)
                                                }}
                                            >
                                                {'Reject'}
                                            </button>

                                            <button 
                                                className='waiting-actions admit'
                                                onClick = {() => {
                                                    updateWaitingParticipant(participant.jid, true)
                                                }}
                                            >
                                                {'Admit'}
                                            </button>
                                        </div>
                                    </li>);
                                }
                                )
                            }
                        </ul>
                    </div>
                    
                </div>
            }
        </>
    );
}

function _mapStateToProps(state, ownProps) {
    return {
        _waitingList: state['features/base/waiting-participants'].participants,
        _conferenceId: state['features/app-auth'].meetingDetails?.meetingId
    };
}

export default translate(connect(_mapStateToProps)(WaitingParticipantView));
