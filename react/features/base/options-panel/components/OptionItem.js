// @flow

import React, { Component } from 'react';

import { Icon } from '../../icons';


type Props = {
    checked: boolean,
    onClick: Function,
    onOpenMenu: ?Function,
    label: string,
    icon: ?Object,
}


/**
 * Implements the options items
 * @extends Component
 */
class OptionItem extends Component<Props> {

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { checked, label, onClick, icon } = this.props;

        return (
            <label
                className = { `option-item-check ${checked ? 'option-item-check--checked' : ''}` }
                onClick = { e => {
                    e.stopPropagation();
                    e.preventDefault();
                    onClick();
                } }>
                <div className = 'option-item-check__label'>
                    <div className = 'option-item-check__mark'>
                        {icon && <Icon src = { icon } />}
                    </div>
                    {label}
                </div>
            </label>
        );
    }
}
export default OptionItem;
