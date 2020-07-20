/* @flow */
/* global APP */

import React, { Component } from 'react';
import type { Dispatch } from 'redux';

import { setShowSpeakersList } from '../..';
import { Icon, IconFilm } from '../../../base/icons';
import { PARTICIPANT_ROLE } from '../../../base/participants';
import { getParticipantCount, getParticipants, getLocalParticipant } from '../../../base/participants/functions';
import { connect } from '../../../base/redux';
import ConferenceTimer from '../../../conference/components/ConferenceTimer';
import { isToolboxVisible } from '../../../toolbox';
import { getCurrentLayout, LAYOUTS } from '../../../video-layout';
import { setFilmStripCollapsed } from '../../actions';

import ParticipantsStats from './ParticipantsStats';

// import { getConferenceName } from '../../../base/conference/functions';
// import { Icon, IconArrowDownSmall } from '../../../base/icons';

/**
 * The type of the React {@code Component} props of {@link Subject}.
 */
type Props = {

    /**
     * Whether then participant count should be shown or not.
     */
    _show: boolean,

    /**
     * The subject or the of the conference.
     * Falls back to conference name.
     */
    _subject: string,

    /**
     * Indicates whether the component should be visible or not.
     */
    _visible: boolean,

    _participantCount: number,

    _participants: Array<Object>,

    _setShowSpeakersList: Function,

    _showSpeakersList: boolean,

    _isModerator: boolean,

    _filmStripCollapsed: boolean,

    _showFilmstripSwitcher: boolean,
};

/**
 * FilmstripHeader react component.
 *
 * @class FilmstripHeader
 */
class FilmstripHeader extends Component<Props> {

    _onToggleCollapseFilmstrip: Function;

    /**
     * Initializes a new {@code Filmstrip} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);
        this._onToggleCollapseFilmstrip = this._onToggleCollapseFilmstrip.bind(this);
    }

    /**
     * Render participants list.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    _renderParticipantsList() {

        return (<div className = 'film-strip-header__participants'>
            <div className = 'film-strip-header__participants-title'>Speaker</div>

            <ParticipantsStats />
        </div>);
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
        APP.store.dispatch(setFilmStripCollapsed(!this.props._filmStripCollapsed));
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            _subject,
            _visible,
            _show,
            _filmStripCollapsed,
            _showFilmstripSwitcher

            // _showSpeakersList
        } = this.props;

        if (!_show) {
            return null;
        }

        return (
            <div className = { `film-strip-header ${_visible ? 'film-strip-header--visible' : ''}` }>
                <div className = 'film-strip-header__container'>
                    <div>
                        {_showFilmstripSwitcher && <button
                            className = { `film-strip-header__control-btn 
                                ${_filmStripCollapsed ? 'film-strip-header__control-btn--selected' : ''}
                            ` }
                            onClick = { this._onToggleCollapseFilmstrip }>
                            <Icon src = { IconFilm } />
                            {_filmStripCollapsed ? 'Show' : 'Hide'}
                        </button>}
                    </div>
                    <div className = 'film-strip-header__title'>
                        <span className = 'film-strip-header__title-text'>{ _subject }</span>
                        <ConferenceTimer />
                    </div>
                    <div className = 'film-strip-header__actions'>
                        <div className = 'film-strip-header__online-users'>
                            Online users ({this.props._participantCount})
                        </div>

                        {/* {this.props._isModerator && <button
                            className = 'film-strip-header__action-button'
                            onClick = { () => this.props._setShowSpeakersList(!_showSpeakersList) }
                            type = 'button'>
                            <Icon
                                size = { 16 }
                                src = { IconArrowDownSmall } />
                        </button>} */}
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * Maps dispatching of some action to React component props.
 *
 * @param {Function} dispatch - Redux action dispatcher.
 * @private
 * @returns {{
    *     _onUnmount: Function
    * }}
    */
function _mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        _setShowSpeakersList(visible) {
            dispatch(setShowSpeakersList(visible));
        }
    };
}


/**
 * Maps (parts of) the Redux state to the associated
 * {@code Subject}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _subject: string,
 *     _visible: boolean
 * }}
 */
function _mapStateToProps(state) {
    const participantCount = getParticipantCount(state);
    const { showSpeakersList, collapsed } = state['features/filmstrip'];
    const isModerator = getLocalParticipant(state).role === PARTICIPANT_ROLE.MODERATOR;
    const currLayout = getCurrentLayout(state);

    return {
        // _show: participantCount > 1,
        _show: true,
        _subject: state['features/app-auth'].meetingDetails?.meetingName,
        _participantCount: participantCount,
        _visible: isToolboxVisible(state) && participantCount > 1,
        _participants: getParticipants(state),
        _showSpeakersList: showSpeakersList,
        _isModerator: isModerator,
        _filmStripCollapsed: collapsed,
        _showFilmstripSwitcher: currLayout === LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW
    };
}

export default connect(_mapStateToProps, _mapDispatchToProps)(FilmstripHeader);
