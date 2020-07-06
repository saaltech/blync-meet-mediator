/* @flow */

import React, { Component } from 'react';
import Popup from 'reactjs-popup';

import { getConferenceName } from '../../../base/conference/functions';
import { Icon, IconArrowDownSmall } from '../../../base/icons';
import { getParticipantCount, getParticipants } from '../../../base/participants/functions';
import { connect } from '../../../base/redux';
import ConferenceTimer from '../../../conference/components/ConferenceTimer';
import { isToolboxVisible } from '../../../toolbox';

import ParticipantsStats from './ParticipantsStats';

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
};

/**
 * FilmstripHeader react component.
 *
 * @class FilmstripHeader
 */
class FilmstripHeader extends Component<Props> {

    /**
     * Render participant trigger.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    _renderParticipantsTrigger() {
        return (<button
            className = 'film-strip-header__action-button'
            type = 'button'>
            <Icon
                size = { 16 }
                src = { IconArrowDownSmall } />
        </button>);
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
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _subject, _visible, _show } = this.props;

        if (!_show) {
            return null;
        }

        return (
            <div className = { `film-strip-header ${_visible ? 'visible' : ''}` }>
                <div className = 'film-strip-header__container'>
                    <div className = 'film-strip-header__title'>
                        <span className = 'film-strip-header__title-text'>{ _subject }</span>
                        <ConferenceTimer />
                    </div>
                    <div className = 'film-strip-header__actions'>
                        <div className = 'film-strip-header__online-users'>
                            Online users ({this.props._participantCount})
                        </div>

                        <Popup
                            closeOnDocumentClick = { true }
                            contentStyle = {{
                                width: '392px',
                                minHeight: '482px',
                                top: '40px !important',
                                left: '-287.828px',
                                boxShadow: '0px 8px 15px rgba(0, 0, 0,  0.3)',
                                borderRadius: '6px',
                                border: 'none',
                                zIndex: '999',
                                overflowY: 'scroll',
                                overflowX: 'hidden',
                                height: '482px'
                            }}
                            position = 'left top'
                            trigger = { this._renderParticipantsTrigger() }>
                            {this._renderParticipantsList()}
                        </Popup>
                    </div>
                </div>
            </div>
        );
    }
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

    return {
        _show: participantCount > 1,
        _subject: getConferenceName(state),
        _participantCount: participantCount,
        _visible: isToolboxVisible(state) && participantCount > 1,
        _participants: getParticipants(state)
    };
}

export default connect(_mapStateToProps)(FilmstripHeader);
