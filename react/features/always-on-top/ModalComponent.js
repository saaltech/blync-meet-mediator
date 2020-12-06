/* @flow */

import React, { useState } from 'react';

import { translate } from '../base/i18n';

type Props = {

    /**
     * True if the modal should be shown, false otherwise.
     */
    _show: boolean,

    /**
     * The color schemed style of the modal.
     */
    _styles: StyleType,

    /**
     * The children component(s) of the Modal, to be rendered.
     */
    children: React$Node,

    closeAction: Object
}

/**
 */
function ModalComponent(props: Props) {
    const [ hideOverlay, setHideOverlay ] = useState(false);
    const { children, closeAction } = props;

    return (
        <div className = { `modalComponent` } >
            <div
                className = 'modal-overlay'
                id = 'modal-overlay-comp' />
            <div className = { 'modal' }>
                <div
                    className = 'close-icon'
                    onClick = { () => closeAction && closeAction() } />
                { children }
            </div>
        </div>
    );
}

export default translate(ModalComponent);
