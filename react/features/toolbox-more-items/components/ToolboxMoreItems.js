// @flow
import React from 'react';

import { translate } from '../../base/i18n';
import { OptionsPanel } from '../../base/options-panel';
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
        const { _isOpen, _onClose } = this.props;

        return (
            <OptionsPanel
                isOpen = { _isOpen }
                onClose = { _onClose }
                title = 'Permissions'>
                <div className = { 'toolbox-settings ' }>
                    Toolbox Settings
                </div>
            </OptionsPanel>
        );
    }
}


export default translate(connect(_mapStateToProps, _mapDispatchToProps)(ToolboxMoreItems));

