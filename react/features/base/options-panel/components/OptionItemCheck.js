// @flow

import React, { Component } from 'react';

import { Icon, IconMenu, IconCheck } from '../../icons';


type Props = {
    checked: boolean,
    onCheck: Function,
    onOpenMenu: ?Function,
    label: string,
    icon: ?Object,
}


/**
 * Implements the options items
 * @extends Component
 */
class OptionItemCheck extends Component<Props> {

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { checked, label, onCheck, onOpenMenu } = this.props;

        return (
            <label
                className = { `option-item-check ${checked ? 'option-item-check--checked' : ''}` }
                onClick = { e => {
                    e.stopPropagation();
                    e.preventDefault();
                    onCheck && onCheck();
                } }>
                <div className = 'option-item-check__label'>
                    <div className = 'option-item-check__mark'>
                        {checked && <Icon src = { IconCheck } />}
                    </div>
                    {label}
                </div>
                {onOpenMenu && <button
                    className = 'option-item-check__menu-btn'
                    onClick = { e => {
                        e.preventDefault();
                        e.stopPropagation();
                        onOpenMenu();
                    } }
                    type = 'button'>

                    <Icon src = { IconMenu } />
                </button>}
            </label>
        );
    }
}
export default OptionItemCheck;
