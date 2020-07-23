/* @flow */

import React, { Component } from 'react';
import type { Dispatch } from 'redux';

import { setShowSpeakersList } from '../../';
import { getConferenceName } from '../../../base/conference/functions';
import { getParticipantCount, getParticipants } from '../../../base/participants/functions';
import { connect } from '../../../base/redux';
import { isToolboxVisible } from '../../../toolbox';
import ParticipantsStats from '../web/ParticipantsStats';

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

    _showSpeakersList: boolean,
     _setShowSpeakersList: Function
};

/**
 * SpeakersList react component.
 *
 * @class SpeakersList
 */
class SpeakersList extends Component<Props> {


    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _show, _showSpeakersList } = this.props;

        if (!_show) {
            return null;
        }

        return (
            <div className = { `speakers-list speakers-list__participants ${_showSpeakersList ? 'speakers-list--visible' : ''}` }>
                <div className = 'speakers-list__participants-title'>Speaker</div>
                <ParticipantsStats />
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
    const { showSpeakersList } = state['features/filmstrip'];

    return {
        _show: participantCount > 1,
        _subject: getConferenceName(state),
        _participantCount: participantCount,
        _visible: isToolboxVisible(state) && participantCount > 1,
        _participants: getParticipants(state),
        _showSpeakersList: showSpeakersList
    };
}

export default connect(_mapStateToProps, _mapDispatchToProps)(SpeakersList);
