// @flow

import { StateListenerRegistry } from '../base/redux';
import { showToolbox } from '../toolbox';


declare var APP: Object;
declare var interfaceConfig : Object;

/**
 * Timeout for when to show the privacy notice after a private message was received.
 *
 * E.g. if this value is 20 secs (20000ms), then we show the privacy notice when sending a non private
 * message after we have received a private message in the last 20 seconds.
 */

StateListenerRegistry.register(
    state => state['features/toolbox'].overflowMenuVisible,
    (isOpen, { dispatch }) => {
        if (typeof APP !== 'undefined' && isOpen) {
            dispatch(showToolbox());
        }
    }
);

