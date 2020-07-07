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
     * The message to display .
     */
    message: Object,
};

/**
 * Displays a list of chat messages. Will show only the display name for the
 * first chat message and the timestamp for the last chat message.
 *
 * @extends React.Component
 */
class ChatPreviewGroup extends Component<Props> {
    static defaultProps = {
        className: ''
    };

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { className, message } = this.props;


        if (!message) {
            return null;
        }

        const { senderId } = message;


        return (

            <Expire
                timer = { 6000 }>
                <div className = { `chat-preview-group ${className}` }>
                    <Avatar participantId = { senderId } />
                    <div className = 'chat-preview-group__container'>
                        <ChatMessage
                            key = { message.chatId }
                            message = {{ ...message,
                                message: truncate(message.message, {
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

export default ChatPreviewGroup;
