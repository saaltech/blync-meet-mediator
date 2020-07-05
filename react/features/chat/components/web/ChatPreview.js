// @flow
import React from 'react';

import AbstractChat from '../AbstractChat';


type Props = {
    _isOpen: Boolean
}

type State = {

}

/**
 * Implements a React native component that renders the chat preview
 */
export default class ChatPreview extends AbstractChatPreview<Props, State> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {

        return (
            <div className = 'chat-preview' />
        );
    }
}
