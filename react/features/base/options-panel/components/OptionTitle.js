// @flow

import React, { Component } from 'react';

type Props = {
    children: Object,
}

/**
 * Implements the options title
 * @extends Component
 */
export default class OptionTitle extends Component<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <div className = 'option-title'>
                {this.props.children}
            </div>
        );
    }
}
