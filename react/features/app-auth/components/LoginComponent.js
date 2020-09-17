/* @flow */

import React, { useState, useEffect } from 'react';

import { config } from '../../../config';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import {
    Icon,
    IconSignInLock
} from '../../base/icons';
import { InputField } from '../../base/premeeting';

import {
    CALENDAR_TYPE,
    signIn
} from '../../calendar-sync';

import {
    updateProfile, GoogleSignInButton
} from '../../google-api';


// import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import { resolveAppLogin } from '../actions';

function LoginComponent(props) {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ isSocialLogin, setIsSocialLogin ] = useState(false);
    const [ formDisabled, setFormDisabled ] = useState(true);
    const { errorMsg, noSignInIcon = false, googleOfflineCode,
            closeAction, isOverlay = false, hideLogin = false, t } = props;

    useEffect(() => {
        async function socialLogin() {
            await doSocialSignIn(false);
        }
        
        if(isSocialLogin && googleOfflineCode) {
            socialLogin();
            setIsSocialLogin(false)
        }
    }, [props.googleOfflineCode]);

    useEffect(() => {
        if (email != '' && password != '') {
            setFormDisabled(false);
        } else {
            setFormDisabled(true);
        }
    });

    const [ doRequest, errors ] = useRequest({
        url: config.unauthenticatedIRP + config.signInEP,
        method: 'post',
        body: {
            username: email,
            password
        },
        onSuccess: data => onSuccess(data)
    });

    const [ doSocialSignIn, errorsSocialSignIn ] = useRequest({
        url: config.unauthenticatedIRP + config.socialSignInEP,
        method: 'post',
        body: {
            code: googleOfflineCode,
            provider: 'google'
        },
        onSuccess: data => onSuccess(data)
    });

    const onSubmit = async event => {
        event.preventDefault();

        if (formDisabled) {
            return;
        }

        // TODO: uncomment this once the api is ready
        await doRequest(false);

        // TODO: this is not require once the above is implemented
        // onSuccess(null)
    };

    const onSuccess = data => {
        // TODO: implement appLogin
        /* data = {
            "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVmMDJlYzA0NzIyNTljNmFhYjRjMzljYiJ9.eyJqdGkiOiJ-UUVWRUNMMUhfMW5TWFFSfm9tcW0iLCJzdWIiOiI1ZjAzNDJhMDRiNDc3NjQ1NmE0M2I3MjciLCJpc3MiOiJodHRwOi8vbG9jYWwtdGVzdGluZy1tZWV0aW5nLW9yeXhfaWRwIiwiaWF0IjoxNTk0MDU1MTY5LCJleHAiOjE1OTQwNjIzNjksInNjb3BlIjoib3BlbmlkIiwibmFtZSI6Ik1hbm9qIEJoYWdhdCIsImVtYWlsIjoibWFub2pAc2FhbC5haSIsInJvbGUiOiJtYW5hZ2VyIiwiZ2VuZGVyIjoiTWFsZSIsIm1vYmlsZSI6IjA1NDc5MzUwOTgiLCJhdmF0YXIiOiJodHRwczovZ3JhdmF0YXIuY29tL2F2YXRhci9hYmMxMjMiLCJncm91cCI6ImExMjMtMTIzLTQ1Ni03ODkiLCJrZXkiOiJtYW5vakBzYWFsLmFpIiwiYXVkIjoibG9jYWwtbWVldGluZy1pcnAifQ.DMo8ts0SfNuuv8K0n9GGWhZGIDBGmjUCf_R4ASweiUOMGlaNtNcoiYaw2AeR6lC47glQMVsiuSBskxNvhRnyy6AyXlC6tAuGmnb5KIbF-aAU0OT-NmNhKgeN1FPLL-r780d24LI0ISyqrLxHcH11vm3by4YXB9qe5GoiWwWfr8Pw7KNwfdGharWzavhjJvwSzjIgY8p4T43PTaEqXNXxtF4NyB69lCzCaBezBlo8IkYTodTpKCKFVT0mOmjETro2tHXADebjC8SPHiGtW_cZmdQw1Qpm63faX-_GAFEg9gVuQP040MojxhTIISRHmgkq6FGmYI8GKa9UAIYtv9NIsg",
            "expires_in": 7200,
            "token_type": "Bearer",
            "refresh_token": "JdNXdMNL7cA3eJ6j329tuIfSBDW",
            "user": {
                "id": "5f0342a04b4776456a43b727",
                "name": "Vikram Poduval",
                "email": "vikram@saal.ai",
                "role": "manager",
                "gender": "Male",
                "mobile": "576898675",
                "avatar": "https://gravatar.com/avatar/abc123",
                "group": "a123-123-456-789",
                "key": "vikram@saal.ai"
            },
            // meeting.nsquarez.com
            "meeting_access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJtNVhlWnZQYzBMcDY5WHM5Yl83MmciLCJzdWIiOiJtZWV0aW5nLm5zcXVhcmV6LmNvbSIsImlzcyI6Im1lZXRpbmduc3F1YXJleiIsImlhdCI6MTU5NDE4ODgwNywiZXhwIjoxNjI1OTA2NjA2LCJzY29wZSI6Im9wZW5pZCIsImF1ZCI6InNtZWV0aW5nIiwicm9vbSI6IioiLCJyb2xlIjoibWFuYWdlciIsImNvbnRleHQiOnsidXNlciI6eyJuYW1lIjoiTmVlaGFsIFNoYWlraCIsImVtYWlsIjoibmVlaGFsQHNhYWwuYWkiLCJhdmF0YXIiOiJodHRwczovZ3JhdmF0YXIuY29tL2F2YXRhci9hYmMxMjMiLCJnZW5kZXIiOiJNYWxlIiwibW9iaWxlIjoiMDU0NzkzNTA5OCIsImlkIjoiNWYwMzQyYTA0YjQ3NzY0NTZhNDNiNzI3In0sImdyb3VwIjoiYTEyMy0xMjMtNDU2LTc4OSJ9fQ.o88nFjeph2DcZkIOSUxvegoFQftoFlyOOH6bQyB4c7M",

            // dev-blync.saal.ai
            //"meeting_access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJtNVhlWnZQYzBMcDY5WHM5Yl83MmciLCJzdWIiOiJkZXYtYmx5bmMuc2FhbC5haSIsImlzcyI6ImRldi1ibHluYy1tZWV0aW5nIiwiaWF0IjoxNTk0MTg4ODA3LCJleHAiOjE2MjU3NDM0NTgsInNjb3BlIjoib3BlbmlkIiwiYXVkIjoic21lZXRpbmciLCJyb29tIjoiKiIsInJvbGUiOiJtYW5hZ2VyIiwiY29udGV4dCI6eyJ1c2VyIjp7Im5hbWUiOiJWaWtyYW0gUG9kdXZhbCIsImVtYWlsIjoidmlrcmFtQHNhYWwuYWkiLCJhdmF0YXIiOiJodHRwczovZ3JhdmF0YXIuY29tL2F2YXRhci9hYmMxMjMiLCJnZW5kZXIiOiJNYWxlIiwibW9iaWxlIjoiMDU0NzkzNTA5OCIsImlkIjoiNWYwMzQyYTA0YjQ3NzY0NTZhNDNiNzI3In0sImdyb3VwIjoiYTEyMy0xMjMtNDU2LTc4OSJ9fQ.Gi7a8X6aWIfxGy2opHTSamWCo9-XZaFe_r9sp4pAW9I"
        }*/

        APP.store.dispatch(resolveAppLogin(data));

        closeAction();

    };

    /**
     * Clear login form
     */
    const clearForm = () => {
        setEmail("");
        setPassword("");
    }

    /**
     * Starts the sign in flow for Google calendar integration.
     *
     * @private
     * @returns {void}
     */
    const _onClickGoogle = () => {
        clearForm()
        isOverlay && closeAction();
        setIsSocialLogin(true);
        APP.store.dispatch(signIn(CALENDAR_TYPE.GOOGLE));
        // setTimeout(() => {
        //     APP.store.dispatch(updateProfile());
        // }, 500);
    }

    return (
        <div className = { `appLoginComponent ${isOverlay ? 'overlay' : ''}` }
            style={{
                visibility: hideLogin ? 'hidden': 'visible'
            }}
        >
            {
                isOverlay && <div
                    className = 'modal-overlay'
                    id = 'modal-overlay' />
            }
            <div className = { `${isOverlay ? 'modal' : 'inlineComponent'}` }>
                {
                    isOverlay && <div
                        onClick = { closeAction }
                        className = 'close-icon' />
                }
                <div className = { `${isOverlay ? 'content' : 'inline-content'}` }>
                    { !noSignInIcon && <Icon src = { IconSignInLock } /> }
                    <h2>{ t('loginPage.signinLabel') }</h2>
                    <form onSubmit={onSubmit}>
                        <div className = 'form-field'>
                        <div className = 'form-label'>{t('loginPage.fieldUsername')}</div>
                            <InputField
                                onChange = { value => setEmail(value.trim()) }
                                focused = { true }
                                placeHolder = { t('loginPage.placeholderUsername') }
                                value = { email } />
                        </div>
                        <div className = 'form-field'>
                            <div className = 'form-label'>{t('loginPage.fieldPassword')}</div>
                            <InputField
                                type = 'password'
                                onChange = { value => setPassword(value.trim()) }
                                placeHolder = { t('loginPage.placeholderPassword') }
                                value = { password } />
                        </div>

                        <div
                            className = { `login-page-button ${formDisabled ? 'disabled' : ''}` }
                            onClick = { onSubmit }>
                            {
                                t('loginPage.loginLabel')
                            }
                        </div>

                        <button type="submit" style={{height: '0px', width: '0px', visibility: 'hidden'}}></button>
                    </form>
                    {
                        window.config.googleApiApplicationClientID &&
                        window.config.enableCalendarIntegration &&
                        <GoogleSignInButton
                            onClick = { _onClickGoogle }
                            text = { t('liveStreaming.signIn') } />
                    }
                    

                    <div className = 'error'>{errors || errorMsg}</div>
                </div>
            </div>
        </div>
    );
}

function _mapStateToProps(state: Object) {
    return {
        googleOfflineCode : state['features/app-auth'].googleOfflineCode
    };
}

export default translate(connect(_mapStateToProps)(LoginComponent));
