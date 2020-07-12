// @flow
import { Checkbox } from '@atlaskit/checkbox';
import React from 'react';

import { translate } from '../../../base/i18n';
import {
    OptionsPanel,
    OptionItemCheck,
    OptionDivider,
    OptionTitle
} from '../../../base/options-panel';
import { connect } from '../../../base/redux';
import AbstractToastNotificationSetting, {
    type Props,
    _mapDispatchToProps,
    _mapStateToProps
} from '../AbstractToastNotificationSetting';

/**
 * Implements the toast notification settings
 * @extends Component
 */
class ToastNotificationSettings extends AbstractToastNotificationSetting<Props, *> {


    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            _toastNotificationVisible,
            _hideToastNotificationOptions,
            _toastNotificationSettings,
            _updateToastNotificationOptions } = this.props;

        return (
            <OptionsPanel
                className = 'toast-notification-settings'
                isOpen = { _toastNotificationVisible }
                onClose = { _hideToastNotificationOptions }
                title = 'Toast Notifications'>
                <OptionTitle className = 'toolbox-more-items__title'>
                    Advanced Settings:
                </OptionTitle>
                <div>
                    <OptionItemCheck
                        checked = { _toastNotificationSettings.showRaisedHand }
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
                        label = 'Chat'
                        onCheck = { () => {
                            _updateToastNotificationOptions({
                                showChat: !_toastNotificationSettings.showChat
                            });
                        } } />
                </div>
                <OptionDivider />
                <div style = {{ padding: '26px 0' }}>
                    <Checkbox
                        label = 'Remember these setting when I host meetings in future.'
                        size = 'large' />
                </div>

            </OptionsPanel>
        );
    }
}


export default translate(connect(_mapStateToProps, _mapDispatchToProps)(ToastNotificationSettings));
