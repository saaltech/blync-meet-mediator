/* @flow */

import React, { PureComponent } from 'react';
import { FixedSizeList, FixedSizeGrid } from 'react-window';
import type { Dispatch } from 'redux';

import {
    createShortcutEvent,
    createToolbarEvent,
    sendAnalytics
} from '../../../analytics';
import { getToolbarButtons } from '../../../base/config';
import { translate } from '../../../base/i18n';
import { Icon, IconMenuDown, IconMenuUp } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { dockToolbox } from '../../../toolbox/actions.web';
import { setFilmstripHovered, setFilmstripVisible, setFilmStripCollapsed } from '../../actions';
import { showToolbox } from '../../../toolbox/actions.web';
import { isButtonEnabled, isToolboxVisible } from '../../../toolbox/functions.web';
import { LAYOUTS, getCurrentLayout } from '../../../video-layout';

import FilmstripHeader from './FilmstripHeader';
import Toolbar from './Toolbar';
import { setFilmstripVisible, setVisibleRemoteParticipants } from '../../actions';
import { TILE_HORIZONTAL_MARGIN, TILE_VERTICAL_MARGIN, TOOLBAR_HEIGHT } from '../../constants';
import { shouldRemoteVideosBeVisible } from '../../functions';

import AudioTracksContainer from './AudioTracksContainer';
import Thumbnail from './Thumbnail';
import ThumbnailWrapper from './ThumbnailWrapper';

declare var APP: Object;
declare var interfaceConfig: Object;

/**
 * The type of the React {@code Component} props of {@link Filmstrip}.
 */
type Props = {

    /**
     * Additional CSS class names top add to the root.
     */
    _className: string,

    /**
     * The current layout of the filmstrip.
     */
    _currentLayout: string,

    /**
     * The number of columns in tile view.
     */
    _columns: number,

    /**
     * Whether the UI/UX is filmstrip-only.
     */
    _filmstripOnly: boolean,

    /**
     * The width of the filmstrip.
     */
    _filmstripWidth: number,

    /**
     * The height of the filmstrip.
     */
    _filmstripHeight: number,

    /**
     * Whether the filmstrip button is enabled.
     */
    _isFilmstripButtonEnabled: boolean,

    /**
     * The participants in the call.
     */
    _remoteParticipants: Array<Object>,

    /**
     * The length of the remote participants array.
     */
    _remoteParticipantsLength: number,

    /**
     * The number of rows in tile view.
     */
    _rows: number,

    /**
     * The height of the thumbnail.
     */
    _thumbnailHeight: number,

    /**
     * The width of the thumbnail.
     */
    _thumbnailWidth: number,

    /**
     * Additional CSS class names to add to the container of all the thumbnails.
     */
    _videosClassName: string,

    /**
     * Whether or not the filmstrip videos should currently be displayed.
     */
    _visible: boolean,

    _collapsed: Boolean,

    /**
     * Whether or not the toolbox is displayed.
     */
    _isToolboxVisible: Boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Dispatch<any>,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function,

    _onToggleCollapseFilmstrip: Function,
};

/**
 * Implements a React {@link Component} which represents the filmstrip on
 * Web/React.
 *
 * @extends Component
 */
class Filmstrip extends PureComponent <Props> {

    _onToggleCollapseFilmstrip: Function;

    /**
     * Initializes a new {@code Filmstrip} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once for every instance.
        this._onShortcutToggleFilmstrip = this._onShortcutToggleFilmstrip.bind(this);
        this._onToolbarToggleFilmstrip = this._onToolbarToggleFilmstrip.bind(this);
        this._onToggleCollapseFilmstrip = this._onToggleCollapseFilmstrip.bind(this);
        this._onTabIn = this._onTabIn.bind(this);
        this._gridItemKey = this._gridItemKey.bind(this);
        this._listItemKey = this._listItemKey.bind(this);
        this._onGridItemsRendered = this._onGridItemsRendered.bind(this);
        this._onListItemsRendered = this._onListItemsRendered.bind(this);
    }

    /**
     * Implements React's {@link Component#componentDidMount}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        if (!this.props._filmstripOnly) {
            APP.keyboardshortcut.registerShortcut(
                'F',
                'filmstripPopover',
                this._onShortcutToggleFilmstrip,
                'keyboardShortcuts.toggleFilmstrip'
            );
        }
    }

    /**
     * Implements React's {@link Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        APP.keyboardshortcut.unregisterShortcut('F');
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const filmstripStyle = { };
        const { _currentLayout } = this.props;
        const tileViewActive = _currentLayout === LAYOUTS.TILE_VIEW;

        switch (_currentLayout) {
        case LAYOUTS.VERTICAL_FILMSTRIP_VIEW:
            // Adding 18px for the 2px margins, 2px borders on the left and right and 5px padding on the left and right.
            // Also adding 7px for the scrollbar.
            filmstripStyle.maxWidth = (interfaceConfig.FILM_STRIP_MAX_HEIGHT || 120) + 25;
            break;
        }

        let toolbar = null;

        if (!this.props._hideToolbar) {
            toolbar = this.props._filmstripOnly ? <Toolbar /> : this._renderToggleButton();
        }

        return (

            <div
                className = { `filmstrip ${this.props._className}` }
                style = { filmstripStyle }>
                <FilmstripHeader />
                { toolbar }
                <div
                    className = { this.props._videosClassName }
                    id = 'remoteVideos'>

                    <div className = { `filmstrip__videos-container ${this.props._collapsed ? 'filmstrip__videos-container--collapsed' : ''}` }>
                        {/* <div className = 'filmstrip__actions'>
                            <button
                                className = 'filmstrip__collapse-btn'
                                onClick = { this._onToggleCollapseFilmstrip }
                                type = 'button'>
                                <Icon src = { IconArrowLeft } />
                            </button>
                        </div> */}

                        <div className = { 'filmstrip__strip-holder' }>
                            <div
                                className = 'filmstrip__videos'
                                id = 'filmstripLocalVideo'
                                onMouseOut = { this._onMouseOut }
                                onMouseOver = { this._onMouseOver }>
                                <div id = 'filmstripLocalVideoThumbnail' />
                            </div>
                            <div
                                className = { remoteVideosWrapperClassName }
                                id = 'filmstripRemoteVideos'>
                                {/*
                          * XXX This extra video container is needed for
                          * scrolling thumbnails in Firefox; otherwise, the flex
                          * thumbnails resize instead of causing overflow.
                          */}
                                <div
                                    className = { remoteVideoContainerClassName }
                                    id = 'filmstripRemoteVideosContainer'
                                    onMouseOut = { this._onMouseOut }
                                    onMouseOver = { this._onMouseOver }
                                    style = { filmstripRemoteVideosContainerStyle }>
                                    <div id = 'localVideoTileViewContainer' />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <AudioTracksContainer />
            </div>
        );
    }

    _onTabIn: () => void;

    /**
     * Toggle the toolbar visibility when tabbing into it.
     *
     * @returns {void}
     */
    _onTabIn() {
        if (!this.props._isToolboxVisible && this.props._visible) {
            this.props.dispatch(showToolbox());
        }
    }

    _listItemKey: number => string;

    /**
     * The key to be used for every ThumbnailWrapper element in stage view.
     *
     * @param {number} index - The index of the ThumbnailWrapper instance.
     * @returns {string} - The key.
     */
    _listItemKey(index) {
        const { _remoteParticipants, _remoteParticipantsLength } = this.props;

        if (typeof index !== 'number' || _remoteParticipantsLength <= index) {
            return `empty-${index}`;
        }

        return _remoteParticipants[index];
    }

    _gridItemKey: Object => string;

    /**
     * The key to be used for every ThumbnailWrapper element in tile views.
     *
     * @param {Object} data - An object with the indexes identifying the ThumbnailWrapper instance.
     * @returns {string} - The key.
     */
    _gridItemKey({ columnIndex, rowIndex }) {
        const { _columns, _remoteParticipants, _remoteParticipantsLength } = this.props;
        const index = (rowIndex * _columns) + columnIndex;

        if (index > _remoteParticipantsLength) {
            return `empty-${index}`;
        }

        if (index === _remoteParticipantsLength) {
            return 'local';
        }

        return _remoteParticipants[index];
    }

    _onListItemsRendered: Object => void;

    /**
     * Handles items rendered changes in stage view.
     *
     * @param {Object} data - Information about the rendered items.
     * @returns {void}
     */
    _onListItemsRendered({ overscanStartIndex, overscanStopIndex }) {
        const { dispatch } = this.props;

        dispatch(setVisibleRemoteParticipants(overscanStartIndex, overscanStopIndex));
    }

    _onGridItemsRendered: Object => void;

    /**
     * Handles items rendered changes in tile view.
     *
     * @param {Object} data - Information about the rendered items.
     * @returns {void}
     */
    _onGridItemsRendered({
        overscanColumnStartIndex,
        overscanColumnStopIndex,
        overscanRowStartIndex,
        overscanRowStopIndex
    }) {
        const { _columns, dispatch } = this.props;
        const startIndex = (overscanRowStartIndex * _columns) + overscanColumnStartIndex;
        const endIndex = (overscanRowStopIndex * _columns) + overscanColumnStopIndex;

        dispatch(setVisibleRemoteParticipants(startIndex, endIndex));
    }

    /**
     * Renders the thumbnails for remote participants.
     *
     * @returns {ReactElement}
     */
    _renderRemoteParticipants() {
        const {
            _columns,
            _currentLayout,
            _filmstripHeight,
            _filmstripWidth,
            _remoteParticipantsLength,
            _rows,
            _thumbnailHeight,
            _thumbnailWidth
        } = this.props;

        if (!_thumbnailWidth || isNaN(_thumbnailWidth) || !_thumbnailHeight
            || isNaN(_thumbnailHeight) || !_filmstripHeight || isNaN(_filmstripHeight) || !_filmstripWidth
            || isNaN(_filmstripWidth)) {
            return null;
        }

        if (_currentLayout === LAYOUTS.TILE_VIEW) {
            return (
                <FixedSizeGrid
                    className = 'filmstrip__videos remote-videos'
                    columnCount = { _columns }
                    columnWidth = { _thumbnailWidth + TILE_HORIZONTAL_MARGIN }
                    height = { _filmstripHeight }
                    initialScrollLeft = { 0 }
                    initialScrollTop = { 0 }
                    itemKey = { this._gridItemKey }
                    onItemsRendered = { this._onGridItemsRendered }
                    rowCount = { _rows }
                    rowHeight = { _thumbnailHeight + TILE_VERTICAL_MARGIN }
                    width = { _filmstripWidth }>
                    {
                        ThumbnailWrapper
                    }
                </FixedSizeGrid>
            );
        }


        const props = {
            itemCount: _remoteParticipantsLength,
            className: 'filmstrip__videos remote-videos',
            height: _filmstripHeight,
            itemKey: this._listItemKey,
            itemSize: 0,
            onItemsRendered: this._onListItemsRendered,
            width: _filmstripWidth,
            style: {
                willChange: 'auto'
            }
        };

        if (_currentLayout === LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW) {
            const itemSize = _thumbnailWidth + TILE_HORIZONTAL_MARGIN;
            const isNotOverflowing = (_remoteParticipantsLength * itemSize) <= _filmstripWidth;

            props.itemSize = itemSize;

            // $FlowFixMe
            props.layout = 'horizontal';
            if (isNotOverflowing) {
                props.className += ' is-not-overflowing';
            }

        } else if (_currentLayout === LAYOUTS.VERTICAL_FILMSTRIP_VIEW) {
            const itemSize = _thumbnailHeight + TILE_VERTICAL_MARGIN;
            const isNotOverflowing = (_remoteParticipantsLength * itemSize) <= _filmstripHeight;

            if (isNotOverflowing) {
                props.className += ' is-not-overflowing';
            }

            props.itemSize = itemSize;
        }

        return (
            <FixedSizeList { ...props }>
                {
                    ThumbnailWrapper
                }
            </FixedSizeList>
        );
    }

    /**
     * Dispatches an action to change the visibility of the filmstrip.
     *
     * @private
     * @returns {void}
     */
    _doToggleFilmstrip() {
        this.props.dispatch(setFilmstripVisible(!this.props._visible));
    }


    /**
     * Dispatches an action to change the collapse state of the filmstrip.
     *
     * @param {Object} e - The event object.
     *
     * @returns {void}
     */
    _onToggleCollapseFilmstrip(e) {
        e.preventDefault();
        this.props.dispatch(setFilmStripCollapsed(!this.props._collapsed));
    }

    /**
     * If the current hover state does not match the known hover state in redux,
     * dispatch an action to update the known hover state in redux.
     *
     * @private
     * @returns {void}
     */
    _notifyOfHoveredStateUpdate() {
        if (this.props._hovered !== this._isHovered) {
            this.props.dispatch(dockToolbox(this._isHovered));
            this.props.dispatch(setFilmstripHovered(this._isHovered));
        }
    }

    /**
     * Updates the currently known mouseover state and attempt to dispatch an
     * update of the known hover state in redux.
     *
     * @private
     * @returns {void}
     */
    _onMouseOut() {
        this._isHovered = false;
        this._notifyOfHoveredStateUpdate();
    }

    /**
     * Updates the currently known mouseover state and attempt to dispatch an
     * update of the known hover state in redux.
     *
     * @private
     * @returns {void}
     */
    _onMouseOver() {
        this._isHovered = true;
        this._notifyOfHoveredStateUpdate();
    }

    _onShortcutToggleFilmstrip: () => void;

    /**
     * Creates an analytics keyboard shortcut event and dispatches an action for
     * toggling filmstrip visibility.
     *
     * @private
     * @returns {void}
     */
    _onShortcutToggleFilmstrip() {
        sendAnalytics(createShortcutEvent(
            'toggle.filmstrip',
            {
                enable: this.props._visible
            }));

        this._doToggleFilmstrip();
    }

    _onToolbarToggleFilmstrip: () => void;

    /**
     * Creates an analytics toolbar event and dispatches an action for opening
     * the speaker stats modal.
     *
     * @private
     * @returns {void}
     */
    _onToolbarToggleFilmstrip() {
        sendAnalytics(createToolbarEvent(
            'toggle.filmstrip.button',
            {
                enable: this.props._visible
            }));

        this._doToggleFilmstrip();
    }

    /**
     * Creates a React Element for changing the visibility of the filmstrip when
     * clicked.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderToggleButton() {
        const icon = this.props._visible ? IconMenuDown : IconMenuUp;
        const { t } = this.props;

        return (
            <div
                className = 'filmstrip__toolbar'>
                <button
                    aria-expanded = { this.props._visible }
                    aria-label = { t('toolbar.accessibilityLabel.toggleFilmstrip') }
                    id = 'toggleFilmstripButton'
                    onClick = { this._onToolbarToggleFilmstrip }
                    onFocus = { this._onTabIn }
                    tabIndex = { 0 }>
                    <Icon
                        aria-label = { t('toolbar.accessibilityLabel.toggleFilmstrip') }
                        src = { icon } />
                </button>
            </div>
        );
    }
}

/**
 * Maps (parts of) the Redux state to the associated {@code Filmstrip}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const { iAmSipGateway } = state['features/base/config'];
    const { hovered, visible, collapsed } = state['features/filmstrip'];
    const isFilmstripOnly = Boolean(interfaceConfig.filmStripOnly);
    const reduceHeight
        = !isFilmstripOnly && state['features/toolbox'].visible && interfaceConfig.TOOLBAR_BUTTONS.length;
    const remoteVideosVisible = shouldRemoteVideosBeVisible(state);
    const className = `${remoteVideosVisible ? '' : 'hide-videos'} ${reduceHeight ? 'reduce-height' : ''}`.trim();
    const videosClassName = `filmstrip__videos${
        isFilmstripOnly ? ' filmstrip__videos-filmstripOnly' : ''}${
        visible ? '' : ' hidden'}`;
    const { gridDimensions = {}, filmstripWidth } = state['features/filmstrip'].tileViewDimensions;


    return {
        _className: className,
        _columns: gridDimensions.columns,
        _currentLayout: getCurrentLayout(state),
        _filmstripOnly: isFilmstripOnly,
        _filmstripWidth: filmstripWidth,
        _hideScrollbar: Boolean(iAmSipGateway),
        _hideToolbar: Boolean(iAmSipGateway),
        _isFilmstripButtonEnabled: isButtonEnabled('filmstrip', state),
        _remoteParticipantsLength: remoteParticipants.length,
        _remoteParticipants: remoteParticipants,
        _rows: gridDimensions.rows,
        _thumbnailWidth: _thumbnailSize?.width,
        _thumbnailHeight: _thumbnailSize?.height,
        _videosClassName: videosClassName,
        _visible: visible,
        _collapsed: collapsed,
        _isToolboxVisible: isToolboxVisible(state)
    };
}

export default translate(connect(_mapStateToProps)(Filmstrip));
