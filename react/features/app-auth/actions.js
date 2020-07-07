// @flow

import type { Dispatch } from 'redux';

import {
    SHOW_LOGIN,
    APP_LOGIN,
    EXPIRE_TOKEN
} from './actionTypes';
import { LoginComponent } from './components';
import logger from './logger';

import { isTokenExpired } from './functions'

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

export function resolveAppLogout() {
    return (dispatch: Dispatch<any>, getState: Function) => {

        dispatch({ type: EXPIRE_TOKEN });
        dispatch(decideAppLogin())
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
        dispatch({ type: SHOW_LOGIN, payload: !isTokenExpired() });
    }
}
