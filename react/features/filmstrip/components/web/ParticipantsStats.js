// @flow

import React, { Component } from 'react';

import { Avatar } from '../../../base/avatar';
import { translate } from '../../../base/i18n';
import { getLocalParticipant } from '../../../base/participants';
import { connect } from '../../../base/redux';
import TimeElapsed from '../../../speaker-stats/components/TimeElapsed';

declare var interfaceConfig: Object;

/**
 * The type of the React {@code Component} props of {@link SpeakerStats}.
 */
type Props = {

    /**
     * The display name for the local participant obtained from the redux store.
     */
    _localDisplayName: string,

    /**
     * The JitsiConference from which stats will be pulled.
     */
    _conference: Object,

    /**
     * The function to translate human-readable text.
     */
    t: Function
};

/**
 * The type of the React {@code Component} state of {@link SpeakerStats}.
 */
type State = {

    /**
     * The stats summary provided by the JitsiConference.
     */
    stats: Object
};

/**
 * React component for displaying a list of speaker stats.
 *
 * @extends Component
 */
class ParticipantsStats extends Component<Props, State> {
    _updateInterval: IntervalID;

    /**
     * Initializes a new SpeakerStats instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this.state = {
            stats: this.props._conference.getSpeakerStats()
        };

        // Bind event handlers so they are only bound once per instance.
        this._updateStats = this._updateStats.bind(this);
    }

    /**
     * Begin polling for speaker stats updates.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._updateInterval = setInterval(this._updateStats, 1000);
    }

    /**
     * Stop polling for speaker stats updates.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        clearInterval(this._updateInterval);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    _renderStatItem(userId) {

        const statsModel = this.state.stats[userId];

        if (!statsModel) {
            return null;
        }

        const dominantSpeakerTime = statsModel.getTotalDominantSpeakerTime();

        let displayName;

        if (statsModel.isLocalStats()) {
            const { t } = this.props;
            const meString = t('me');

            displayName = this.props._localDisplayName;
            displayName
                = displayName ? `${displayName} (${meString})` : meString;
        } else {
            displayName
                = this.state.stats[userId].getDisplayName()
                    || interfaceConfig.DEFAULT_REMOTE_DISPLAY_NAME;
        }

        return (
            <tr key = { userId }>
                <td>
                    <div className = 'film-strip-header__participant'>
                        <Avatar
                            opacity = { 1 }
                            participantId = { userId } />

                        <span className = 'film-strip-header__participant-name'>
                            {displayName}
                        </span>
                    </div>
                </td>
                <td>
                    <TimeElapsed
                        time = { dominantSpeakerTime } />
                </td>
            </tr>
        );
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const userIds = Object.keys(this.state.stats);
        const items = userIds.map(userId => this._renderStatItem(userId));

        return (
            <table className = 'film-strip-header__participants-list'>
                <tbody>
                    <tr>
                        <th>
                        Participants ({userIds.length})
                        </th>
                        <th>
                        Speaker Time
                        </th>
                    </tr>
                    { items}

                </tbody>

            </table>
        );
    }

    _updateStats: () => void;

    /**
     * Update the internal state with the latest speaker stats.
     *
     * @returns {void}
     * @private
     */
    _updateStats() {
        const stats = this.props._conference.getSpeakerStats();

        this.setState({ stats });
    }
}

/**
 * Maps (parts of) the redux state to the associated SpeakerStats's props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {{
 *     _localDisplayName: ?string
 * }}
 */
function _mapStateToProps(state) {
    const localParticipant = getLocalParticipant(state);

    return {
        /**
         * The local display name.
         *
         * @private
         * @type {string|undefined}
         */
        _localDisplayName: localParticipant && localParticipant.name,
        _conference: state['features/base/conference'].conference
    };
}

export default translate(connect(_mapStateToProps)(ParticipantsStats));
