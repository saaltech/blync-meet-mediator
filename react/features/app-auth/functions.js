import axios from 'axios';
import { config } from '../../config'

export function isTokenExpired() {
    const { expires = 0 } = APP.store.getState()['features/app-auth']
    let isValid = false;
    if( expires > (new Date()).getTime()) {
        isValid = true;
    }
    return isValid;
}

export function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


export function setToken(tokenRequired, authenticationHeader = false) {
    let headerDetails = {
      'Content-Type': 'application/json'
    }

    if(authenticationHeader) {
        headerDetails["Authentication"] = APP.store.getState()['features/app-auth'].accessToken
    }

    if(tokenRequired) {
      Object.assign(headerDetails, {
              'Authorization': 'Bearer ' + APP.store.getState()['features/app-auth'].accessToken
          }
      )
    }

    return  {
      'headers': headerDetails
    }
  }

export async function saveHostJidToUserMapping(connection) {

    if(connection.xmpp && connection.xmpp.connection &&
        connection.xmpp.connection._stropheConn.jid) {
        try {
            await axios.post(
                config.authenticatedIRP + config.jidEP, 
                { 
                    jid: connection.xmpp.connection._stropheConn.jid
                }, 
                setToken(true, true));
            } catch (err) {
            console.log("Unable to save Jid to Host mapping",err)
            }
    }
}
