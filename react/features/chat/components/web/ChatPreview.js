// @flow
import React from 'react';

import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import AbstractChatPreview, {
    type Props,
    _mapDispatchToProps,
    _mapStateToProps
} from '../AbstractChatPreview';

import ChatPreviewContainer from './ChatPreviewContainer';

/**
 * Implements a React native component that renders the chat preview
 */
class ChatPreview extends AbstractChatPreview<Props, *> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {

        return (
            <div className = { `chat-preview ${this.props._isOpen ? 'chat-preview--visible' : ''}` }>
                <ChatPreviewContainer
                    localParticipant = { this.props._localParticipant }
                    messages = { this.props._messages } />
            </div>
        );
    }
}


export default translate(connect(_mapStateToProps, _mapDispatchToProps)(ChatPreview));
