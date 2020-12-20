// @flow

import React, { Component } from 'react';

declare var interfaceConfig: Object;

/**
 * The type of the React {@code Component} props of {@link OverlayFrame}.
 */
type Props = {

    /**
     * The children components to be displayed into the overlay frame.
     */
    children: React$Node,

    /**
     * Indicates the css style of the overlay. If true, then lighter; darker,
     * otherwise.
     */
    isLightOverlay?: boolean
};

/**
 * Implements a React {@link Component} for the frame of the overlays.
 */
export default class OverlayFrame extends Component<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement|null}
     */
    render() {
        let containerClass = this.props.isLightOverlay
            ? 'overlay__container-light' : 'overlay__container';
        // let contentClass = 'overlay__content';

        /*if (this.state.filmstripOnly) {
            containerClass += ' filmstrip-only';
            contentClass += ' filmstrip-only';
        }*/

        return (<>
            <div class="modal-overlay"></div>
            <div
                className = { containerClass }
                id = 'overlay'>
                <div className = { 'overlay__content' }>
                    {
                        this.props.children
                    }
                </div>
            </div>
            </>
        );
    }
}
