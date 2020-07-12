/* eslint-disable require-jsdoc */
// @flow
import React from 'react';

import { translate } from '../../base/i18n';
import { IconSettings, IconReport, IconChatBubble } from '../../base/icons';
import {
    OptionsPanel,
    OptionItemCheck,
    OptionDivider,
    OptionTitle,
    OptionItem
} from '../../base/options-panel';
import { connect } from '../../base/redux';
import {
    showToolbox
} from '../../toolbox/actions';
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
    _onMouseOut
    _onMouseOver

    constructor(props) {
        super(props);

        // this._onMouseOut = this._onMouseOut.bind(this);
        this._onMouseOver = this._onMouseOver.bind(this);
    }

    /**
     * Dispatches an action signaling the toolbar is being hovered.
     *
     * @private
     * @returns {void}
     */
    _onMouseOver() {
        this.props.dispatch(showToolbox(2000));
    }

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

                // onMouseOut = { this._onMouseOut }
                onMouseOver = { this._onMouseOver }
                title = 'Permissions'>
                <div className = { 'toolbox-more-items ' }>
                    <OptionTitle className = 'toolbox-more-items__title'>
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
                    </div>
                    <OptionDivider />
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
                    <OptionDivider />
                    <div>
                        <OptionItemCheck
                            checked = { true }
                            label = 'Unmute Themselves' />
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
                            } }

                            onOpenMenu = { () => {
                                this.props._showToastNotificationOptions();
                            } } />
                    </div>

                    <OptionDivider />

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
                    </div>
                    <OptionDivider />
                </div>
            </OptionsPanel>
        );
    }
}


export default translate(connect(_mapStateToProps, _mapDispatchToProps)(ToolboxMoreItems));

