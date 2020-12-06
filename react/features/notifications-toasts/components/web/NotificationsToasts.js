// @flow
import React from 'react';

import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import AbstractChatPreview, {
    type Props,
    _mapDispatchToProps,
    _mapStateToProps
} from '../AbstractChatPreview';

import ToastsContainer from './ToastsContainer';

/**
 * Implements a React native component that renders the chat preview
 */
class NotificationsToasts extends AbstractChatPreview<Props, *> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {

        return (
            <div className = { `chat-preview ${this.props._isOpen ? 'chat-preview--visible' : ''}` }>
                <ToastsContainer
                    localParticipant = { this.props._localParticipant }
                    notifications = { this.props._notifications } />
            </div>
        );
    }
}


export default translate(connect(_mapStateToProps, _mapDispatchToProps)(NotificationsToasts));
