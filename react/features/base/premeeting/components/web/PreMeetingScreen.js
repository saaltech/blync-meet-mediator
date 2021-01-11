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
import { goHome, setAppAuth } from '../../../../app-auth'
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
            showNoCreateMeetingPrivilegeTip: false,
            activeButton: 'join',
            actions: 'meetNow',
            uuid: Math.random().toString(36).slice(2, 7),
            permissionAsked: false
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

    componentDidUpdate(prevProps) {
        if (prevProps && prevProps._user !== this.props._user) {
            this.setState({ showNoCreateMeetingPrivilegeTip: !this._canCreateMeetings() });
        }
        if (prevProps && prevProps.videoTrack !== this.props.videoTrack) {
            this.setMeetNow(this.state.actions === 'meetNow');
        }
    }
    handleRouteChange(value) {
        redirectOnButtonChange(value);
    }

    syncStoreFromParentWindowStore() {
        
        window.addEventListener('message', receiveMessage, false);

        function receiveMessage(evt)
         {
             if(evt.data.appAuth) {
                // TODO: Receive the 'appAuth' data stored in external window, and,
                // Apply/dispatch the data into the current window localStorage.
                APP.store.dispatch(setAppAuth(evt.data.appAuth));
             }
         }

         // Send the 'syncStoreReq' request to the parent containing window (like electron app),
         window.parent.postMessage({'syncStoreReq': true}, '*');
    }

    _canCreateMeetings() {
        const { _user } = this.props;

        return !_user || (_user.isPartOfTheCircle && _user.role == 'manager');
    }

    setMeetNow(value) {
        this.setState({
            meetNow: value
        }, () => {
            APP.store.dispatch(setVideoMuted(!(this.state.showTrackPreviews)))
        })
    }

    setIsVideoMuted(value) {
        APP.store.dispatch(setVideoMuted(!value))
    }

    goToCreateHome() {
        // notify external apps
        APP.API.notifyReadyToClose();
        window.location.href = `${window.location.origin}?actions=create`
    }

    showTrackPreviews(value) {
        if(!this.props.videoTrack && !this.state.permissionAsked && value) {
            this.props._start();
            this.setState({
                permissionAsked: true
            })
        }
        this.setState({
            showTrackPreviews: value
        }, () => {
            // APP.store.dispatch(setVideoMuted(!(this.state.showTrackPreviews)))
        })
    }

    render() {
        const { title, videoMuted, videoTrack, url, meetNowSelected } = this.props;
        const { meetNow, showTrackPreviews, navigatedFromHome, exiting,
            joinMeeting } = this.state;
        let urlToShow = url.split('/').length > 3 ? url.split('/')[3] : title;
        let guestFlow = navigatedFromHome !== undefined && navigatedFromHome == false
        if (guestFlow) {
            window.sessionStorage.removeItem('isJWTSet');
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
                    showNoCreateMeetingPrivilegeTip={this.state.showNoCreateMeetingPrivilegeTip}
                    isNotCreatePermission={!this._canCreateMeetings()}
                    toolTipClose={() => { this.setState({ showNoCreateMeetingPrivilegeTip: false }) }}
                    setActiveButton={this.handleRouteChange} />
                <div
                    className='premeeting-screen'
                    id='lobby-screen'>
                    {/* <Background backgroundColor='black'/> */}

                    <div style={{ height: '100%', width: '100%' }}>
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
                                                this.goToCreateHome()
                                            })
                                    }}
                                    syncStoreFromParentWindowStore={() => {
                                        this.syncStoreFromParentWindowStore()
                                    }}
                                    setIsVideoMuted={this.setIsVideoMuted}
                                    //Show join now after page reload in case of `meet now` option
                                    joinNow={meetNowSelected}
                                    meetingId={urlToShow}
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
                                    setIsVideoMuted={this.setIsVideoMuted}
                                    joinMeeting={joinMeeting}
                                    videoMuted={videoMuted}
                                    videoTrack={videoTrack}
                                    onClickClose={() => {
                                        this.setState({ exiting: true },
                                            () => {
                                                goHome()
                                            })
                                    }}
                                    syncStoreFromParentWindowStore={() => {
                                        this.syncStoreFromParentWindowStore()
                                    }}
                                    previewFooter={this.props.footer}
                                    meetingId={urlToShow}
                                    showTrackPreviews={this.showTrackPreviews}
                                    uuid={this.state.uuid}
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
        _user: state['features/app-auth'].user,
        meetNowSelected: APP.store.getState()['features/app-auth'].meetingDetails
            && APP.store.getState()['features/app-auth'].meetingDetails.meetNow
    };
}

export default connect(mapStateToProps)(PreMeetingScreen);
