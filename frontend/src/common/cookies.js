//
// FRONTEND COOKIES
//


//
// LIBRARIES
//


// Global app configuration.
import * as config from 'config';

// Utilities.
import _ from 'lodash';

// Cookies support.
import cookies from 'js-cookie';

//
// DIRECTIVES
//


export function set_session_cookie(email, token, admin, cookies_accepted, provider, name) {
    let session_cookie = {email, token, admin, cookies_accepted, provider, name};
    cookies.set('session', session_cookie, { expires: config.cookie_expiry });
}

export function update_session_cookie(obj) {
    let t_cookie = get_session_cookie();
    t_cookie = _.assign(t_cookie, obj);
    cookies.set('session', t_cookie, { expires: config.cookie_expiry });
}

export function get_session_cookie() {
    return cookies.getJSON('session');
}


export function remove_session_cookie() {
    cookies.remove('session');
}


export function get_directive_cookie() {
    return cookies.getJSON('cookiesDirective');
}


export function set_directive_cookie() {
    return cookies.set('cookiesDirective', "1", { expires: config.cookie_directive_expiry });
}
