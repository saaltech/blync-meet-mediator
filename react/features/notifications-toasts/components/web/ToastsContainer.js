// @flow

import React, { Component } from 'react';

import NotificationGroup from './NotificationGroup';

export type Props = {

    /**
     * The notifications array to render.
     */
    notifications: Array<Object>,
    localParticipant: ?Object
}


/**
 * Displays all received chat messages, grouped by sender.
 *
 */
export default class ToastsContainer extends Component<Props> {
    /**
     * Whether or not chat has been scrolled to the bottom of the screen. Used
     * to determine if chat should be scrolled automatically to the bottom when
     * the {@code ChatInput} resizes.
     */
    _isScrolledToBottom: boolean;

    /**
     * Reference to the HTML element at the end of the list of displayed chat
     * messages. Used for scrolling to the end of the chat messages.
     */
    _notificationsListEndRef: Object;

    /**
     * A React ref to the HTML element containing all {@code ChatMessageGroup}
     * instances.
     */
    _messageListRef: Object;

    /**
     * Initializes a new {@code MessageContainer} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code MessageContainer} instance with.
     */
    constructor(props: Props) {
        super(props);

        this._isScrolledToBottom = true;

        this._messageListRef = React.createRef();
        this._notificationsListEndRef = React.createRef();

        this._onChatScroll = this._onChatScroll.bind(this);
    }

    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const notifications = [ ...this.props.notifications ]
        .filter(msg => msg.senderId !== this.props.localParticipant?.id)
        .reverse()
        .map(notification => (
            <NotificationGroup
                key = { notification.id }
                notification = { notification } />
        ));

        return (
            <div
                id = 'chatconversation'
                onScroll = { this._onChatScroll }
                ref = { this._messageListRef }>
                { notifications }
                <div ref = { this._notificationsListEndRef } />
            </div>
        );
    }

    /**
     * Scrolls to the bottom again if the instance had previously been scrolled
     * to the bottom. This method is used when a resize has occurred below the
     * instance and bottom scroll needs to be maintained.
     *
     * @returns {void}
     */
    maybeUpdateBottomScroll() {
        if (this._isScrolledToBottom) {
            this.scrollToBottom(false);
        }
    }

    /**
     * Automatically scrolls the displayed chat messages down to the latest.
     *
     * @param {boolean} withAnimation - Whether or not to show a scrolling
     * animation.
     * @returns {void}
     */
    scrollToBottom(withAnimation: boolean) {
        this._notificationsListEndRef.current.scrollIntoView({
            behavior: withAnimation ? 'smooth' : 'auto',
            block: 'nearest'
        });
    }

    _onChatScroll: () => void;

    /**
     * Callback invoked to listen to the current scroll location.
     *
     * @private
     * @returns {void}
     */
    _onChatScroll() {
        const element = this._messageListRef.current;

        this._isScrolledToBottom
            = element.scrollHeight - element.scrollTop === element.clientHeight;
    }
}
