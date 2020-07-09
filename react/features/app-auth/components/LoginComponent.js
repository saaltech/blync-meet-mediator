/* @flow */

import React from 'react';

import { translate } from '../../base/i18n';
import { resolveAppLogin } from '../actions'
import { InputField } from '../../base/premeeting';

import {
    Icon,
    IconSignInLock
} from '../../base/icons';

import { useState, useEffect } from 'react';
// import Router from 'next/router';
import useRequest from '../../hooks/use-request';

function LoginComponent(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formDisabled, setFormDisabled] = useState(true);
  
  useEffect(() => {
    if(email != "" && password != "") {
        setFormDisabled(false)
    }
    else {
        setFormDisabled(true)
    }
  });

  const { closeAction, isOverlay = false, t} = props
  const { doRequest, errors } = useRequest({
    url: '/auth/user/signin',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: (data) => onSuccess(data)
  });

  const onSubmit = async event => {
      if(formDisabled) {
          return;
      }
      event.preventDefault();
      // TODO: uncomment this once the api is ready
      //await doRequest();
      // TODO: this is not once the above is implemented
      onSuccess(null)
  };

  const onSuccess = (data) => {
        // TODO: implement appLogin
        data = {
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
            "meeting_access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJtNVhlWnZQYzBMcDY5WHM5Yl83MmciLCJzdWIiOiJkZXYtYmx5bmMtbWVldGluZyIsImlzcyI6ImRldi1ibHluYy5zYWFsLmFpIiwiaWF0IjoxNTk0MTg4ODA3LCJleHAiOjE2MjU3NDM0NTgsInNjb3BlIjoib3BlbmlkIiwiYXVkIjoic21lZXRpbmciLCJyb29tIjoiKiIsInJvbGUiOiJtYW5hZ2VyIiwiY29udGV4dCI6eyJ1c2VyIjp7Im5hbWUiOiJWaWtyYW0gUG9kdXZhbCIsImVtYWlsIjoidmlrcmFtQHNhYWwuYWkiLCJhdmF0YXIiOiJodHRwczovZ3JhdmF0YXIuY29tL2F2YXRhci9hYmMxMjMiLCJnZW5kZXIiOiJNYWxlIiwibW9iaWxlIjoiMDU0NzkzNTA5OCIsImlkIjoiNWYwMzQyYTA0YjQ3NzY0NTZhNDNiNzI3In0sImdyb3VwIjoiYTEyMy0xMjMtNDU2LTc4OSJ9fQ._SJ2B2g7jOrfh2OvYPu-8dJup_CkqxAkF7g5s6x5Nok"
        }

        APP.store.dispatch(resolveAppLogin(data))
  }

  return (
      <div className={`appLoginComponent ${isOverlay ? 'overlay': ''}`}>
        {
            isOverlay && <div className="modal-overlay" id="modal-overlay"/>
        }
        <div className={`${isOverlay ? 'modal': 'inlineComponent'}`}>
            {
                isOverlay && <div onClick={closeAction} className="close-icon"></div>
            }
            <div className="content">
                <Icon src = { IconSignInLock } />
                <h2>{ t('loginPage.signinLabel') }</h2>
                <div className="form-field">
                    <div className = 'form-label'>{t('loginPage.fieldUsername')}</div>
                    <InputField
                        onChange = {value => setEmail(value.trim())}
                        placeHolder = { t('loginPage.placeholderUsername') }
                        value = { email } />
                </div>
                <div className="form-field">
                    <div className = 'form-label'>{t('loginPage.fieldPassword')}</div>
                    <InputField
                        type="password"
                        onChange = { value => setPassword(value.trim()) }
                        placeHolder = { t('loginPage.placeholderPassword') }
                        value={password} />
                </div>

                <div
                    className = { `login-page-button ${formDisabled ? 'disabled': ''}` }
                    onClick = { onSubmit }>
                    {
                        t('loginPage.loginLabel')
                    }
                </div>

                <div className="error">{errors}</div>
            </div>
        </div>
      </div>
  );
};

export default translate(LoginComponent);
