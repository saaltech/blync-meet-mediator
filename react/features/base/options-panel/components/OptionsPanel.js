// @flow
import React, { Component } from 'react';

import { Icon, IconClose } from '../../icons';


type Props = {
    isOpen: boolean,
    children: Object,
    title: string,
    onClose: Function,
    noBodyPadding: boolean
}

/**
 * Implements the options panel
 * @extends Component
 */
export default class OptionsPanel extends Component<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { isOpen, children, title, onClose, noBodyPadding } = this.props;

        return (
            <div
                className = { `options-panel ${isOpen ? 'options-panel--visible' : ''}` }>
                <div className = 'options-panel__header'>
                    <div className = 'options-panel__title'>
                        {title}
                    </div>

                    <button
                        className = 'options-panel__close-btn'
                        onClick = { onClose }
                        type = 'button'>
                        <Icon
                            size = { 25 }
                            src = { IconClose } />
                    </button>
                </div>
                <div className = { `options-panel__body ${noBodyPadding ? 'options-panel__body--no-padding' : ''} ` }>
                    {children}
                </div>
            </div>
        );
    }
}
