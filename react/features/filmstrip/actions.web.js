// @flow
import type { Dispatch } from 'redux';

import { pinParticipant } from '../base/participants';

import { setConferenceLastNToOne } from '../conference/functions.any';

/**
 * The size of the side margins for the entire tile view area.
 */
const TILE_VIEW_SIDE_MARGINS = 20;
import {
    SET_HORIZONTAL_VIEW_DIMENSIONS,
    SET_TILE_VIEW_DIMENSIONS,
    SET_VERTICAL_VIEW_DIMENSIONS,
    SET_VISIBLE_REMOTE_PARTICIPANTS,
    SET_VOLUME,
    SET_FILMSTRIP_COLLAPSED, 
    SET_PAGE
} from './actionTypes';
import {
    HORIZONTAL_FILMSTRIP_MARGIN,
    SCROLL_SIZE,
    STAGE_VIEW_THUMBNAIL_HORIZONTAL_BORDER,
    STAGE_VIEW_THUMBNAIL_VERTICAL_BORDER,
    TILE_HORIZONTAL_MARGIN,
    TILE_VERTICAL_MARGIN,
    VERTICAL_FILMSTRIP_VERTICAL_MARGIN
} from './constants';
import {
    calculateThumbnailSizeForHorizontalView,
    calculateThumbnailSizeForTileView,
    calculateThumbnailSizeForVerticalView
} from './functions';

/**
 * Sets the dimensions of the tile view grid.
 *
 * @param {Object} dimensions - Whether the filmstrip is visible.
 * @param {Object | Function} stateful - An object or function that can be
 * resolved to Redux state using the {@code toState} function.
 * @returns {Function}
 */
export function setTileViewDimensions(dimensions: Object, windowSize: Object) {
    const thumbnailSize = calculateThumbnailSizeForTileView({
        ...dimensions,
        ...windowSize
    });
    const filmstripWidth = dimensions.columns * (TILE_VIEW_SIDE_MARGINS + thumbnailSize.width);

/**
 * Sets the dimensions of the thumbnails in vertical view.
 *
 * @returns {Function}
 */
export function setVerticalViewDimensions() {
    return (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const { clientHeight = 0, clientWidth = 0 } = state['features/base/responsive-ui'];
        const thumbnails = calculateThumbnailSizeForVerticalView(clientWidth);

        dispatch({
            type: SET_VERTICAL_VIEW_DIMENSIONS,
            dimensions: {
                ...thumbnails,
                remoteVideosContainer: {
                    width: thumbnails?.local?.width
                        + TILE_HORIZONTAL_MARGIN + STAGE_VIEW_THUMBNAIL_HORIZONTAL_BORDER + SCROLL_SIZE,
                    height: clientHeight - thumbnails?.local?.height - VERTICAL_FILMSTRIP_VERTICAL_MARGIN
                }
            }

        });
    };
}

/**
 * Sets the dimensions of the thumbnails in horizontal view.
 *
 * @returns {Function}
 */
export function setHorizontalViewDimensions() {
    return (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const { clientHeight = 0, clientWidth = 0 } = state['features/base/responsive-ui'];
        const thumbnails = calculateThumbnailSizeForHorizontalView(clientHeight);

        dispatch({
            type: SET_HORIZONTAL_VIEW_DIMENSIONS,
            dimensions: {
                ...thumbnails,
                remoteVideosContainer: {
                    width: clientWidth - thumbnails?.local?.width - HORIZONTAL_FILMSTRIP_MARGIN,
                    height: thumbnails?.local?.height
                        + TILE_VERTICAL_MARGIN + STAGE_VIEW_THUMBNAIL_VERTICAL_BORDER + SCROLL_SIZE
                }
            }
        });
    };
}

/**
 * Sets the whether filmstrip is collapsed or not.
 *
 * @param {boolean} collapsed - Collapse status.
 * @returns {{
    *     type: SET_HORIZONTAL_VIEW_DIMENSIONS,
    *     dimensions: Object
    * }}
    */
export function setFilmStripCollapsed(collapsed: boolean) {
    setTimeout(() => setConferenceLastNToOne(collapsed), 10);
    
    return {
        type: SET_FILMSTRIP_COLLAPSED,
        collapsed
    };
}

/**
 * Sets page.
 *
 * @param {int} page - Page.
 * @returns {{
    *     type: SET_PAGE,
    *     dimensions: Object
    * }}
    */
export function setPage(page: number = 1) {
    return {
        type: SET_PAGE,
        page
    };
}
export * from './actions.native';
