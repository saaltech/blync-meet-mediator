/**
 * The type of (redux) action which sets whether the filmstrip is enabled.
 *
 * {
 *     type: SET_FILMSTRIP_ENABLED,
 *     enabled: boolean
 * }
 */
export const SET_FILMSTRIP_ENABLED = 'SET_FILMSTRIP_ENABLED';

/**
 * The type of (redux) action which sets whether or not the filmstrip is being
 * hovered with the cursor.
 *
 * {
 *     type: SET_FILMSTRIP_HOVERED,
 *     hovered: boolean
 * }
 */
export const SET_FILMSTRIP_HOVERED = 'SET_FILMSTRIP_HOVERED';

/**
 * The type of (redux) action which sets whether the filmstrip is visible.
 *
 * {
 *     type: SET_FILMSTRIP_VISIBLE,
 *     visible: boolean
 * }
 */
export const SET_FILMSTRIP_VISIBLE = 'SET_FILMSTRIP_VISIBLE';

/**
 * The type of (redux) action which sets the dimensions of the tile view grid.
 *
 * {
 *     type: SET_TILE_VIEW_DIMENSIONS,
 *     dimensions: {
 *         gridDimensions: {
 *             columns: number,
 *             height: number,
 *             visibleRows: number,
 *             width: number
 *         },
 *         thumbnailSize: {
 *             height: number,
 *             width: number
 *         },
 *         filmstripWidth: number
 *     }
 * }
 */
export const SET_TILE_VIEW_DIMENSIONS = 'SET_TILE_VIEW_DIMENSIONS';

/**
 * The type of (redux) action which sets the dimensions of the thumbnails in horizontal view.
 *
 * {
 *     type: SET_HORIZONTAL_VIEW_DIMENSIONS,
 *     dimensions: Object
 * }
 */
export const SET_HORIZONTAL_VIEW_DIMENSIONS = 'SET_HORIZONTAL_VIEW_DIMENSIONS';


export const SET_FILMSTRIP_COLLAPSED = 'SET_FILMSTRIP_COLLAPSED';


export const SET_SHOW_SPEAKERS_LIST = 'SET_SHOW_SPEAKERS_LIST';


export const SET_PAGE = 'SET_PAGE';
