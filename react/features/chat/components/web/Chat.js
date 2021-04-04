// @flow

import React from 'react';
import Transition from 'react-transition-group/Transition';

import { translate } from '../../../base/i18n';
import { Icon, IconClose, IconArrowLeft } from '../../../base/icons';
import { connect } from '../../../base/redux';
import AbstractChat, {
    _mapStateToProps,
    type Props
} from '../AbstractChat';

import ChatDialog from './ChatDialog';
import Header from './ChatDialogHeader';
import ChatInput from './ChatInput';
import ChatUsers from './ChatUsers';
import DisplayNameForm from './DisplayNameForm';
import KeyboardAvoider from './KeyboardAvoider';
import MessageContainer from './MessageContainer';

const SwitcherViews = {
    EVERYONE: 'EVERYONE',
    PRIVATE: 'PRIVATE'
};

type State = {
    activeSwitcher: string,
    activeParticipant?: Object,
}

/**
 * React Component for holding the chat feature in a side panel that slides in
 * and out of view.
 */
class Chat extends AbstractChat<Props, State> {

    state = {
        activeSwitcher: SwitcherViews.EVERYONE,
        activeParticipant: null
    };

    /**
     * Whether or not the {@code Chat} component is off-screen, having finished
     * its hiding animation.
     */
    _isExited: boolean;

    /**
     * Reference to the React Component for displaying chat messages. Used for
     * scrolling to the end of the chat messages.
     */
    _messageContainerRef: Object;


    _onToggleChat: Function;

    _markMessagesAsRead: Function;

    _onClearPrivateMessages: Function;

    /**
     * Initializes a new {@code Chat} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this._isExited = true;
        this._messageContainerRef = React.createRef();

        // Bind event handlers so they are only bound once for every instance.
        this._renderPanelContent = this._renderPanelContent.bind(this);
        this._onChatInputResize = this._onChatInputResize.bind(this);

        this._onToggleChat = this._onToggleChat.bind(this);

        this._markMessagesAsRead = this._markMessagesAsRead.bind(this);

        this._onClearPrivateMessages = this._onClearPrivateMessages.bind(this);
    }

    /**
     * Implements {@code Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._scrollMessageContainerToBottom(true);
    }

    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        if (prevProps._messages !== undefined && this.props._messages.length !== prevProps._messages.length) {
            this._scrollMessageContainerToBottom(true);
        } else if (this.props._isOpen && !prevProps._isOpen) {
            this._scrollMessageContainerToBottom(false);

            if (this.state.activeSwitcher === SwitcherViews.EVERYONE) {
                this.props._markPublicAsRead();
            }
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {

        return (
            <Transition
                in = { this.props._isOpen }
                timeout = { 10 }>
                { this._renderPanelContent }
            </Transition>
        );
    }

    /**
     * Handler for selecting private user.
     *
     * @private
     * @param {string} participant - The participant.
     * @returns {void}
     */
    _onClearPrivateMessages(participant) {
        const { _localParticipant } = this.props;

        this.props._setPrivateMessageRecipient(participant);
        this.props._markAsRead(_localParticipant, participant);

        this.setState({ activeParticipant: participant });
    }

    _onChatInputResize: () => void;

    /**
     * Callback invoked when {@code ChatInput} changes height. Preserves
     * displaying the latest message if it is scrolled to.
     *
     * @private
     * @returns {void}
     */
    _onChatInputResize() {
        this._messageContainerRef.current.maybeUpdateBottomScroll();
    }

    /**
     * Toggles chat view.
     *
     * @private
     * @returns {void}
     */
    _onToggleChat() {
        this.props._onToggleChat();

        if (!this.props._privateMessageRecipient && this.state.activeSwitcher === SwitcherViews.EVERYONE) {
            this.props._markPublicAsRead();
        }


        if (this.props._privateMessageRecipient) {
            this.props._markAsRead(
                this.props._localParticipant,
                this.state.activeParticipant
            );
        }
    }

    /**
     * Marks messages as read.
     *
     * @private
     * @returns {void}
     */
    _markMessagesAsRead() {
        const privaMessages = this.props._messagesSinceLastRead.filter(m => m.privateMessage);
        const publicMessages = this.props._messagesSinceLastRead.filter(m => !m.privateMessage);

        if (!this.props._privateMessageRecipient && publicMessages.length > 0) {
            this.props._markPublicAsRead();
        }

        if (this.props._privateMessageRecipient && privaMessages.length > 0) {
            this.props._markAsRead(
                this.props._localParticipant,
                this.state.activeParticipant
            );
        }
    }

    /**
     * Returns a React Element for showing chat messages and a form to send new
     * chat messages.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderChat() {
        let messages = this.props._messages;

        const { _participants, _privateMessageRecipient, _localParticipant, _messagesSinceLastRead } = this.props;
        const showUsersList = this.state.activeSwitcher === SwitcherViews.PRIVATE && !this.props._privateMessageRecipient;
        const showMessageContainer = this.state.activeSwitcher === SwitcherViews.EVERYONE || this.props._privateMessageRecipient;

        if (this.props._privateMessageRecipient) {
            messages = (this.props._messages || []).filter(
                message => {
                    const containsLocalAndRemoteUsersOnly = (
                        message.recipient === _privateMessageRecipient.name && message.id === _localParticipant.id
                    )
                    || (
                        message.recipient === _localParticipant.name && message.id === _privateMessageRecipient.id
                    );

                    return containsLocalAndRemoteUsersOnly && message.privateMessage;
                });
        } else {
            messages = (this.props._messages || []).filter(message => !message.privateMessage);
        }

        return (
            <>
                {showMessageContainer && <MessageContainer
                    messages = { messages }
                    ref = { this._messageContainerRef } /> }
                {showUsersList && <ChatUsers
                    localParticipant = { _localParticipant }
                    messages = { this.props._messages.filter(msg => msg.privateMessage) }
                    messagesSinceLastRead = { _messagesSinceLastRead }
                    onSelect = { this._onClearPrivateMessages.bind(this) }
                    participants = { _participants }
                    ref = { this._messageContainerRef } /> }
                {showMessageContainer && <ChatInput
                    onChange = { () => {
                        if (this.state.activeSwitcher === SwitcherViews.EVERYONE && !this.props._privateMessageRecipient) {
                            this.props._markPublicAsRead();
                        }

                        const privaMessages = this.props._messages
                        .filter(m => m.privateMessage && m.senderId === (this.props._privateMessageRecipient || {}).id);


                        if (this.props._privateMessageRecipient && privaMessages.length > 0) {

                            this._onClearPrivateMessages(this.props._privateMessageRecipient);
                        }
                    } }
                    onResize = { this._onChatInputResize }
                    onSend = { this.props._onSendMessage } />}
            </>
        );
    }

    /**
     * Instantiates a React Element to display at the top of {@code Chat} to
     * close {@code Chat}.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderChatHeader() {
        return (
            <div className = 'chat-header'>
                <div
                    className = { `chat-label ${this.props._privateMessageRecipient ? 'chat-label--btn' : ''}` }
                    onClick = { e => {
                        e.preventDefault();
                        if (this.props._privateMessageRecipient) {
                            this._onClearPrivateMessages(this.state.activeParticipant);
                            this.setState({
                                activeSwitcher: SwitcherViews.PRIVATE

                                // activeParticipant: null
                            });
                            this.props._setPrivateMessageRecipient(null);
                        }
                    } }>
                    {this.props._privateMessageRecipient && <Icon
                        className = 'chat__back-icon'
                        src = { IconArrowLeft } />}
                    {this.props.t('chat.title')}
                </div>
                <div
                    className = 'chat-close'
                    onClick = { this._onToggleChat }>
                    <Icon src = { IconClose } />
                </div>
            </div>
        );
    }

    /**
     * Instantiates a React Element to display at the top of {@code Chat} to
     * close {@code Chat}.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderSwitcher() {
        const { _messages } = this.props;
        const unReadPrivateMessages = _messages.filter(msg => msg.privateMessage).reduce((acc, message) => {
            if (message.hasRead) {
                return acc;
            }

            return acc + 1;

        }, 0);

        const unReadPublicMessages = _messages.filter(msg => !msg.privateMessage).reduce((acc, message) => {
            if (message.hasRead) {
                return acc;
            }

            return acc + 1;

        }, 0);

        return (<div className = 'chat__switcher'>
            <button
                className = { `${this.state.activeSwitcher === SwitcherViews.EVERYONE ? 'chat__switcher-btn--active' : ''}` }
                onClick = { () => {
                    this.setState({ activeSwitcher: SwitcherViews.EVERYONE });
                    this.props._markPublicAsRead();
                } }
                type = 'button'>
                {this.props.t('chat.everyone')}
                {unReadPublicMessages > 0 && <span className = 'chat__unread-count'>({unReadPublicMessages})</span>}
            </button>
            <button
                className = { `${this.state.activeSwitcher === SwitcherViews.PRIVATE ? 'chat__switcher-btn--active' : ''}` }
                onClick = { () => {
                    this.setState({ activeSwitcher: SwitcherViews.PRIVATE });
                    this.props._markPublicAsRead();
                } }
                type = 'button'>
                {this.props.t('chat.private')}
                {unReadPrivateMessages > 0 && <span className = 'chat__unread-count'>({unReadPrivateMessages})</span>}
            </button>
        </div>);
    }

    _renderPanelContent: (string) => React$Node | null;

    /**
     * Renders the contents of the chat panel, depending on the current
     * animation state provided by {@code Transition}.
     *
     * @param {string} state - The current display transition state of the
     * {@code Chat} component, as provided by {@code Transition}.
     * @private
     * @returns {ReactElement | null}
     */
    _renderPanelContent(state) {
        this._isExited = state === 'exited';

        const { _isOpen, _showNamePrompt, _privateMessageRecipient } = this.props;
        const ComponentToRender = !_isOpen && state === 'exited'
            ? null
            : (
                <>
                    { this._renderChatHeader() }
                    { !_privateMessageRecipient && this._renderSwitcher() }
                    {_privateMessageRecipient && <div className = 'chat__private-user-name'>{_privateMessageRecipient.name}</div>}
                    { _showNamePrompt
                        ? <DisplayNameForm /> : this._renderChat() }
                </>
            );
        let className = '';

        if (_isOpen) {
            className = 'slideInExt';
        } else if (this._isExited) {
            className = 'invisible';
        }

        return (
            <div
                className = { `sideToolbarContainer ${className}` }
                id = 'sideToolbarContainer'>
                { ComponentToRender }
            </div>
        );
    }

    /**
     * Scrolls the chat messages so the latest message is visible.
     *
     * @param {boolean} withAnimation - Whether or not to show a scrolling
     * animation.
     * @private
     * @returns {void}
     */
    _scrollMessageContainerToBottom(withAnimation) {
        if (this._messageContainerRef.current && this._messageContainerRef.current.scrollToBottom) {
            this._messageContainerRef.current.scrollToBottom(withAnimation);
        }
    }

    _onSendMessage: (string) => void;
}

export default translate(connect(_mapStateToProps)(Chat));
