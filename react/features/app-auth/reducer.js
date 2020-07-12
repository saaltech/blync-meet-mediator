/* @flow */

import { assign, ReducerRegistry } from '../base/redux';

import {
    APP_LOGIN,
    SET_USER_SIGNED_OUT,
    EXPIRE_TOKEN,
    SET_POST_WELCOME_SCREEN_DETAILS
} from './actionTypes';

import { PersistenceRegistry } from '../base/storage';

/**
 * The redux subtree of this feature.
 */
const STORE_NAME = 'features/app-auth';

/**
 * Sets up the persistence of the feature {@code recent-list}.
 */
PersistenceRegistry.register(STORE_NAME);

ReducerRegistry.register(STORE_NAME, (state =  {}, action) => {
    switch (action.type) {
        case APP_LOGIN: {
            return assign(state, {
                meetingAccessToken: action.payload.meeting_access_token,
                accessToken: action.payload.access_token,
                expires: action.payload.expires,
                refreshToken: action.payload.refresh_token,
                error: action.error,
                user: action.payload.user
            });
        }

        case SET_USER_SIGNED_OUT: {
            return assign(state, {
                isUserSignedOut: action.payload
            })
        }

        case EXPIRE_TOKEN: {
            return assign(state, {
                expires: 0,
                isUserSignedOut: true
            })
        }

        case SET_POST_WELCOME_SCREEN_DETAILS: {
            return assign(state, {
                meetingDetails: action.meetingDetails 
            }) //postWelcomePageScreen
        }
    }
    return state;
});

