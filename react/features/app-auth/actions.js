// @flow

import type { Dispatch } from 'redux';
import axios from 'axios';
import { config } from '../../config'

import {
    SET_USER_SIGNED_OUT,
    APP_LOGIN,
    EXPIRE_TOKEN,
    SET_POST_WELCOME_SCREEN_DETAILS
} from './actionTypes';
import { LoginComponent } from './components';
import logger from './logger';

import { isTokenExpired, setToken, validateToken } from './functions'

import {
    getRandomArbitrary
} from './functions'

/**
 * Set Login tokens or error if any and called only when login in
 *
 * @returns {{
 *     type: APP_LOGIN
 * }}
 */
export function resolveAppLogin(details) {
    return (dispatch: Dispatch<any>, getState: Function) => {
        if(details.expires_in > 0) {
            details.expires = (new Date()).getTime() + (details.expires_in * 1000)
        }

        dispatch({ type: APP_LOGIN, payload: details });
        dispatch(decideAppLogin())
    };
}

export function invalidateAndGoHome() {
    APP.store.dispatch(resolveAppLogout());
    window.location.href = window.location.origin + "?sessionExpired=true";
  }

export function resolveAppLogout() {
    return (dispatch: Dispatch<any>, getState: Function) => {

        dispatch({ type: EXPIRE_TOKEN });
    };
}

/**
 * Opens {@link LoginComponent} which will ask to enter username and password
 * for the current conference.
 *
 * @protected
 * @returns {Action}
 */
export function decideAppLogin() {
    // TODO: in future we could have verify token functionality here by making an IRP call
    // For now, just verify the meeting_access_token expiry
    return (dispatch: Dispatch<any>, getState: Function) => {
        dispatch({ type: SET_USER_SIGNED_OUT, payload: !isTokenExpired() });
    }
}

export function setPostWelcomePageScreen(room: string, meetingObj) {

    if(!meetingObj) {
        meetingObj = {
            meetingName: room,
            meetingId: getRandomArbitrary(10,99) + "-" + (new Date()).getTime() + "-" +
                getRandomArbitrary(100,999)
        }
    }
    
    return {
        type: SET_POST_WELCOME_SCREEN_DETAILS,
        meetingDetails : meetingObj
    };
}


async function validationFromNonComponents(tokenRequired) {
    let validToken = !tokenRequired || validateToken();

      //TODO check for !validToken once testing is done
      if(!validToken) {
        // Try refreshToken call
        let appAuth = APP.store.getState()['features/app-auth']
        let refreshToken = appAuth && appAuth.refreshToken

        if(refreshToken) {
          try {
            const res = await axios.post(
              config.refreshToken, 
              {
                refresh_token: refreshToken
              })
              APP.store.dispatch(resolveAppLogin(data))
              return true;
          }
          catch(e) {
            console.log("refresh Token error", e)
            if(e && e.response && e.response.status == 401) {
              // only in case of invalid grant
              invalidateAndGoHome();
              return false;
            }
          }
        }
        else {
          // if it fails, Clear features/app-auth and move to home page
          invalidateAndGoHome();
          return false;
        }
      }

      return true
}

export async function saveHostJidToUserMapping(connection) {

    if(connection.xmpp && connection.xmpp.connection &&
        connection.xmpp.connection._stropheConn.jid &&
        validationFromNonComponents(true)) {
        try {
            await axios.post(
                config.conferenceManager + config.jidEP, 
                { 
                    jid: connection.xmpp.connection._stropheConn.jid
                }, 
                setToken(true, true));
        } catch (err) {
            console.log("Unable to save Jid to Host mapping",err)
        }
    }
}
