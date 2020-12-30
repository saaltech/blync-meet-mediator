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
import LeftPanel from '../../../leftPanel';
import { redirectOnButtonChange } from '../../../../welcome/functions';

import Loading from '../../../../always-on-top/Loading'
import { goHome } from '../../../../app-auth'
import {
    setVideoMuted
} from '../../../../base/media';

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
            exiting: false,
            activeButton: 'join',
            actions: 'meetNow'
        };

        this.setMeetNow = this.setMeetNow.bind(this);
        this.showTrackPreviews = this.showTrackPreviews.bind(this);
    }

    componentDidMount() {
        this.setState({
            meetNow: true,
            navigatedFromHome: getQueryVariable('home') ? true : false,
            actions: getQueryVariable('actions') ? getQueryVariable('actions') : '',
            joinMeeting: getQueryVariable('join') ? true : false
        });
        const activeButtonAction = getQueryVariable('actions');
        if (activeButtonAction) {
            this.setState({ activeButton: 'create' });
        } else {
            this.setState({ activeButton: 'join' });
        }
    }

    handleRouteChange(value) {
        redirectOnButtonChange(value);
    }

    setMeetNow(value) {
        this.setState({
            meetNow: value
        }, () => {
            APP.store.dispatch(setVideoMuted(!(this.state.showTrackPreviews)))
        })
    }

    showTrackPreviews(value) {
        this.setState({
            showTrackPreviews: value
        }, () => {
            // APP.store.dispatch(setVideoMuted(!(this.state.showTrackPreviews || this.state.meetNow)))
        })
    }

    render() {
        const { title, videoMuted, videoTrack, url, meetNowSelected } = this.props;
        const { meetNow, showTrackPreviews, navigatedFromHome, exiting,
            joinMeeting } = this.state;
        let urlToShow = url.split('/').length > 3 ? url.split('/')[3] : title;
        let guestFlow = navigatedFromHome !== undefined && navigatedFromHome == false
        if (guestFlow) {
            window.sessionStorage.removeItem('isJWTSet')
        }

        // This is needed to turn the prejoin video track camera light, 
        // that might be turned on with react re-render
        // setTimeout(() => setPrejoinVideoTrackMuted(!meetNow || videoMuted), 500);

        return (
            <div className="premeeting-wrapper">
                {
                    exiting && <Loading />
                }
                <LeftPanel
                    activeButton={this.state.activeButton}
                    setActiveButton={this.handleRouteChange} />
                <div
                    className='premeeting-screen'
                    id='lobby-screen'>
                    {/* <Background backgroundColor='black'/> */}

                    <div style={{ height: '100%' }}>
                        {/* {
                        showTrackPreviews || meetNow ?
                            <Preview
                                videoMuted={videoMuted}
                                videoTrack={videoTrack} >
                                <div className='media-btn-container'>
                                    <AudioSettingsButton visible={true} />
                                    <VideoSettingsButton visible={true} />
                                </div>
                                {this.props.footer}
                            </Preview>
                            :
                            <div className={`hostPrejoinOptionPage ${meetNow ? 'meetNow' : 'schedule'}`}>

                            </div>
                    }
 */}

                        <div className='content'>
                            {
                                navigatedFromHome &&
                                <HostPrejoin
                                    isMeetNow={this.setMeetNow}
                                    onClickClose={() => {
                                        this.setState({ exiting: true },
                                            () => {
                                                goHome()
                                            })
                                    }}
                                    //Show join now after page reload in case of `meet now` option
                                    joinNow={meetNowSelected}
                                    meetingName={urlToShow}
                                    videoMuted={videoMuted}
                                    videoTrack={videoTrack}
                                    actions={this.state.actions}
                                    previewFooter={this.props.footer}
                                    showTrackPreviews={this.showTrackPreviews}
                                />
                            }
                            {
                                guestFlow &&
                                <GuestPrejoin
                                    joinMeeting={joinMeeting}
                                    videoMuted={videoMuted}
                                    videoTrack={videoTrack}
                                    onClickClose={() => {
                                        this.setState({ exiting: true },
                                            () => {
                                                goHome()
                                            })
                                    }}
                                    previewFooter={this.props.footer}
                                    meetingId={urlToShow}
                                    showTrackPreviews={this.showTrackPreviews}
                                />
                            }
                        </div>
                    </div>
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
