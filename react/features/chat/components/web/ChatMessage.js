// @flow

import React from 'react';
import { toArray } from 'react-emoji-render';

import { Avatar } from '../../../base/avatar';
import { translate } from '../../../base/i18n';
import { Linkify } from '../../../base/react';
import AbstractChatMessage, {
    type Props
} from '../AbstractChatMessage';

// import { MESSAGE_TYPE_LOCAL } from '../../constants';
// import PrivateMessageButton from '../PrivateMessageButton';

/**
 * Renders a single chat message.
 */
class ChatMessage extends AbstractChatMessage<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const processedMessage = [];

        // content is an array of text and emoji components
        const content = toArray(this._getMessageText(), { className: 'smiley' });

        content.forEach(i => {
            if (typeof i === 'string') {
                processedMessage.push(<Linkify key = { i }>{ i }</Linkify>);
            } else {
                processedMessage.push(i);
            }
        });

        console.log(this.props.message, 'messagemessagemessage');

        return (
            <div className = 'chatmessage-wrapper'>
                <div className = 'chatmessage-wrapper__container'>
                    <Avatar
                        participantId = { this.props.message.id }
                        size = { 30 } />
                    <div className = { 'chatmessage ' }>
                        <div className = 'replywrapper'>
                            <div className = 'messagecontent'>
                                { this.props.showDisplayName && this._renderDisplayName() }
                                <div className = 'usermessage'>
                                    { processedMessage }
                                </div>
                            </div>
                            {/* { message.privateMessage && message.messageType !== MESSAGE_TYPE_LOCAL
                            && (
                                <div className = 'messageactions'>
                                    <PrivateMessageButton
                                        participantID = { message.id }
                                        reply = { true }
                                        showLabel = { false } />
                                </div>
                            ) } */}
                        </div>
                    </div>
                </div>

                { this.props.showTimestamp && this._renderTimestamp() }
            </div>
        );
    }

    _getFormattedTimestamp: () => string;

    _getMessageText: () => string;

    _getPrivateNoticeMessage: () => string;

    /**
     * Renders the display name of the sender.
     *
     * @returns {React$Element<*>}
     */
    _renderDisplayName() {
        return (
            <div className = 'display-name'>
                { this.props.message.displayName }
            </div>
        );
    }

    /**
     * Renders the message privacy notice.
     *
     * @returns {React$Element<*>}
     */
    _renderPrivateNotice() {
        return (
            <div className = 'privatemessagenotice'>
                { this._getPrivateNoticeMessage() }
            </div>
        );
    }

    /**
     * Renders the time at which the message was sent.
     *
     * @returns {React$Element<*>}
     */
    _renderTimestamp() {
        return (
            <div className = 'timestamp'>
                { this._getFormattedTimestamp() }
            </div>
        );
    }
}

export default translate(ChatMessage);
