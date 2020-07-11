// @flow
import React from 'react';

import { translate } from '../../base/i18n';
import { OptionsPanel, OptionItemCheck, OptionDivider, OptionTitle } from '../../base/options-panel';
import { connect } from '../../base/redux';
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
        const { _toastNotificationVisible, _hideToastNotificationOptions } = this.props;

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
                        checked = { true }
                        label = 'Raise Hand' />
                </div>
                <OptionDivider />
                <div>
                    <OptionItemCheck
                        checked = { true }
                        label = 'Join Meeting' />
                </div>
                <OptionDivider />
                <div>
                    <OptionItemCheck
                        checked = { true }
                        label = 'Left Meeting' />
                </div>
                <OptionDivider />
                <div>
                    <OptionItemCheck
                        checked = { true }
                        label = 'Chat' />
                </div>
                <OptionDivider />
            </OptionsPanel>
        );
    }
}


export default translate(connect(_mapStateToProps, _mapDispatchToProps)(ToastNotificationSettings));
