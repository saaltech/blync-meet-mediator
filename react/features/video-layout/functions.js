// @flow

import { setPage } from '../filmstrip/actions.web';
import { getPinnedParticipant, getParticipantCount } from '../base/participants';
import {
    ASPECT_RATIO_BREAKPOINT,
    DEFAULT_MAX_COLUMNS,
    ABSOLUTE_MAX_COLUMNS,
    SINGLE_COLUMN_BREAKPOINT,
    TWO_COLUMN_BREAKPOINT
} from '../filmstrip/constants';
import { isVideoPlaying } from '../shared-video/functions';

import { LAYOUTS } from './constants';

declare var interfaceConfig: Object;
declare var APP: Object;

/**
 * Returns the {@code LAYOUTS} constant associated with the layout
 * the application should currently be in.
 *
 * @param {Object} state - The redux state.
 * @returns {string}
 */
export function getCurrentLayout(state: Object) {
    if (shouldDisplayTileView(state)) {
        return LAYOUTS.TILE_VIEW;
    }

    return LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW;
}

/**
 * Returns how many columns should be displayed in tile view. The number
 * returned will be between 1 and 7, inclusive.
 *
 * @param {Object} state - The redux store state.
 * @returns {number}
 */
export function getMaxColumnCount(state: Object) {
    const configuredMax = interfaceConfig.TILE_VIEW_MAX_COLUMNS || DEFAULT_MAX_COLUMNS;
    const { disableResponsiveTiles } = state['features/base/config'];

    if (!disableResponsiveTiles) {
        const { clientWidth } = state['features/base/responsive-ui'];
        const participantCount = getParticipantCount(state);

        // If there are just two participants in a conference, enforce single-column view for mobile size.
        if (participantCount === 2 && clientWidth < ASPECT_RATIO_BREAKPOINT) {
            return Math.min(1, Math.max(configuredMax, 1));
        }

        // Enforce single column view at very small screen widths.
        if (clientWidth < SINGLE_COLUMN_BREAKPOINT) {
            return Math.min(1, Math.max(configuredMax, 1));
        }

        // Enforce two column view below breakpoint.
        if (clientWidth < TWO_COLUMN_BREAKPOINT) {
            return Math.min(2, Math.max(configuredMax, 1));
        }
    }

    return Math.min(Math.max(configuredMax, 1), ABSOLUTE_MAX_COLUMNS);
}

/**
 * Returns the cell count dimensions for tile view. Tile view tries to uphold
 * equal count of tiles for height and width, until maxColumn is reached in
 * which rows will be added but no more columns.
 *
 * @param {Object} state - The redux store state.
 * @param {number} maxColumns - The maximum number of columns that can be
 * displayed.
 * @returns {Object} An object is return with the desired number of columns,
 * rows, and visible rows (the rest should overflow) for the tile view layout.
 */
export function getTileViewGridDimensions(state: Object) {
    const maxColumns = getMaxColumnCount(state);

    // When in tile view mode, we must discount ourselves (the local participant) because our
    // tile is not visible.
    const { iAmRecorder } = state['features/base/config'];
    const numberOfParticipants = state['features/base/participants'].length - (iAmRecorder ? 1 : 0);

    const columnsToMaintainASquare = Math.ceil(Math.sqrt(numberOfParticipants));
    const columns = Math.min(columnsToMaintainASquare, maxColumns);
    const rows = Math.ceil(numberOfParticipants / columns);
    const visibleRows = Math.min(maxColumns, rows);

    return {
        columns,
        visibleRows
    };
}

/**
 * Selector for determining if the UI layout should be in tile view. Tile view
 * is determined by more than just having the tile view setting enabled, as
 * one-on-one calls should not be in tile view, as well as etherpad editing.
 *
 * @param {Object} state - The redux state.
 * @returns {boolean} True if tile view should be displayed.
 */
export function shouldDisplayTileView(state: Object = {}) {
    return Boolean(
        state['features/video-layout']
            && state['features/video-layout'].tileViewEnabled
            && (!state['features/etherpad']
                || !state['features/etherpad'].editing)

            // Truthy check is needed for interfaceConfig to prevent errors on
            // mobile which does not have interfaceConfig. On web, tile view
            // should never be enabled for filmstrip only mode.
            && (typeof interfaceConfig === 'undefined'
                || !interfaceConfig.filmStripOnly)
            && !getPinnedParticipant(state)
    );
}


/**
 * UpdatePage.
 *
 * @param {number} participantsCount - The redux state.
 * @returns {number} True if tile view should be displayed.
 */
export function updatePage(participantsCount: number) {
    const expectedPage = calculateNumberOfPages(participantsCount);

    const { page } = APP.store.getState()['features/filmstrip'];

    if (page <= expectedPage) {
        return;
    }


    APP.store.dispatch(setPage(expectedPage));
}

/**
 * CalculateNumberOfPages.
 *
 * @param {number} participantsCount - The redux state.
 * @returns {number} True if tile view should be displayed.
 */
export function calculateNumberOfPages(participantsCount: number) {
    const perPage = window.interfaceConfig.TILE_VIEW_MAX_COLUMNS * window.interfaceConfig.TILE_VIEW_MAX_COLUMNS;
    const pages = Math.floor(participantsCount / perPage);

    if ((participantsCount % perPage) > 0) {
        return pages + 1;
    }

    if (pages <= 0) {
        return 1;
    }

    return pages;
}


/**
 * ShowPagination.
 *
 * @returns {boolean} True if to show pagination.
 */
export function showPagination() {
    return interfaceConfig.SHOW_VIDEO_PAGINATION;
}
