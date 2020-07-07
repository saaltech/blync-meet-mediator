export function isTokenExpired() {
    const { expires = 0 } = APP.store.getState()['features/app-auth']
    let isValid = false;
    if( expires > (new Date()).getTime()) {
        isValid = true;
    }
    return isValid;
}
