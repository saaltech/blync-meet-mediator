// @flow

import type { Dispatch } from 'redux';

import {
    SHOW_LOGIN,
    APP_LOGIN
} from './actionTypes';
import { LoginComponent } from './components';
import logger from './logger';

import { isTokenExpired } from './functions'

/**
 * Set Login tokens or error if any 
 *
 * @returns {{
 *     type: APP_LOGIN
 * }}
 */
export function resolveAppLogin(details) {
    return (dispatch: Dispatch<any>, getState: Function) => {
        dispatch({ type: APP_LOGIN, payload: details });
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
