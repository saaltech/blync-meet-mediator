// @flow

import React, { PureComponent } from 'react';

import { AudioSettingsButton, VideoSettingsButton } from '../../../../toolbox';

import CopyMeetingUrl from './CopyMeetingUrl';
import Preview from './Preview';
import Background from '../../../../welcome/components/background';
import { connect } from '../../../redux';
import { getCurrentConferenceUrl } from '../../../connection';
import HostPrejoin from '../../../../prejoin/components/HostPrejoin'

type Props = {

    /**
     * Children component(s) to be rendered on the screen.
     */
    children: React$Node,

    /**
     * Footer to be rendered for the page (if any).
     */
    footer?: React$Node,

    /**
     * Title of the screen.
     */
    title: string,

    /**
     * True if the preview overlay should be muted, false otherwise.
     */
    videoMuted?: boolean,

    /**
     * The video track to render as preview (if omitted, the default local track will be rendered).
     */
    videoTrack?: Object,
    
    navigatedFromHome?: boolean
}

/**
 * Implements a pre-meeting screen that can be used at various pre-meeting phases, for example
 * on the prejoin screen (pre-connection) or lobby (post-connection).
 */
class PostWelcomePageScreen extends PureComponent<Props> {
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     */

    constructor(props) {
        super(props);
        this.state = {
            meetNow: true,
            showTrackPreviews: false
        };

        this.setMeetNow = this.setMeetNow.bind(this);
        this.showTrackPreviews = this.showTrackPreviews.bind(this);
    }

    componentDidMount() {
        this.setState({
            meetNow: true
        });
    }

    setMeetNow(value){
        this.setState({
            meetNow: value
        })
    }

    showTrackPreviews(value) {
        this.setState({
            showTrackPreviews: value
        })
    }

    render() {
        const { navigatedFromHome, meetingRoom } = this.props;
        const { meetNow, showTrackPreviews } = this.state;

        return (
            <div
                className = 'premeeting-screen'>
                <Background backgroundColor='black'/>
                <div className={`hostPrejoinOptionPage ${meetNow ? 'meetNow' : 'schedule'}`}>
                </div>
                
                <div className = 'content'>
                    <a href="/" className="close-icon"></a>
                    <HostPrejoin 
                        isMeetNow={this.setMeetNow} 
                        meetingRoom={meetingRoom}
                        showTrackPreviews={this.showTrackPreviews}
                        onJoin={this.props.onJoin}
                    />
                </div>
            </div>
        );
    }
}

/**
 * Maps (parts of) the redux state to the React {@code Component} props.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */
function mapStateToProps(state) {
    return {
        url: getCurrentConferenceUrl(state)
    };
}

export default connect(mapStateToProps)(PostWelcomePageScreen);
