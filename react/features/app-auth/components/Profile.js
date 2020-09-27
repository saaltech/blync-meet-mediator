/* @flow */

import React from 'react';

import { translate } from '../../base/i18n';

import { connect } from '../../base/redux';

import { resolveAppLogout } from '../actions'

import { useState, useEffect } from 'react';

import useRequest from '../../hooks/use-request';

import { Avatar } from '../../base/avatar';

import googleApi from '../../google-api/googleApi';
import { signOut } from '../../google-api'

import {
    Icon,
    IconMenuDown,
    IconMenuUp,
    IconLogout
} from '../../base/icons';

function Profile(props) {
  const [menuExpanded, setMenuExpanded] = useState(false);

  const { showMenu = false, user = {}, t, disableMenu = true } = props;

  const wrapperRef = React.createRef();

  /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event) => {
        if (wrapperRef && wrapperRef.current 
            && !wrapperRef.current.contains(event.target)) {
                showMenu && setMenuExpanded(false)
        }
    }

    const logout = () => {
        if(googleApi.isSignedIn()) {
            APP.store.dispatch(signOut())
        }
        APP.store.dispatch(resolveAppLogout())
    }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
  });


  return (
      <div className={`userProfile`} onClick={() => showMenu && setMenuExpanded(!menuExpanded)}>
        <Avatar size={"54"} className="avatarProfile" displayName={ user.name } url={ user.avatar }/>
        <div className={"userName"}>{ user.name }</div>
        {
            showMenu &&
            <div className="menuIcon">
                {
                    !menuExpanded ?
                    <Icon src = { IconMenuDown } />
                    :
                    <Icon src = { IconMenuUp } />
                }
                {
                    menuExpanded &&
                    <ul 
                        ref={wrapperRef}
                        className="profileMenu">
                        <li onClick={logout}> 
                            <Icon src = { IconLogout } /> 
                            <div className="menuLabel">
                               { t('profile.logout') } 
                            </div>
                        </li>
                    </ul>
                }
            </div>
        }
      </div>
  );
};

function _mapStateToProps(state: Object) {
    return {
        user : state['features/app-auth'].user || {}
    };
}

export default translate(connect(_mapStateToProps)(Profile));
