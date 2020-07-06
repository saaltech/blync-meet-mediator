export function isTokenExpired() {
    const { meetingAccessToken = { exp: 0 } } = APP.store.getState()['features/app-auth']
    let isValid = false;
    if( meetingAccessToken.exp > (new Date()).getTime()) {
        isValid = true;
    }
    return isValid;
}

export function appLogin(username, password) {
    
}