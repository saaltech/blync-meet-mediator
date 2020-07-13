// @flow
import truncate from 'lodash/truncate';
import moment from 'moment';
import React, { Component } from 'react';

import { Avatar as AvatarDisplay } from '../../../../../react/features/base/avatar';
import { Icon, IconSearch } from '../../../base/icons';
type Props = {
    participants: Array<Object>,
    onSelect: Function,
    messagesSinceLastRead: Array<Object>,
    messages: Array<Object>,
    localParticipant: Object,
}

type State = {
    search: string
}

/**
 * React Component for displaying users list
 */
export default class ChatUsers extends Component<Props, State> {

    state = {
        search: ''
    }

    /**
     * Gets the uniqe users who have messaged user.
     *
     * @inheritdoc
     * @returns {Array<Object>}
     */
    _getEngagedUsers(): Array<Object> {
        const { localParticipant, messages, participants } = this.props;
        const senders = messages.map(msg => {
            const usr = participants.find(p => p.id === msg.senderId);

            return usr;
        });
        const recipients = messages.map(msg => {
            const usr = participants.find(p => p.id === msg.recipientId);

            return usr;
        });

        return [
            ...senders,
            ...recipients
        ].filter(participant => {
            if (!participant) {
                return false;
            }

            return participant.id !== localParticipant.id;
        }).reduce((acc, participant: Object) => {
            const isInList = acc.find((p: Object) => p.id === participant.id);

            if (isInList) {
                return acc;
            }

            return [ ...acc, participant ];
        }, []);
    }

    /**
     * Gets last message from or to user.
     *
     * @inheritdoc
     * @returns {Object}
     */
    _getLastMessage(participant): Object {
        const { localParticipant, messages } = this.props;

        const message = messages
            .slice()
            .reverse()
            .find(msg => {
                const localSent = msg.senderId === localParticipant.id && msg.recipientId === participant.id;
                const localReceived = msg.recipientId === localParticipant.id && msg.senderId === participant.id;

                return localSent || localReceived;
            });

        return message;
    }

    /**
     * Gets time last message was sent.
     *
     * @inheritdoc
     * @returns {Object}
     */
    _getTimeSinceMessage(message): Object {
        const seconds = moment().diff(message.timestamp, 'seconds')
                        .toFixed();
        const minutes = moment().diff(message.timestamp, 'minutes')
                        .toFixed();
        const hours = moment().diff(message.timestamp, 'hours')
                        .toFixed();

        if (hours > 0) {
            return `${hours}h`;
        }

        if (minutes > 0) {
            return `${minutes}m`;
        }


        return `${seconds}s`;
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { localParticipant } = this.props;
        let _participants = this._getEngagedUsers();

        if (this.state.search) {
            _participants = (this.props.participants || []).filter(participant => participant.id !== localParticipant.id);
        }
        const participants = _participants.filter(user => {
            if (!this.state.search) {
                return user;
            }
            const search = String(this.state.search).toLowerCase();

            return String(user.name)
                .toLowerCase()
                .includes(search);
        });


        return (
            <div className = 'chat-users'>
                <label className = 'chat-users__search'>
                    <Icon src = { IconSearch } />
                    <input
                        onChange = { e => this.setState({ search: e.target.value }) }
                        placeholder = 'Search Participant'
                        type = 'text' />
                </label>
                <ul className = 'chat-users__list'>
                    {
                        (participants || []).map(participant => {
                            const lastMessage = this._getLastMessage(participant) || {};

                            return (<li
                                key = { participant.id }
                                onClick = { () => this.props.onSelect(participant) }>
                                <div>
                                    <AvatarDisplay
                                        className = 'chat-users__avatar userAvatar'
                                        participantId = { participant.id } />
                                </div>
                                <div className = 'chat-users__user-details'>
                                    <div className = 'chat-users__user-header'>
                                        <span className = 'chat-users__username'>{participant.name}</span>
                                        {!lastMessage.hasRead && <span className = 'chat-users__status--new-message' />}
                                    </div>
                                    {lastMessage.message && <div className = 'chat-users__user-details-body'>
                                        {truncate(lastMessage.message, { length: 70 })}
                                    </div>}
                                </div>
                                {lastMessage.message && <div className = 'chat-users__chat-time'>
                                    {this._getTimeSinceMessage(lastMessage)}
                                </div>}
                            </li>);
                        })
                    }
                </ul>
            </div>
        );
    }
}
