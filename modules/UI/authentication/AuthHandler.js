/* global APP, config, JitsiMeetJS, Promise */

import Logger from 'jitsi-meet-logger';

import { openConnection } from '../../../connection';
import { toJid } from '../../../react/features/base/connection/functions';
import { setJWT } from '../../../react/features/base/jwt';
import { setInterimPrejoinPage, setPrejoinPageVisibility,
    setPrejoinPageErrorMessageKey } from '../../../react/features/prejoin'
import {
    JitsiConnectionErrors,
    JitsiConferenceErrors
} from '../../../react/features/base/lib-jitsi-meet';
import UIUtil from '../util/UIUtil';

import LoginDialog from './LoginDialog';

const logger = Logger.getLogger(__filename);

let externalAuthWindow;
let authRequiredDialog;

let loginDialog;

const isTokenAuthEnabled
    = typeof config.tokenAuthUrl === 'string' && config.tokenAuthUrl.length;
const getTokenAuthUrl
    = JitsiMeetJS.util.AuthUtil.getTokenAuthUrl.bind(null, config.tokenAuthUrl);

/**
 * Authenticate using external service or just focus
 * external auth window if there is one already.
 *
 * @param {JitsiConference} room
 * @param {string} [lockPassword] password to use if the conference is locked
 */
function doExternalAuth(room, lockPassword) {
    if (externalAuthWindow) {
        externalAuthWindow.focus();

        return;
    }
    if (room.isJoined()) {
        let getUrl;

        if (isTokenAuthEnabled) {
            getUrl = Promise.resolve(getTokenAuthUrl(room.getName(), true));
            initJWTTokenListener(room);
        } else {
            getUrl = room.getExternalAuthUrl(true);
        }
        getUrl.then(url => {
            externalAuthWindow = LoginDialog.showExternalAuthDialog(
                url,
                () => {
                    externalAuthWindow = null;
                    if (!isTokenAuthEnabled) {
                        room.join(lockPassword);
                    }
                }
            );
        });
    } else if (isTokenAuthEnabled) {
        redirectToTokenAuthService(room.getName());
    } else {
        room.getExternalAuthUrl().then(UIUtil.redirect);
    }
}

/**
 * Redirect the user to the token authentication service for the login to be
 * performed. Once complete it is expected that the service wil bring the user
 * back with "?jwt={the JWT token}" query parameter added.
 * @param {string} [roomName] the name of the conference room.
 */
function redirectToTokenAuthService(roomName) {
    // FIXME: This method will not preserve the other URL params that were
    // originally passed.
    UIUtil.redirect(getTokenAuthUrl(roomName, false));
}

/**
 * Initializes 'message' listener that will wait for a JWT token to be received
 * from the token authentication service opened in a popup window.
 * @param room the name fo the conference room.
 */
function initJWTTokenListener(room) {
    /**
     *
     */
    function listener({ data, source }) {
        if (externalAuthWindow !== source) {
            logger.warn('Ignored message not coming '
                + 'from external authnetication window');

            return;
        }

        let jwt;

        if (data && (jwt = data.jwtToken)) {
            logger.info('Received JSON Web Token (JWT):', jwt);

            APP.store.dispatch(setJWT(jwt));

            const roomName = room.getName();

            openConnection({
                retry: false,
                roomName
            }).then(connection => {
                // Start new connection
                const newRoom = connection.initJitsiConference(
                    roomName, APP.conference._getConferenceOptions());

                // Authenticate from the new connection to get
                // the session-ID from the focus, which wil then be used
                // to upgrade current connection's user role

                newRoom.room.moderator.authenticate()
                .then(() => {
                    connection.disconnect();

                    // At this point we'll have session-ID stored in
                    // the settings. It wil be used in the call below
                    // to upgrade user's role
                    room.room.moderator.authenticate()
                        .then(() => {
                            logger.info('User role upgrade done !');
                            // eslint-disable-line no-use-before-define
                            unregister();
                        })
                        .catch((err, errCode) => {
                            logger.error('Authentication failed: ',
                                err, errCode);
                            unregister();
                        });
                })
                .catch((error, code) => {
                    unregister();
                    connection.disconnect();
                    logger.error(
                        'Authentication failed on the new connection',
                        error, code);
                });
            }, err => {
                unregister();
                logger.error('Failed to open new connection', err);
            });
        }
    }

    /**
     *
     */
    function unregister() {
        window.removeEventListener('message', listener);
    }

    if (window.addEventListener) {
        window.addEventListener('message', listener, false);
    }
}

/**
 * Authenticate on the server.
 * @param {JitsiConference} room
 * @param {string} [lockPassword] password to use if the conference is locked
 */
function doXmppAuth (room, lockPassword) {
    let participantType = window.sessionStorage.getItem("participantType");
    let hostUsername = participantType == "host" ? 
        (window.sessionStorage.getItem("hostUsername") || "") : "";
    let hostPassword = participantType == "host" ?
        (window.sessionStorage.getItem("hostPassword") || "") : "";
    
    const { showPrejoin } = APP.store.getState()['features/prejoin'];
    if(showPrejoin) {
        return;
    }
    if(participantType) {
        room.authenticateAndUpgradeRole({
            id: toJid(hostUsername, config.hosts),
            password: hostPassword,
            roomPassword: lockPassword,

            /** Called when the XMPP login succeeds. */
            onLoginSuccessful() {
                console.log('connection.FETCH_SESSION_ID')
            }
        })
        .then(
            /* onFulfilled */ () => {
                console.log('connection.GOT_SESSION_ID')

                // hide PrejoinPage 
                _setPrejoinPageVisibility(false)
                _setInterimPrejoinPage(false)

                // Clear PrejoinPage error
                _setPrejoinPageErrorMessage(null)
                

            },
            /* onRejected */ error => {
                logger.error('NEW FLOW authenticateAndUpgradeRole failed', error);
                
                //show the old flow if error occurs
                //oldLoginFlow(room, lockPassword);

                //setTimeout(() => {
                   
                
               /*const { interimPrejoin } = APP.store.getState()['features/prejoin'];
               if(interimPrejoin) {
                    _setPrejoinPageErrorMessage(error)
                   return;
               }*/
                    

                    /*
                        // Show PrejoinPage
                        _setPrejoinPageVisibility(true)
                        _setInterimPrejoinPage(true)

                        // Show error on the page
                        _setPrejoinPageErrorMessage(error)
                        */
                    
                   
                    APP.conference.init({
                        roomName: APP.conference.roomName//,
                        //refreshTracksOnly: true
                    }).then(()=>{
                         // Show PrejoinPage
                         _setPrejoinPageVisibility(true)
                         _setInterimPrejoinPage(true)

                        // Show error on the page
                        if(participantType == 'guest') {
                            error.connectionError = "dialog.guestErrorMessage"
                        }

                        _setPrejoinPageErrorMessage(error)

                    }).catch(error => {
                        //APP.API.notifyConferenceLeft(APP.conference.roomName);
                        logger.error(error);
                    });
                    
                    //handleLoginError(error)
                //}, 1)
            }
        )
    }
    // else {
    //     oldLoginFlow(room, lockPassword)
    // }
}

function oldLoginFlow(room, lockPassword) {
    loginDialog = LoginDialog.showAuthDialog(
        /* successCallback */ (id, password) => {
            room.authenticateAndUpgradeRole({
                id,
                password,
                roomPassword: lockPassword,

                /** Called when the XMPP login succeeds. */
                onLoginSuccessful() {
                    loginDialog.displayConnectionStatus(
                        'connection.FETCH_SESSION_ID');
                }
            })
            .then(
                /* onFulfilled */ () => {
                    loginDialog.displayConnectionStatus(
                        'connection.GOT_SESSION_ID');
                    loginDialog.close();
                },
                /* onRejected */ error => {
                    logger.error('authenticateAndUpgradeRole failed', error);

                    handleLoginError(error)
                });
        },
        /* cancelCallback */ () => loginDialog.close());
}

function _setInterimPrejoinPage(visible) {
    APP.store.dispatch(setInterimPrejoinPage(visible))
}

function _setPrejoinPageVisibility(visible) {
    APP.store.dispatch(setPrejoinPageVisibility(visible))
}



function _setPrejoinPageErrorMessage(error) {
    let messageKey = error ? 'dialog.connectErrorWithMsg' : null;
    if(!messageKey) {
        return null;
    }
    
    let errorKey = '';
    const { authenticationError, connectionError, message } = error;
    if (authenticationError) {
        errorKey = (message === JitsiConferenceErrors.CONFERENCE_HOST_NOT_AUTHORIZED) ? 
                                message : 'connection.GET_SESSION_ID_ERROR';
    } else if (connectionError) {
        errorKey = connectionError;
    }
    if (errorKey === JitsiConnectionErrors.PASSWORD_REQUIRED) {
        // this is a password required error, as login window was already
        // open once, this means username or password is wrong
        messageKey = 'dialog.incorrectPassword';
    } else if (errorKey === JitsiConferenceErrors.CONFERENCE_HOST_NOT_AUTHORIZED) {
        // this is a CONFERENCE_HOST_NOT_AUTHORIZED error, as login window was already
        // open once, this means username or password does not match that of the host.
        messageKey = 'dialog.invalidHost';
    } else if (errorKey) {
        messageKey = errorKey
    }

    APP.store.dispatch(setPrejoinPageErrorMessageKey(messageKey))
    
}

function handleLoginError(error) {
    const { authenticationError, connectionError, message } = error;
    if (authenticationError) {
        let error = (message === JitsiConferenceErrors.CONFERENCE_HOST_NOT_AUTHORIZED) ? message : 'connection.GET_SESSION_ID_ERROR';
        loginDialog.displayError(
            error,
            { msg: authenticationError });
    } else if (connectionError) {
        loginDialog.displayError(connectionError);
    }
}

/**
 * Authenticate for the conference.
 * Uses external service for auth if conference supports that.
 * @param {JitsiConference} room
 * @param {string} [lockPassword] password to use if the conference is locked
 */
function authenticate(room, lockPassword) {
    if (isTokenAuthEnabled || room.isExternalAuthEnabled()) {
        doExternalAuth(room, lockPassword);
    } else {
        doXmppAuth(room, lockPassword);
    }
}

/**
 * De-authenticate local user.
 *
 * @param {JitsiConference} room
 * @param {string} [lockPassword] password to use if the conference is locked
 * @returns {Promise}
 */
function logout(room) {
    return new Promise(resolve => {
        room.room.moderator.logout(resolve);
    }).then(url => {
        // de-authenticate conference on the fly
        if (room.isJoined()) {
            room.join();
        }

        return url;
    });
}

/**
 * Notify user that authentication is required to create the conference.
 * @param {JitsiConference} room
 * @param {string} [lockPassword] password to use if the conference is locked
 */
function requireAuth(room, lockPassword) {
    let participantType = window.sessionStorage.getItem("participantType");
    if(participantType) {
        //if(loginDialog)
        //    return;
        authenticate(room, lockPassword)
    }
    else {
        if (authRequiredDialog) {
            return;
        }
        authRequiredDialog = LoginDialog.showAuthRequiredDialog(
            room.getName(), authenticate.bind(null, room, lockPassword)
        );
    }
}

/**
 * Close auth-related dialogs if there are any.
 */
function closeAuth() {
    if (externalAuthWindow) {
        externalAuthWindow.close();
        externalAuthWindow = null;
    }

    if (authRequiredDialog) {
        authRequiredDialog.close();
        authRequiredDialog = null;
    }
}

/**
 *
 */
function showXmppPasswordPrompt(roomName, connect) {
    return new Promise((resolve, reject) => {
        const authDialog = LoginDialog.showAuthDialog(
            (id, password) => {
                connect(id, password, roomName).then(connection => {
                    authDialog.close();
                    resolve(connection);
                }, err => {
                    if (err === JitsiConnectionErrors.PASSWORD_REQUIRED) {
                        authDialog.displayError(err);
                    } else {
                        authDialog.close();
                        reject(err);
                    }
                });
            }
        );
    });
}

/**
 * Show Authentication Dialog and try to connect with new credentials.
 * If failed to connect because of PASSWORD_REQUIRED error
 * then ask for password again.
 * @param {string} [roomName] name of the conference room
 * @param {function(id, password, roomName)} [connect] function that returns
 * a Promise which resolves with JitsiConnection or fails with one of
 * JitsiConnectionErrors.
 * @returns {Promise<JitsiConnection>}
 */
function requestAuth(roomName, connect) {
    if (isTokenAuthEnabled) {
        // This Promise never resolves as user gets redirected to another URL
        return new Promise(() => redirectToTokenAuthService(roomName));
    }

    return showXmppPasswordPrompt(roomName, connect);

}

export default {
    authenticate,
    requireAuth,
    requestAuth,
    closeAuth,
    logout
};
