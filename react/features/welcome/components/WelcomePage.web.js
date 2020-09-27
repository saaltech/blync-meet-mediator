/* global interfaceConfig */

import React from 'react';

import ToggleSwitch from '../../../../modules/UI/toggleSwitch/ToggleSwitch';
import { LoginComponent, decideAppLogin, Profile } from '../../../features/app-auth';
import { validateMeetingCode } from '../../../features/app-auth/functions';
import { Platform } from '../../../features/base/react';
import { setPostWelcomePageScreen } from '../../app-auth/actions';
import { isMobileBrowser } from '../../base/environment/utils';
import { translate } from '../../base/i18n';
import { Icon, IconWarning } from '../../base/icons';
import { connect } from '../../base/redux';
import { CalendarList, bootstrapCalendarIntegration } from '../../calendar-sync';
import { FRAME_INITIALIZATION_FAILED } from '../../google-api/constants';
import {
    getQueryVariable
} from '../../prejoin/functions';
import { RecentList } from '../../recent-list';
import logger from '../../settings/logger';

import { AbstractWelcomePage, _mapStateToProps } from './AbstractWelcomePage';
import Tabs from './Tabs';
import Background from './background';


/**
 * The pattern used to validate room name.
 * @type {string}
 */
export const ROOM_NAME_VALIDATE_PATTERN_STR = '^[^?&:\u0022\u0027%#]+$';

/**
 * Maximum number of pixels corresponding to a mobile layout.
 * @type {number}
 */
const WINDOW_WIDTH_THRESHOLD = 425;

/**
 * The Web container rendering the welcome page.
 *
 * @extends AbstractWelcomePage
 */
class WelcomePage extends AbstractWelcomePage {
    /**
     * Default values for {@code WelcomePage} component's properties.
     *
     * @static
     */
    static defaultProps = {
        _room: ''
    };

    /**
     * Initializes a new WelcomePage instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,

            generateRoomnames:
                interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE,
            selectedTab: 0,
            formDisabled: true,
            hideLogin: true,
            sessionExpiredQuery: false,
            goClicked: false,
            reasonForLogin: '',
            showNoCreateMeetingPrivilegeTip: false,
            switchActiveIndex: this._canCreateMeetings() ? 0 : 1
        };

        /**
         * The HTML Element used as the container for additional content. Used
         * for directly appending the additional content template to the dom.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalContentRef = null;

        this._roomInputRef = null;

        /**
         * The HTML Element used as the container for additional toolbar content. Used
         * for directly appending the additional content template to the dom.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalToolbarContentRef = null;

        /**
         * The template to use as the main content for the welcome page. If
         * not found then only the welcome page head will display.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalContentTemplate = document.getElementById(
            'welcome-page-additional-content-template');

        /**
         * The template to use as the additional content for the welcome page header toolbar.
         * If not found then only the settings icon will be displayed.
         *
         * @private
         * @type {HTMLTemplateElement|null}
         */
        this._additionalToolbarContentTemplate = document.getElementById(
            'settings-toolbar-additional-content-template'
        );

        // Bind event handlers so they are only bound once per instance.
        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._onRoomChange = this._onRoomChange.bind(this);
        this._onRoomNameChanged = this._onRoomNameChanged.bind(this);
        this._setAdditionalContentRef
            = this._setAdditionalContentRef.bind(this);
        this._setRoomInputRef = this._setRoomInputRef.bind(this);
        this._setAdditionalToolbarContentRef
            = this._setAdditionalToolbarContentRef.bind(this);
        this._onTabSelected = this._onTabSelected.bind(this);
        this._closeLogin = this._closeLogin.bind(this);
        this._cleanupTooltip = this._cleanupTooltip.bind(this);
        this.links = window.interfaceConfig.MOBILE_APP_LINKS;
    }

    launchApp() {
        window.location.replace(this.links[Platform.OS].deepLink);
        // TODO: Comment the below line until redirection to installed app is implemented
        // this.timer = setTimeout(() => this.openAppPage(), 1000);
    }

    openAppPage() {
        clearTimeout(this.timer);
        window.location.replace(this.links[Platform.OS].storeLink);
    }

    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {

        if (isMobileBrowser() && this.links) {
            this.launchApp();
        }
        window.showEnableCookieTip = false

        this.props.dispatch(bootstrapCalendarIntegration())
            .catch(err => {
                if(err.error === FRAME_INITIALIZATION_FAILED) {
                    window.showEnableCookieTip = true;
                }
                logger.error('Google oauth bootstrapping failed', err)
            });
            

        this.props.dispatch(setPostWelcomePageScreen(null, {}));
        if (getQueryVariable('sessionExpired')) {
            this.setState({
                hideLogin: false,
                sessionExpiredQuery: true
            });
        }
        this.props.dispatch(decideAppLogin());
        super.componentDidMount();
        this.setState({
            goClicked: false
        });

        document.body.classList.add('welcome-page');
        document.title = interfaceConfig.APP_NAME;

        if (this.state.generateRoomnames) {
            this._updateRoomname();
        }

        if (this._shouldShowAdditionalContent()) {
            this._additionalContentRef.appendChild(
                this._additionalContentTemplate.content.cloneNode(true));
        }

        if (this._shouldShowAdditionalToolbarContent()) {
            this._additionalToolbarContentRef.appendChild(
                this._additionalToolbarContentTemplate.content.cloneNode(true)
            );
        }
    }

    /**
     * Removes the classname used for custom styling of the welcome page.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        super.componentWillUnmount();

        document.body.classList.remove('welcome-page');
    }

    /**
     * Room name edit 
     */
    _onRoomNameChanged(e) {
        this._onRoomChange(e);
        if (e.target.value.trim() !== '') {
            this._decideFormDisability(e.target.value.trim());
        } else {
            this.setState({
                formDisabled: true
            });
        }
    }

    /**
     * Set Switch Active index.
     *
     * @param {string} index - Index of toggle switch active index.
     * @private
     * @returns {void}
     */
    setSwitchActiveIndex(index = null) {
        this.setState({
            switchActiveIndex: index === null ? (this._canCreateMeetings() ? 0 : 1) : parseInt(index, 10)
        }, () => {
            this._decideFormDisability();
        });
    }

    /**
     *
     */
    _decideFormDisability(name = this.state.room) {
        let disabled = false;

        if (!name) {
            disabled = true;
        } else if (this.state.switchActiveIndex) {
            const match = validateMeetingCode(name);

            disabled = !match;
        }

        this.setState({
            formDisabled: disabled
        });
    }

    /**
     *
     */
    _cleanupTooltip() {
        setTimeout(() => {
            if (this._canCreateMeetings()) {
                this.setState({
                    showNoCreateMeetingPrivilegeTip: false
                });
            }
        }, 300);
    }

    /**
     *
     */
    _closeLogin() {
        this.setState({
            hideLogin: true
        });

        if (this.state.switchActiveIndex === 0) {
            this.setSwitchActiveIndex();
            if (!this._canCreateMeetings()) {
                this.setState({
                    showNoCreateMeetingPrivilegeTip: true
                });
            }
        }
    }

    _canCreateMeetings() {
        const { _user } = this.props;

        return !_user || _user.role == 'manager'
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement|null}
     */
    render() {
        const { t, _isUserSignedOut, _meetingDetails } = this.props;
        const { hideLogin, goClicked, sessionExpiredQuery, switchActiveIndex,
            showNoCreateMeetingPrivilegeTip } = this.state;
        const { APP_NAME } = interfaceConfig;
        const showAdditionalContent = this._shouldShowAdditionalContent();
        const showAdditionalToolbarContent = this._shouldShowAdditionalToolbarContent();
        const showResponsiveText = this._shouldShowResponsiveText();
        const titleArr = t('welcomepage.enterRoomTitle').split(' ');
        const separatedTitle = titleArr.pop();
        const toggleSwitchItems = {
            0: {
                name: 'Create',
                disabled: !this._canCreateMeetings(),
                noPrivilegeTip: showNoCreateMeetingPrivilegeTip && (<>
                    <div className = 'tooltip show'>
                        <div
                            className = 'close-icon'
                            onClick = { () => this.setState({ showNoCreateMeetingPrivilegeTip: false }) } />
                        <div />
                        <div className = 'tooltip__message'>{t('welcomepage.noCreateMeetingRights')}</div>
                    </div>
                </>)
            },
            1: {
                name: 'Join',
                disabled: false
            }
        };


        return (
            <div>
                {
                    <div
                        className = { `welcome ${showAdditionalContent
                            ? 'with-content' : 'without-content'}` }
                        id = 'welcome_page'>

                        <Background />

                        {
                            isMobileBrowser() && this.links
                                ? <div className = 'mobile-message'>
                                    <div className = 'more-section-content'>
                                        <p className = 'more-section-title'>{t('welcomepage.mobileMessageTitle')}</p>
                                        <p className = 'more-section-text'>{t('welcomepage.mobileMessage')}</p>
                                        <div className = 'app-link'>
                                            <a
                                                href = { this.links[Platform.OS].storeLink }
                                                target = '_top'>
                                                {
                                                    Platform.OS === 'ios'
                                                        ? <img src = 'images/appstore.svg' />
                                                        : <img src = 'images/googleplay.png' />
                                                }
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                : <>
                                    {
                                        _isUserSignedOut
                                    && <LoginComponent
                                        closeAction = { this._closeLogin }
                                        errorMsg = { sessionExpiredQuery ? 'Session expired.' : '' }
                                        hideLogin = { hideLogin }
                                        isOverlay = { true }
                                        reasonForLogin = { this.state.reasonForLogin }
                                        t = { t } />
                                    }

                                    <div className = 'header'>
                                        {
                                            _isUserSignedOut
                                                ? <div
                                                    className = { 'welcome-page-button signin' }
                                                    id = 'enter_room_button'
                                                    onClick = { () => this.setState({
                                                        reasonForLogin: '',
                                                        hideLogin: false
                                                    }) }>
                                                    {
                                                        t('welcomepage.signinLabel')
                                                    }
                                                </div>
                                                : <div
                                                    className = { 'welcome-page-button profile' }
                                                    onClick = { () => this.setState({
                                                        hideLogin: true
                                                    }) }>
                                                    <Profile
                                                        showMenu = { true } 
                                                        postLogout = { this._cleanupTooltip } />
                                                </div>

                                        }
                                        <div className = 'header-image' />
                                        <div className = 'header-text'>
                                            <h1 className = 'header-text-title'>
                                                <span>{ titleArr.join(' ') } </span>
                                                <span>{ separatedTitle }</span>
                                            </h1>
                                            {/* <h3 className = 'header-text-sub-title'>
                                            { t('welcomepage.subTitle') }
                                        </h3>
                                        <p className = 'header-text-description'>
                                            { t('welcomepage.appDescription',
                                                { app: APP_NAME }) }
                                    </p>*/}
                                        </div>
                                        
                                    </div>
                                    <div id = 'enter_room'>
                                        <ToggleSwitch
                                            activeIndex = { switchActiveIndex }
                                            containerStyle = {{ margin: '5px 0px 5px -7px' }}
                                            items = { toggleSwitchItems }
                                            toggleAction = { index => this.setSwitchActiveIndex(index) } />
                                        <div className = 'enter-room-input-container'>
                                            <form onSubmit = { this._onFormSubmit }>
                                                <input
                                                    autoFocus = { true }
                                                    className = 'enter-room-input'
                                                    id = 'enter_room_field'
                                                    onChange = { this._onRoomNameChanged }

                                                    // pattern = { ROOM_NAME_VALIDATE_PATTERN_STR }
                                                    placeholder = { switchActiveIndex ? t('welcomepage.placeholderEnterRoomCode')
                                                        : t('welcomepage.placeholderEnterRoomName') } // this.state.roomPlaceholder
                                                    ref = { this._setRoomInputRef }
                                                    title = { t('welcomepage.roomNameAllowedChars') }
                                                    type = 'text' />
                                            </form>
                                        </div>
                                        <div
                                            className = { `welcome-page-button go ${this.state.formDisabled ? 'disabled' : ''}` }
                                            id = 'enter_room_button'

                                            onClick = { this._onFormSubmit }>
                                            {
                                                showResponsiveText
                                                    ? t('welcomepage.goSmall')
                                                    : t('welcomepage.go')
                                            }
                                        </div>
                                    </div>
                                    { this._renderInsecureRoomNameWarning(switchActiveIndex === 1) }
                                    {/* this._renderTabs() */}
                                    { showAdditionalContent
                                        ? <div
                                            className = 'welcome-page-content'
                                            ref = { this._setAdditionalContentRef } />
                                        : null }
                            </>
                        }


                    </div>
                }

                {
                    !isMobileBrowser()
                    && <div className = 'legal-footer'>
                        <p>Copyright © 2020 Jifmeet. All rights reserved.</p>

                        <div>
                            <a
                                href = '/TnC'
                                target = '_blank'>Terms and Conditions</a> | <a
                                href = '/privacy-policy'
                                    target = '_blank'>Privacy Policy</a>
                        </div>
                    </div>
                }

            </div>
        );
    }

    /**
     * Renders the insecure room name warning.
     *
     * @inheritdoc
     */
    _doRenderInsecureRoomNameWarning() {
        return (
            <div className = 'insecure-room-name-warning'>
                <Icon src = { IconWarning } />
                <span>
                    { this.props.t('security.insecureRoomNameWarning') }
                </span>
            </div>
        );
    }

    /**
     * Renders the insecure room name warning.
     *
     * @inheritdoc
     */
    _doRenderInvalidCode() {
        return ( <></>
            /*<div className = 'insecure-room-name-warning'>
                <Icon src = { IconWarning } />
                <span>
                    { this.props.t('security.insecureRoomCodeWarning') }
                </span>
            </div>*/
        );
    }

    /**
     * Prevents submission of the form and delegates join logic.
     *
     * @param {Event} event - The HTML Event which details the form submission.
     * @private
     * @returns {void}
     */
    _onFormSubmit(event) {
        event.preventDefault();

        if (this.state.formDisabled) {
            return;
        }

        if (this.props._isUserSignedOut
            && this.state.switchActiveIndex === 0) {
            this.setState({
                hideLogin: false,
                reasonForLogin: this.props.t('welcomepage.signinToCreateMeeting')
            });

            return;
        }
        this.setState({
            reasonForLogin: ''
        });

        if (!this._roomInputRef || this._roomInputRef.reportValidity()) {
            this.setState({
                goClicked: true
            });
            this.props.dispatch(setPostWelcomePageScreen(this.state.room, null,
                this.state.switchActiveIndex === 1));


            const intervalId = setInterval(() => {
                // Done to fix the Redux persist store rehydration issue seen on Safari v13.x
                // rehydration doesnt complete before we navigate to the prejoin page in _onJoin method below.

                const appAuth = JSON.parse(window.localStorage.getItem('features/app-auth'));

                if ((appAuth.meetingDetails || {}).meetingName) {
                    clearInterval(intervalId);
                    this._onJoin();
                }
            }, 30);
        }
    }

    /**
     * Overrides the super to account for the differences in the argument types
     * provided by HTML and React Native text inputs.
     *
     * @inheritdoc
     * @override
     * @param {Event} event - The (HTML) Event which details the change such as
     * the EventTarget.
     * @protected
     */
    _onRoomChange(event) {
        super._onRoomChange(event.target.value);
    }

    /**
     * Callback invoked when the desired tab to display should be changed.
     *
     * @param {number} tabIndex - The index of the tab within the array of
     * displayed tabs.
     * @private
     * @returns {void}
     */
    _onTabSelected(tabIndex) {
        this.setState({ selectedTab: tabIndex });
    }

    /**
     * Renders tabs to show previous meetings and upcoming calendar events. The
     * tabs are purposefully hidden on mobile browsers.
     *
     * @returns {ReactElement|null}
     */
    _renderTabs() {
        if (isMobileBrowser()) {
            return null;
        }

        const { _calendarEnabled, _recentListEnabled, t } = this.props;

        const tabs = [];

        if (_calendarEnabled) {
            tabs.push({
                label: t('welcomepage.calendar'),
                content: <CalendarList />
            });
        }

        if (_recentListEnabled) {
            tabs.push({
                label: t('welcomepage.recentList'),
                content: <RecentList />
            });
        }

        if (tabs.length === 0) {
            return null;
        }

        return (
            <Tabs
                onSelect = { this._onTabSelected }
                selected = { this.state.selectedTab }
                tabs = { tabs } />);
    }

    /**
     * Sets the internal reference to the HTMLDivElement used to hold the
     * welcome page content.
     *
     * @param {HTMLDivElement} el - The HTMLElement for the div that is the root
     * of the welcome page content.
     * @private
     * @returns {void}
     */
    _setAdditionalContentRef(el) {
        this._additionalContentRef = el;
    }

    /**
     * Sets the internal reference to the HTMLDivElement used to hold the
     * toolbar additional content.
     *
     * @param {HTMLDivElement} el - The HTMLElement for the div that is the root
     * of the additional toolbar content.
     * @private
     * @returns {void}
     */
    _setAdditionalToolbarContentRef(el) {
        this._additionalToolbarContentRef = el;
    }

    /**
     * Sets the internal reference to the HTMLInputElement used to hold the
     * welcome page input room element.
     *
     * @param {HTMLInputElement} el - The HTMLElement for the input of the room name on the welcome page.
     * @private
     * @returns {void}
     */
    _setRoomInputRef(el) {
        this._roomInputRef = el;
    }

    /**
     * Returns whether or not additional content should be displayed below
     * the welcome page's header for entering a room name.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowAdditionalContent() {
        return interfaceConfig.DISPLAY_WELCOME_PAGE_CONTENT
            && this._additionalContentTemplate
            && this._additionalContentTemplate.content
            && this._additionalContentTemplate.innerHTML.trim();
    }

    /**
     * Returns whether or not additional content should be displayed inside
     * the header toolbar.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowAdditionalToolbarContent() {
        return interfaceConfig.DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT
            && this._additionalToolbarContentTemplate
            && this._additionalToolbarContentTemplate.content
            && this._additionalToolbarContentTemplate.innerHTML.trim();
    }

    /**
     * Returns whether or not the screen has a size smaller than a custom margin
     * and therefore display different text in the go button.
     *
     * @private
     * @returns {boolean}
     */
    _shouldShowResponsiveText() {
        const { innerWidth } = window;

        return innerWidth <= WINDOW_WIDTH_THRESHOLD;
    }

}

export default translate(connect(_mapStateToProps)(WelcomePage));
