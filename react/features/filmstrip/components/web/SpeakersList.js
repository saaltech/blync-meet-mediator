/* @flow */

import React, { Component } from 'react';
import type { Dispatch } from 'redux';

import { setShowSpeakersList } from '../../';
import { getParticipants } from '../../../base/participants/functions';
import { connect } from '../../../base/redux';

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

    _showSpeakersList: boolean,
     _setShowSpeakersList: Function
};

/**
 * SpeakersList react component.
 *
 * @class SpeakersList
 */
class SpeakersList extends Component<Props> {

    wrapperRef = React.createRef();

    handleClickOutside

    /**
     * Initializes the app.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    /**
     * Initializes the app.
     *
     * @inheritdoc
     */
    componentDidMount() {
        window.addEventListener('mousedown', this.handleClickOutside);
    }

    /**
     * Initializes the app.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClickOutside);
    }

    /**
     * Initializes the app.
     *
     * @inheritdoc
     */
    handleClickOutside(event) {

        if (!this.wrapperRef.current || !this.wrapperRef.current) {
            return;
        }

        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props._setShowSpeakersList(false);
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {

        const { _showSpeakersList } = this.props;

        console.log(_showSpeakersList, '_showSpeakersList_showSpeakersList');

        if (!_showSpeakersList) {
            return null;
        }

        return (
            <div
                className = { 'speakers-list speakers-list__participants' }
                ref = { this.wrapperRef }>
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
    const { showSpeakersList } = state['features/filmstrip'];

    return {
        _participants: getParticipants(state),
        _showSpeakersList: showSpeakersList
    };
}

export default connect(_mapStateToProps, _mapDispatchToProps)(SpeakersList);
