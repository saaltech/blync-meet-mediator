// @flow

import React from 'react';
import { toArray } from 'react-emoji-render';


import { translate } from '../../../base/i18n';
import { IconUserCheck, IconUserCancel, IconRaisedHand, Icon } from '../../../base/icons';
import { Linkify } from '../../../base/react';
import AbstractChatMessage, {
    type Props
} from '../AbstractChatMessage';

import { WAITING_TO_JOIN } from '../../constants'

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

        return (
            <div className = 'chatmessage-wrapper'>
                <div className = { 'chatmessage ' }>
                    <div className = 'replywrapper'>
                        <div className = 'messagecontent'>
                            { this.props.showDisplayName && this._renderDisplayName() }
                            <div className = 'usermessage'>
                                { processedMessage }
                                {
                                    (this.props.message.type !== 'default' && 
                                    this.props.message.type !== WAITING_TO_JOIN)
                                 && <Icon src = { this._getMessageIcon(this.props.message) } />
                                }
                            </div>
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
     * Returns the icon type for message.
     *
     * @param {Object} message - : Message.
     * @returns {React$Element<*>}
     */
    _getMessageIcon(message: Object) {

        switch (message.type) {
            case 'PARTICIPANT_JOINED':
                return IconUserCheck;

            case 'PARTICIPANT_LEFT':
                return IconUserCancel;

            case 'RAISED_HAND':
                return IconRaisedHand;
        }
    }

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
