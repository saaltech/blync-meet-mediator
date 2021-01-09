// @flow

import InlineDialog from '@atlaskit/inline-dialog';
import React, { Component } from 'react';

import { getRoomName } from '../../base/conference';
import { translate } from '../../base/i18n';
import { Icon, IconArrowDown, IconArrowUp, IconPhone, IconVolumeOff } from '../../base/icons';
import { isVideoMutedByUser } from '../../base/media';
import { ActionButton, InputField, PreMeetingScreen, ToggleButton } from '../../base/premeeting';
import { connect } from '../../base/redux';
import { getDisplayName, updateSettings } from '../../base/settings';
import { getLocalJitsiVideoTrack } from '../../base/tracks';
import { isButtonEnabled } from '../../toolbox/functions.web';
import { setPrejoinPageErrorMessageKey } from '../../prejoin';
import {
    joinConference as joinConferenceAction,
    joinConferenceWithoutAudio as joinConferenceWithoutAudioAction,
    setSkipPrejoin as setSkipPrejoinAction,
    setJoinByPhoneDialogVisiblity as setJoinByPhoneDialogVisiblityAction
} from '../actions';
import {
    isDeviceStatusVisible,
    isDisplayNameRequired,
    isJoinByPhoneButtonVisible,
    isJoinByPhoneDialogVisible,
    isPrejoinSkipped,
    getPageErrorMessageKey,
    getQueryVariable
} from '../functions';

import JoinByPhoneDialog from './dialogs/JoinByPhoneDialog';
import DeviceStatus from './preview/DeviceStatus';
import HostPrejoin from './HostPrejoin';

declare var interfaceConfig: Object;

type Props = {

    /**
     * Flag signaling if the 'skip prejoin' button is toggled or not.
     */
    buttonIsToggled: boolean,

    /**
     * Flag signaling if the device status is visible or not.
     */
    deviceStatusVisible: boolean,

    /**
     * If join by phone button should be visible.
     */
    hasJoinByPhoneButton: boolean,

    /**
     * Joins the current meeting.
     */
    joinConference: Function,

    /**
     * Joins the current meeting without audio.
     */
    joinConferenceWithoutAudio: Function,

    /**
     * The name of the user that is about to join.
     */
    name: string,

    /**
     * Updates settings.
     */
    updateSettings: Function,

    /**
     * The name of the meeting that is about to be joined.
     */
    roomName: string,

    /**
     * Sets visibility of the prejoin page for the next sessions.
     */
    setSkipPrejoin: Function,

    /**
     * Sets visibility of the 'JoinByPhoneDialog'.
     */
    setJoinByPhoneDialogVisiblity: Function,

    /**
     * Indicates whether the avatar should be shown when video is off
     */
    showAvatar: boolean,

    /**
     * Flag signaling the visibility of camera preview.
     */
    showCameraPreview: boolean,

    /**
     * If should show an error when joining without a name.
     */
    showErrorOnJoin: boolean,

    /**
     * Flag signaling the visibility of join label, input and buttons
     */
    showJoinActions: boolean,

    /**
     * Flag signaling the visibility of the conference URL section.
     */
    showConferenceInfo: boolean,

    /**
     * If 'JoinByPhoneDialog' is visible or not.
     */
    showDialog: boolean,

    /**
     * Flag signaling the visibility of the skip prejoin toggle
     */
    showSkipPrejoin: boolean,

    /**
     * Used for translation.
     */
    t: Function,

    /**
     * The JitsiLocalTrack to display.
     */
    videoTrack: ?Object,
};

type State = {

    /**
     * Flag controlling the visibility of the error label.
     */
    showError: boolean,

    /**
     * Flag controlling the visibility of the 'join by phone' buttons.
     */
    showJoinByPhoneButtons: boolean
}

/**
 * This component is displayed before joining a meeting.
 */
class Prejoin extends Component<Props, State> {
    /**
     * Default values for {@code Prejoin} component's properties.
     *
     * @static
     */
    static defaultProps = {
        showConferenceInfo: true,
        showJoinActions: true,
        showSkipPrejoin: true
    };

    /**
     * Initializes a new {@code Prejoin} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);

        this.state = {
            showError: false,
            showJoinByPhoneButtons: false,
            isHost: false,
            participantTypeOptionSpecified: false,
            hostUsername: '',
            hostPassword: '',
            participantType: 'guest'
        };

        this._closeDialog = this._closeDialog.bind(this);
        this._showDialog = this._showDialog.bind(this);
        this._onJoinButtonClick = this._onJoinButtonClick.bind(this);
        this._onToggleButtonClick = this._onToggleButtonClick.bind(this);
        this._onDropdownClose = this._onDropdownClose.bind(this);
        this._onOptionsClick = this._onOptionsClick.bind(this);
        this._setName = this._setName.bind(this);
        this._setParticipantType = this._setParticipantType.bind(this);
        this._setHostUsername = this._setHostUsername.bind(this);
        this._setHostPassword = this._setHostPassword.bind(this);
        this._setRoomPassword = this._setRoomPassword.bind(this);
        this._setDetailsToStore = this._setDetailsToStore.bind(this);

    }
    _onJoinButtonClick: () => void;

    /**
     * Handler for the join button.
     *
     * @param {Object} e - The synthetic event.
     * @returns {void}
     */
    _onJoinButtonClick() {
        if (this.props.showErrorOnJoin) {
            this.setState({
                showError: true
            });

            return;
        }

        this.setState({ showError: false });
        this.props.joinConference();
    }

    _onToggleButtonClick: () => void;

    /**
     * Handler for the toggle button.
     *
     * @param {Object} e - The synthetic event.
     * @returns {void}
     */
    _onToggleButtonClick() {
        this.props.setSkipPrejoin(!this.props.buttonIsToggled);
    }

    _onDropdownClose: () => void;

    /**
     * Closes the dropdown.
     *
     * @returns {void}
     */
    _onDropdownClose() {
        this.setState({
            showJoinByPhoneButtons: false
        });
    }

    _onOptionsClick: () => void;

    /**
     * Displays the join by phone buttons dropdown.
     *
     * @param {Object} e - The synthetic event.
     * @returns {void}
     */
    _onOptionsClick(e) {
        e.stopPropagation();

        this.setState({
            showJoinByPhoneButtons: !this.state.showJoinByPhoneButtons
        });
    }

    componentDidMount() {
        window.sessionStorage.setItem('participantType', 'guest');
        window.sessionStorage.removeItem('roomPassword');
        this.setState({
            isHost: false,
            participantTypeOptionSpecified: false,
            hostUsername: window.sessionStorage.getItem('hostUsername') || '',
            hostPassword: window.sessionStorage.getItem('hostPassword') || '',
            roomPassword: '',

            /* indicates that we have come to prejoin from home page*/
            navigatedFromHome: getQueryVariable('home') 
        });
    }

    _setName: () => void;

    /**
     * Sets the guest participant name.
     *
     * @param {string} displayName - Participant name.
     * @returns {void}
     */
    _setName(displayName) {
        this.props.updateSettings({
            displayName
        });
    }

    _setParticipantType: () => void;

    /**
     * Sets the participantType property in localstorage.
     *
     * @param {*} event
     */
    _setParticipantType(event) {
        const value = event.target.value;

        // window.sessionStorage.setItem("participantType", value);
        this.setState({
            isHost: value === 'host',
            participantTypeOptionSpecified: true,
            participantType: value
        });
    }

    _setHostUsername: () => void;

    /**
     * Sets the hostUsername property in localstorage.
     *
     * @param {*} username
     */
    _setHostUsername(username) {
        // window.sessionStorage.setItem("hostUsername", username);
        this.setFieldInState('hostUsername', username);
    }

    _setHostPassword: () => void;

    /**
     * Sets the hostPassword property in localstorage.
     *
     * @param {*} password
     */
    _setHostPassword(password) {
        // window.sessionStorage.setItem("hostPassword", password);
        this.setFieldInState('hostPassword', password);
    }

    _setRoomPassword: () => void;

    /**
     * Sets the roomPassword property in localstorage.
     *
     * @param {*} roomPassword
     */
    _setRoomPassword(roomPassword) {
        //window.sessionStorage.setItem('roomPassword', roomPassword);
        this.setFieldInState('roomPassword', roomPassword);
    }

    setFieldInState(field, value) {
        const obj = {};

        obj[field] = value;
        this.setState(obj);
    }

    _setDetailsToStore() {
        window.sessionStorage.setItem('hostUsername', this.state.hostUsername);
        window.sessionStorage.setItem('hostPassword', this.state.hostPassword);
        window.sessionStorage.setItem('roomPassword', this.state.roomPassword);
        window.sessionStorage.setItem('participantType', this.state.participantType);

    }

    _closeDialog: () => void;

    /**
     * Closes the join by phone dialog.
     *
     * @returns {undefined}
     */
    _closeDialog() {
        this.props.setJoinByPhoneDialogVisiblity(false);
    }

    _showDialog: () => void;

    /**
     * Displays the dialog for joining a meeting by phone.
     *
     * @returns {undefined}
     */
    _showDialog() {
        this.props.setJoinByPhoneDialogVisiblity(true);
        this._onDropdownClose();
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            hasJoinByPhoneButton,
            joinConference,
            joinConferenceWithoutAudio,
            name,
            showCameraPreview,
            showDialog,
            t,
            videoTrack,
            pageErrorMessageKey
        } = this.props;

        // videoTrack && videoTrack._setMuted(true);

        const { _closeDialog, _onCheckboxChange, _onDropdownClose, _onOptionsClick, _setName,
            _showDialog, _setParticipantType, _setHostUsername, _setHostPassword, _setRoomPassword } = this;
        const { showJoinByPhoneButtons, navigatedFromHome } = this.state;

        return (
            <PreMeetingScreen
                footer = { this._renderFooter() }
                title = { t('prejoin.joinMeeting') }
                videoMuted = { !showCameraPreview }
                _start={this.props._start}
                videoTrack = { videoTrack }
                navigatedFromHome = { navigatedFromHome }>
                <div className = 'prejoin-input-area-container'>
                    <div className = 'prejoin-input-area'>
                        <div className = 'prejoin-input-form-fields'>
                            <div className = 'prejoin-field'>
                                <div className = 'prejoin-label'>Your Name</div>
                                <InputField
                                    onChange = { _setName }
                                    placeHolder = { t('dialog.enterDisplayName') }
                                    value = { name } />
                            </div>


                            {

                                /**
                                 * Authenticated rooms should be enabled.
                                 * or else, this host/username/password has no effect
                                 */
                            }
                            <div className = 'prejoin-field'>
                                <input
                                    type = 'radio'
                                    id = 'host'
                                    name = 'participantType'
                                    onChange = { _setParticipantType }
                                    value = 'host' />
                                <label htmlFor = 'host'>{t('prejoin.hostuserLabel')}</label><br />
                                <input
                                    type = 'radio'
                                    id = 'guest'
                                    name = 'participantType'
                                    onChange = { _setParticipantType }
                                    value = 'guest' />
                                <label htmlFor = 'guest'>{ t('prejoin.guestUserLabel') }</label>
                            </div>

                            {
                                this.state.participantTypeOptionSpecified && !this.state.isHost
                                && <div className = 'prejoin-field'>
                                    <div className = 'prejoin-label'>{t('prejoin.meetingPasswordField')}</div>
                                    <InputField
                                        onChange = { _setRoomPassword }

                                        // onSubmit = { joinConference }
                                        placeHolder = { t('prejoin.meetingPasswordPlaceholder') } />
                                </div>
                            }

                            {
                                this.state.participantTypeOptionSpecified && this.state.isHost
                                && <>
                                    <div className = 'prejoin-field'>
                                        <div className = 'prejoin-label'>{t('prejoin.usernameField')}</div>
                                        <InputField
                                            onChange = { _setHostUsername }

                                            // onSubmit = { joinConference }
                                            value = { this.state.hostUsername }
                                            placeHolder = { t('prejoin.usernameField') } />
                                    </div>

                                    <div className = 'prejoin-field'>
                                        <div className = 'prejoin-label'>{t('prejoin.passwordField')}</div>
                                        <InputField
                                            type = 'password'
                                            onChange = { _setHostPassword }

                                            // onSubmit = { joinConference }
                                            value = { this.state.hostPassword }
                                            placeHolder = { t('prejoin.passwordField') } />
                                    </div>

                                </>
                            }
                        </div>

                        <div className = 'prejoin-preview-dropdown-container'>
                            <InlineDialog
                                content = { <div className = 'prejoin-preview-dropdown-btns'>
                                    <div
                                        className = 'prejoin-preview-dropdown-btn'
                                        onClick = { joinConferenceWithoutAudio }>
                                        <Icon
                                            className = 'prejoin-preview-dropdown-icon'
                                            size = { 24 }
                                            src = { IconVolumeOff } />
                                        { t('prejoin.joinWithoutAudio') }
                                    </div>
                                    {hasJoinByPhoneButton && <div
                                        className = 'prejoin-preview-dropdown-btn'
                                        onClick = { _showDialog }>
                                        <Icon
                                            className = 'prejoin-preview-dropdown-icon'
                                            size = { 24 }
                                            src = { IconPhone } />
                                        { t('prejoin.joinAudioByPhone') }
                                    </div>}
                                </div> }
                                isOpen = { showJoinByPhoneButtons }
                                onClose = { _onDropdownClose }>
                                <ActionButton
                                    disabled = { !name
                                        || !this.state.participantTypeOptionSpecified
                                        || pageErrorMessageKey === 'submitting' }
                                    hasOptions = { true }
                                    onClick = { () => {
                                        this._setDetailsToStore();
                                        APP.store.dispatch(setPrejoinPageErrorMessageKey('submitting'));
                                        joinConference();
                                    } }
                                    onOptionsClick = { _onOptionsClick }
                                    type = 'primary'>
                                    { t('prejoin.joinNow') }
                                </ActionButton>
                            </InlineDialog>
                            <div className = 'cancel-join'>
                                {
                                    pageErrorMessageKey !== 'submitting'
                                        ? <a href = { '/' }>
                                    Cancel
                                        </a>
                                        : 'Cancel'
                                }

                            </div>

                            <div className = 'error-msg'>
                                {
                                    pageErrorMessageKey
                                    && pageErrorMessageKey !== 'submitting'
                                     && t(pageErrorMessageKey)
                                }
                            </div>
                        </div>
                    </div>

                    <div className = 'prejoin-checkbox-container'>
                        <input
                            className = 'prejoin-checkbox'
                            onChange = { _onCheckboxChange }
                            type = 'checkbox' />
                        <span>{t('prejoin.doNotShow')}</span>
                    </div>
                </div>
                { showDialog && (
                    <JoinByPhoneDialog
                        joinConferenceWithoutAudio = { joinConferenceWithoutAudio }
                        onClose = { _closeDialog } />
                )}
            </PreMeetingScreen>
        );
    }

    /**
     * Renders the screen footer if any.
     *
     * @returns {React$Element}
     */
    _renderFooter() {
        return this.props.deviceStatusVisible && <DeviceStatus />;
    }
}

/**
 * Maps (parts of) the redux state to the React {@code Component} props.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */
function mapStateToProps(state): Object {
    return {
        deviceStatusVisible: isDeviceStatusVisible(state),
        name: getDisplayName(state),
        roomName: getRoomName(state),
        showDialog: isJoinByPhoneDialogVisible(state),
        hasJoinByPhoneButton: isJoinByPhoneButtonVisible(state),
        showCameraPreview: !isVideoMutedByUser(state),
        videoTrack: getLocalJitsiVideoTrack(state),
        pageErrorMessageKey: getPageErrorMessageKey(state)
    };
}

const mapDispatchToProps = {
    joinConferenceWithoutAudio: joinConferenceWithoutAudioAction,
    joinConference: joinConferenceAction,
    setJoinByPhoneDialogVisiblity: setJoinByPhoneDialogVisiblityAction,
    setSkipPrejoin: setSkipPrejoinAction,
    updateSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(translate(Prejoin));
