// @flow
import truncate from 'lodash/truncate';
import React, { Component } from 'react';

import { Avatar as AvatarDisplay } from '../../../../../react/features/base/avatar';
type Props = {
    participants: Array<Object>,
    onSelect: Function,
    messagesSinceLastRead: Array<Object>,
    messages: Array<Object>,
}

/**
 * React Component for displaying users list
 */
export default class ChatUsers extends Component<Props> {
    /**
     * Gets the uniqe users who have messaged user.
     *
     * @inheritdoc
     * @returns {Array<Object>}
     */
    _getEngagedUsers() {
        const { messages, participants } = this.props;
        const senders = messages.map(msg => {
            const usr = participants.find(p => p.name === msg.displayName);

            return usr;
        });
        const recipients = messages.map(msg => {
            const usr = participants.find(p => p.name === msg.recipient);

            return usr;
        });

        console.log(messages, participants, senders, recipients, 'recipientsrecipientsrecipientsrecipients');

        return [
            ...senders,
            ...recipients
        ].filter(Boolean);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { messagesSinceLastRead } = this.props;

        const participants = this._getEngagedUsers();


        return (
            <div className = 'chat-users'>
                <ul className = 'chat-users__list'>
                    {
                        (this.props.participants || []).map(participant => (<li
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
                                    <span className = 'chat-users__status--new-message' />
                                </div>
                                <div className = 'chat-users__user-details-body'>
                                    {truncate('Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam inventore, maiores accusantium rem ut dolor corporis fugiat nam, omnis beatae modi error amet alias, ullam temporibus quam dolorem saepe eius.', {
                                        length: 70
                                    })}
                                </div>
                            </div>
                            <div className = 'chat-users__chat-time'>
                                5m
                            </div>
                        </li>))
                    }
                </ul>
            </div>
        );
    }
}
