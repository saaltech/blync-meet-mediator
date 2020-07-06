/* @flow */

import { assign, ReducerRegistry } from '../base/redux';

import {
    APP_LOGIN,
    SHOW_LOGIN
} from './actionTypes';

ReducerRegistry.register('features/app-auth', (state =  {}, action) => {
    switch (action.type) {
        case APP_LOGIN: {
            return assign(state, {
                meetingAccessToken: action.payload.meeting_access_token,
                accessToken: action.payload.access_token,
                error: action.error
            });
        }
            

        case SHOW_LOGIN: {
            return assign(state, {
                showAppLogin: action.payload
            })
        }
        
    }
    return state;
});

