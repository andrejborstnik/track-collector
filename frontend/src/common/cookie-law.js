//
// EU COOKIE LAW
//


//
// LIBRARIES
//

// Instructions at:
//      URL: http://cookiesdirective.com/
import _cookiesdirective from 'cookiesdirective';

// vue.js web framework library.
import Vue from 'vue';

// Cookies support.
import * as cookies from 'common/cookies';


// API.
// import async from 'co';             // Co async support.

//
// FUNCTIONS
//


export function storeCookieDirective() {
    let session_cookie = cookies.get_session_cookie();
    let directive_cookie = cookies.get_directive_cookie();

    if (directive_cookie && session_cookie && !session_cookie.cookies_accepted) {
        // Update store.
        // Vue.set(store.state.user, "cookies_accepted", true);

        // Update session cookie.
        // cookies.update_session_cookie({cookies_accepted: true});

        // Update database. todo save cookie accepted to db.
        // async(function*() {
        //     let {data} = yield this.$gql.mutate({
        //         mutation: gql`mutation updateAccount($id: ID!, $account: AccountIn) {
        //             updateAccount(id: $id, account: $account) {
        //                 id
        //             }
        //         }`,
        //         variables: {
        //             id: session_cookie.user_id,
        //             account: {
        //                 cookies_accepted: true,
        //                 tos_accepted: "1.0",
        //             }
        //         }
        //     });
        // });
    }
}


export function cookie_law() {
    $.cookiesDirective({
        privacyPolicyUri: '/privacy',
        termsOfUseUri: '/terms',
        explicitConsent: true,
        duration: 99999,
        position: 'bottom',
        reload: false,
        scriptWrapper: storeCookieDirective,
        onConfirm: storeCookieDirective,
        backgroundColor: 'rgba(10,10,10,.85)',
        linkColor: '#ffffff'
    });
}
