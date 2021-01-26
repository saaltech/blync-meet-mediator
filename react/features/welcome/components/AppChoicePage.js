import React, { useState, useEffect } from 'react';
import { connect } from '../../base/redux';
import { translate } from '../../base/i18n';

type Props = {

    /**
     * Function to be called when continuing with web browser
     */
    setShowAppChoice: function
}

function AppChoicePage(props: Props) {
    const { setShowAppChoice, meetingURL, machine } = props;

    const appLinks = {
        mac: "https://github.com/saaltech/blync-meet-electron/releases/latest/download/jifmeet.dmg",
        win: "https://github.com/saaltech/blync-meet-electron/releases/latest/download/jifmeet.exe"
    }

    const appProtocol = "jifmeet";

    const replaceLocation = (href) => {
        window.location.replace(href);
    }

    return (
        <div className="appChoice">
            <div className="without-login-wrapper">
                <div className="jifmeet-logo" />
                <div className="image-content-wrapper">
                    <div className="background-width-content no-user-left-background-image"></div>
                    <div className="join-content-wrapper">
                        <div className="join-content-container">
                            <div className="login-join-wrapper">
                                <div className="appChoice__header">
                                    <div className="header_image">
                                        <img src='images/app_choice.svg' />
                                    </div>
                                    <div className="login-signin-wrapper">How would you like to continue?</div>
                                </div>
                                

                                 { /*<div
                                    className='close-icon'
                                    onClick={() => this.setState({ hideLogin: !this.state.hideLogin })} />*/
                                 }
                                 <ul>
                                     <li>
                                         <div 
                                            className="appChoice__btns appChoice__download"
                                            onClick = {() => 
                                                replaceLocation(appLinks[machine])
                                            }
                                        >
                                            <div className="appChoice__btns__icon appChoice__download__icon">
                                                
                                            </div>
                                            <div className="appChoice__btns__label">
                                                <div className="appChoice__btns__title">
                                                    Download app
                                                </div>
                                                <div className="appChoice__btns__subTitle">
                                                    Use the desktop app for the best experience.
                                                </div>
                                            </div>
                                         </div>
                                        
                                     </li>
                                     <li>
                                         <div 
                                            className="appChoice__btns appChoice__continue" 
                                            onClick = {() => {
                                             setShowAppChoice(false);
                                            }}
                                        >
                                            <div className="appChoice__btns__icon appChoice__continue__icon">
                                                
                                            </div>
                                            <div className="appChoice__btns__label">
                                                <div className="appChoice__btns__title">
                                                    Continue on this browser
                                                </div>
                                                <div className="appChoice__btns__subTitle">
                                                    No download or installation required.
                                                </div>
                                            </div>
                                         </div>
                                     </li>
                                     <li>
                                         <div 
                                            className="appChoice__btns appChoice__openApp"
                                            onClick = {() => 
                                                replaceLocation(`${appProtocol}://${meetingURL}`)
                                            }
                                        >
                                            <div className="appChoice__btns__icon appChoice__openApp__icon">
                                                
                                            </div>
                                            <div className="appChoice__btns__label">
                                                <div className="appChoice__btns__title">
                                                    Open your Jifmeet app
                                                </div>
                                                <div className="appChoice__btns__subTitle">
                                                    Already have it? Go right to your meeting.
                                                </div>
                                            </div>
                                         </div>
                                     </li>
                                 </ul>
                                
                            </div>
                        </div>
                        <div className="footer-container">
                            <div className="copy-rights-detail">Copyright © 2021 · Jifmeet. All rights reserved</div>
                        </div>
                    </div>
                    <div className="background-width-content no-user-right-background-image"></div>
                </div>
            </div>
        </div>
        
    );
}

function mapStateToProps(state): Object {
    return {
    };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(translate(AppChoicePage));