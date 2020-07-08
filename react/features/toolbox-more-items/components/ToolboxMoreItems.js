// @flow
import React from 'react';

import { translate } from '../../base/i18n';
import { OptionsPanel, OptionItemCheck } from '../../base/options-panel';
import { connect } from '../../base/redux';
import AbstractToolboxMoreItems, {
    _mapDispatchToProps,
    _mapStateToProps,
    type Props
} from '../AbstractToolBoxMoreItems';


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
        const { _overflowMenuVisible, _onClosePanel, _notificationVisible, _showNotification, _hideNotification } = this.props;

        return (
            <OptionsPanel
                isOpen = { _overflowMenuVisible }
                onClose = { _onClosePanel }
                title = 'Permissions'>
                <div className = { 'toolbox-more-items ' }>
                    <div className = 'toolbox-more-items__title'>
                        Meeting
                    </div>
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
                            } } />
                    </div>
                </div>
            </OptionsPanel>
        );
    }
}


export default translate(connect(_mapStateToProps, _mapDispatchToProps)(ToolboxMoreItems));

