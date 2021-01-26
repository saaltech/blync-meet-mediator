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

    return (
        <div className="appChoice">
            <div className="without-login-wrapper">
                <div className="jifmeet-logo" />
                <div className="image-content-wrapper">
                    <div className="background-width-content no-user-left-background-image"></div>
                    <div className="join-content-wrapper">
                        <div className="join-content-container">
                            <div className="login-join-wrapper">
                                <div className="login-signin-wrapper">Options</div>

                                 { /*<div
                                    className='close-icon'
                                    onClick={() => this.setState({ hideLogin: !this.state.hideLogin })} />*/
                                 }
                                 <ul>
                                     <li>
                                         <div>
                                            <a href={appLinks[machine]}>
                                                Download app
                                            </a>
                                         </div>
                                        
                                     </li>
                                     <li>
                                         <div onClick = {() => {
                                             setShowAppChoice(false);
                                         }}>
                                             Continue on the browser
                                         </div>
                                     </li>
                                     <li>
                                         <div>
                                             <a href={`${appProtocol}://${meetingURL}`}>
                                                 Open the installed app
                                             </a>
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