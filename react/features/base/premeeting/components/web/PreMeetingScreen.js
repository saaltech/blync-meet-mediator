// @flow

import React, { PureComponent } from 'react';

import { AudioSettingsButton, VideoSettingsButton } from '../../../../toolbox/components';

import CopyMeetingUrl from './CopyMeetingUrl';
import Preview from './Preview';
import Background from '../../../../welcome/components/background';
import { connect } from '../../../redux';
import { getCurrentConferenceUrl } from '../../../connection';
import HostPrejoin from '../../../../prejoin/components/HostPrejoin'
import GuestPrejoin from '../../../../prejoin/components/GuestPrejoin'
import {
    getQueryVariable,
    // setPrejoinVideoTrackMuted
} from '../../../../prejoin/functions';

import Loading from '../../../../always-on-top/Loading'
import { goHome } from '../../../../app-auth'

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
    
    navigatedFromHome?: boolean,

    meetNowSelected?: boolean
}

/**
 * Implements a pre-meeting screen that can be used at various pre-meeting phases, for example
 * on the prejoin screen (pre-connection) or lobby (post-connection).
 */
class PreMeetingScreen extends PureComponent<Props> {
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     */

    constructor(props) {
        super(props);
        this.state = {
            meetNow: true,
            showTrackPreviews: false,
            navigatedFromHome: undefined,
            joinMeeting: false,
            exiting: false
        };

        this.setMeetNow = this.setMeetNow.bind(this);
        this.showTrackPreviews = this.showTrackPreviews.bind(this);
    }

    componentDidMount() {
        this.setState({
            meetNow: true,
            navigatedFromHome: getQueryVariable('home') ? true: false,
            joinMeeting: getQueryVariable('join') ? true : false
        });
    }

    setMeetNow(value){
        this.setState({
            meetNow: value
        }, () => {
            // setPrejoinVideoTrackMuted(!(this.state.showTrackPreviews || this.state.meetNow));
        })
    }

    showTrackPreviews(value) {
        this.setState({
            showTrackPreviews: value
        }, () => {
            // setPrejoinVideoTrackMuted(!(this.state.showTrackPreviews || this.state.meetNow));
        })
    }

    render() {
        const { title, videoMuted, videoTrack, url, meetNowSelected } = this.props;
        const { meetNow, showTrackPreviews, navigatedFromHome, exiting, 
            joinMeeting } = this.state;
        let urlToShow = url.split('/').length > 3 ? url.split('/')[3] : title;
        let guestFlow = navigatedFromHome !== undefined && navigatedFromHome  == false
        if(guestFlow) {
            window.sessionStorage.removeItem('isJWTSet')
        }

        // This is needed to turn the prejoin video track camera light, 
        // that might be turned on with react re-render
        // setTimeout(() => setPrejoinVideoTrackMuted(!meetNow || videoMuted), 500);

        return (
            <div
                className = 'premeeting-screen'
                id = 'lobby-screen'>
                <Background backgroundColor='black'/>
                {
                    exiting && <Loading />
                }
                {
                    showTrackPreviews || meetNow ?
                    <Preview
                            videoMuted = { videoMuted }
                            videoTrack = { videoTrack } >
                        <div className = 'media-btn-container'>
                            <AudioSettingsButton visible = { true } />
                            <VideoSettingsButton visible = { true } />
                        </div>
                        { this.props.footer }
                    </Preview>
                    :
                    <div className={`hostPrejoinOptionPage ${meetNow ? 'meetNow' : 'schedule'}`}>

                    </div>
                }
                

                <div className = 'content'>
                    <div 
                        onClick={() => {
                            this.setState({exiting: true},
                            () => {
                                goHome()
                            })
                        }} 
                        className="close-icon"></div>
                    {
                        navigatedFromHome && 
                        <HostPrejoin 
                            isMeetNow={this.setMeetNow} 
                            //Show join now after page reload in case of `meet now` option
                            joinNow={meetNowSelected}
                            meetingName={urlToShow}
                            showTrackPreviews={this.showTrackPreviews}
                        />
                    }
                    {
                        guestFlow && 
                        <GuestPrejoin 
                            joinMeeting={ joinMeeting }
                            meetingId={urlToShow}
                            showTrackPreviews={this.showTrackPreviews}
                        />
                    }
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
        url: getCurrentConferenceUrl(state),
        meetNowSelected: APP.store.getState()['features/app-auth'].meetingDetails
            && APP.store.getState()['features/app-auth'].meetingDetails.meetNow
    };
}

export default connect(mapStateToProps)(PreMeetingScreen);
