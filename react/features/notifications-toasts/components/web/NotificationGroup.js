// @flow

import truncate from 'lodash/truncate';
import React, { Component } from 'react';
import { type Dispatch } from 'redux';

import { Avatar } from '../../../base/avatar';
import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import { hideNotification } from '../../actions';

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

    t: Function,
    _hideNotification: Function,
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
     * Implements getMessage.
     *
     * @inheritdoc
     */
    _getMessage(notification: Object) {
        const { t } = this.props;
        const { text, type, userName } = notification;


        switch (type) {
        case 'PARTICIPANT_JOINED':
            return t('notify.connectedOneMember', {
                name: userName
            });


        case 'PARTICIPANT_LEFT':
            return `${userName} left the meeting`;

        case 'RAISED_HAND':
            return `${userName} is raising hand`;

        default:
            return truncate(text, {
                length: 60
            });
        }
    }

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
        const message = this._getMessage(notification);
        const { userId, type } = notification;


        return (
            <Expire
                hideNotification = { () => this.props._hideNotification(notification.id) }
                timer = { 6000 }>
                <div className = { `chat-preview-group ${className} chat-preview-group--${String(type).toLowerCase()}` }>
                    <Avatar participantId = { userId } />
                    <div className = 'chat-preview-group__container'>
                        <ChatMessage
                            key = { notification.id }
                            message = {{
                                ...notification,
                                message
                            }}
                            showDisplayName = { true }
                            showTimestamp = { false } />
                    </div>
                </div>

            </Expire>
        );
    }
}

/**
 * Maps redux actions to the props of the component.
 *
 * @param {Function} dispatch - The redux action {@code dispatch} function.
 * @returns {{
    *     _onSendMessage: Function,
    *     _onToggleChat: Function
    * }}
    * @private
    */
export function _mapDispatchToProps(
        dispatch: Dispatch<any>
) {
    return {
        _hideNotification: (id: string) => dispatch(hideNotification(id))
    };
}

/**
    * Maps (parts of) the redux state to {@link Chat} React {@code Component}
    * props.
    *
    * @param {Object} state - The redux store/state.
    * @private
    * @returns {{ }}
    */
export function _mapStateToProps() {
    return { };
}


export default translate(connect(_mapStateToProps, _mapDispatchToProps)(ToastGroup));
