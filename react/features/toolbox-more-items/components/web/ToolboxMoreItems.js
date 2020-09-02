/* global APP */
/* eslint-disable require-jsdoc */
// @flow
import React from 'react';

import { translate } from '../../../base/i18n';
import {
    OptionsPanel,
    OptionItemCheck,
    OptionDivider
} from '../../../base/options-panel';
import { getLocalParticipant } from '../../../base/participants';
import { connect } from '../../../base/redux';
import {
    setFullScreen
} from '../../../toolbox/actions';
import AbstractToolboxMoreItems, {
    _mapDispatchToProps,
    _mapStateToProps,
    type Props
} from '../AbstractToolboxMoreItems';


/**
 * Implements the toolbox settings
 * @extends Component
 */
class ToolboxMoreItems extends AbstractToolboxMoreItems<Props, *> {

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            _fullScreen,
            t,
            _overflowMenuVisible,
            _onClosePanel,
            _notificationVisible,
            _showNotification,
            _hideNotification,
            _toastNotificationSettings,
            _updateToastNotificationOptions,
            _showWaitingMenuOption
        } = this.props;
        const { name: participantName } = getLocalParticipant(APP.store.getState());

        return (
            <OptionsPanel
                isOpen = { _overflowMenuVisible }
                onClose = { _onClosePanel }
                title = { participantName }>
                <div className = { 'toolbox-more-items ' }>
                    {/* <OptionTitle className = 'toolbox-more-items__title'>
                        Meeting
                    </OptionTitle>
                    <OptionDivider />
                    <div>
                        <OptionItemCheck
                            checked = { true }
                            label = 'Lock Meeting' />
                    </div>
                    <OptionDivider />
                    <div>
                        <OptionItemCheck
                            checked = { false }
                            label = 'Enable Waiting Room' />
                    </div> */}
                    {/* <OptionDivider />
                    <OptionTitle className = 'toolbox-more-items__title'>
                        Allow Participants To:
                    </OptionTitle>
                    <OptionDivider />
                    <div>
                        <OptionItemCheck
                            checked = { true }
                            label = 'Share Screen' />
                    </div>
                    <OptionDivider />
                    <div>
                        <OptionItemCheck
                            checked = { true }
                            label = 'Chat' />
                    </div>
                    <OptionDivider />
                    <div>
                        <OptionItemCheck
                            checked = { true }
                            label = 'Rename Themselves' />
                    </div>
                     */}

                    <div>
                        <OptionItemCheck
                            checked = { _notificationVisible }
                            label = 'Toast Notifications'
                            onCheck = { () => {
                                if (!_notificationVisible) {
                                    _showNotification();

                                    return;
                                }

                                _hideNotification();
                            } }>
                            <div>
                                <OptionItemCheck
                                    checked = { _toastNotificationSettings.showRaisedHand }
                                    disabled = { !_notificationVisible }
                                    label = 'Raise Hand'
                                    onCheck = { () => {
                                        _updateToastNotificationOptions({
                                            showRaisedHand: !_toastNotificationSettings.showRaisedHand
                                        });
                                    } } />
                            </div>
                            <OptionDivider />
                            <div>
                                <OptionItemCheck
                                    checked = { _toastNotificationSettings.showJoinedMeeting }
                                    disabled = { !_notificationVisible }
                                    label = 'Join Meeting'
                                    onCheck = { () => {
                                        _updateToastNotificationOptions({
                                            showJoinedMeeting: !_toastNotificationSettings.showJoinedMeeting
                                        });
                                    } } />
                            </div>
                            <OptionDivider />
                            <div>
                                <OptionItemCheck
                                    checked = { _toastNotificationSettings.showLeftMeeting }
                                    disabled = { !_notificationVisible }
                                    label = 'Left Meeting'
                                    onCheck = { () => {
                                        _updateToastNotificationOptions({
                                            showLeftMeeting: !_toastNotificationSettings.showLeftMeeting
                                        });
                                    } } />
                            </div>
                            <OptionDivider />
                            <div>
                                <OptionItemCheck
                                    checked = { _toastNotificationSettings.showChat }
                                    disabled = { !_notificationVisible }
                                    label = 'Chat'
                                    onCheck = { () => {
                                        _updateToastNotificationOptions({
                                            showChat: !_toastNotificationSettings.showChat
                                        });
                                    } } />
                            </div>
                            {
                                _showWaitingMenuOption &&
                                <>
                                    <OptionDivider />
                                    <div>
                                    <OptionItemCheck
                                        checked = { _toastNotificationSettings.showParticipantWaiting }
                                        disabled = { !_notificationVisible }
                                        label = 'Participant Waiting'
                                        onCheck = { () => {
                                            _updateToastNotificationOptions({
                                                showParticipantWaiting: !_toastNotificationSettings.showParticipantWaiting
                                            });
                                        } } />
                                    </div>
                                </>
                            }
                        </OptionItemCheck>
                    </div>

                    <OptionDivider />
                    <div>
                        <OptionItemCheck
                            checked = { _fullScreen }
                            label = { _fullScreen ? t('toolbar.exitFullScreen') : t('toolbar.enterFullScreen') }
                            onCheck = { () => {
                                const fullScreen = !this.props._fullScreen;

                                this.props.dispatch(setFullScreen(fullScreen));
                            } } />
                    </div>

                    {/* <OptionDivider />

                    <div>
                        <OptionItem
                            icon = { IconSettings }
                            label = 'Settings' />
                    </div>

                    <div>
                        <OptionItem
                            icon = { IconChatBubble }
                            label = 'Feedback' />
                    </div>

                    <div>
                        <OptionItem
                            icon = { IconReport }
                            label = 'Report' />
                    </div> */}
                    <OptionDivider />
                </div>
            </OptionsPanel>
        );
    }
}


export default translate(connect(_mapStateToProps, _mapDispatchToProps)(ToolboxMoreItems));

