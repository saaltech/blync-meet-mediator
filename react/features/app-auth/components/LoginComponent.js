/* @flow */

import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import type { Dispatch } from 'redux';

import { ColorSchemeRegistry } from '../../base/color-scheme';
import { translate } from '../../base/i18n';
import { JitsiConnectionErrors } from '../../base/lib-jitsi-meet';
import type { StyleType } from '../../base/styles';
import { authenticateAndUpgradeRole, cancelLogin } from '../actions';
import { appLogin } from '../functions'
import { InputField } from '../../base/premeeting';


import {
    Icon,
    IconSignInLock
} from '../../base/icons';
// Register styles.
import './styles';

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
      await doRequest();
  };

  const onSuccess = (data) => {
        // TODO: implement appLogin
        appLogin(data);
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
                <h2>Sign In</h2>
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
