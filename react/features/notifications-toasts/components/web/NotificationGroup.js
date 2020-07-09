// @flow

import truncate from 'lodash/truncate';
import React, { Component } from 'react';

import { Avatar } from '../../../base/avatar';

import ChatMessage from './ChatMessage';
import Expire from './Expire';

type Props = {

    /**
     * Additional CSS classes to apply to the root element.
     */
    className: string,

    /**
     * The notification to display .
     */
    notification: Object,
};

/**
 * Displays a list of chat messages. Will show only the display name for the
 * first chat message and the timestamp for the last chat message.
 *
 * @extends React.Component
 */
class ToastGroup extends Component<Props> {
    static defaultProps = {
        className: ''
    };

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { className, notification } = this.props;


        if (!notification) {
            return null;
        }

        const { userId } = notification;


        return (

            <Expire
                timer = { 6000 }>
                <div className = { `chat-preview-group ${className}` }>
                    <Avatar participantId = { userId } />
                    <div className = 'chat-preview-group__container'>
                        <ChatMessage
                            key = { notification.id }
                            message = {{ ...notification,
                                message: truncate(notification.text, {
                                    length: 60
                                }) }}
                            showDisplayName = { true }
                            showTimestamp = { false } />
                    </div>
                </div>

            </Expire>
        );
    }
}

export default ToastGroup;
