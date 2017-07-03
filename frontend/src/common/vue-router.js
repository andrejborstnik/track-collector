//
// LIBRARIES
//


// vue.js web framework library.
import Vue from 'vue';

// Vue single page application routing.
import VueRouter from 'vue-router';

// Import routes.
import routes from 'src/routes';

// Color pallete
import ColorPallete from 'common/ColorPallete';

// storage
import MultiTrackStorage from 'common/MultiTrackStorage';

// Store
let store = {
    user: {
        cookies_accepted: false,
        email: null,
        token: null,
        admin: false,
        groups: null,
        trackStorage: new MultiTrackStorage(),
        bottomNavigation: [
            {
              action: function() {console.log("f1");},
              text: "Recents",
              icon: "history",
              key: 1
            },
            {
              action: function() {console.log("f2");},
              text: "Favorites",
              icon: "favorite",
              key: 2
            },
            {
              action: function() {console.log("f3");},
              text: "Nearby",
              icon: "place",
              key: 3
            }
        ]
    },
    state: {
        path_to: null,
        path_from: null
    },
    providers: [],
    groups: [],
    pallete: new ColorPallete()
};

Object.defineProperty(Vue.prototype, '$store', {
    get () {
        return this.$root.store
    }
});

// Vuetify
import Vuetify from 'vuetify';
Vue.use(Vuetify);

// Import main application.
import main_app from 'src/App.vue';

// Cookies support.
import { cookie_law } from 'common/cookie-law';
import * as cookies from 'common/cookies';

import * as config from 'config';

//
// ROUTING
//


// Vue router.
Vue.use(VueRouter);

// Only authenticated users (they have a session cookie) can see specific pages.
let readSessionCookie = function (router, {to, from}) {
    cookie_law();

    let session_cookie = cookies.get_session_cookie();
    if (session_cookie) {
        Vue.set(store.user, "email", session_cookie.email);
        Vue.set(store.user, "token", session_cookie.token);
        Vue.set(store.user, "admin", session_cookie.admin);
        Vue.set(store.user, "cookies_accepted", session_cookie.cookies_accepted);
    }
    else {
        for (let key of ['email', 'token', 'admin'])
            store.user[key] = null;
    }

    // Set directives cookie.
    if (session_cookie && session_cookie.cookies_accepted)
        cookies.set_directive_cookie();

    if (!session_cookie && to.meta.auth) {

        // Setting so the next component knows where we came from. todo
        // Vue.set(store.component.signin, "returnToUrl", to.path);

        console.log(config)
        return `${config.url_prefix}/signin`;
    }

};

// Create a router instance.
let router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => { // Check authentication before each transition.
    // Store paths to global store.
    if (store.state) {
        Vue.set(store.state, "path_to", to.path);
        Vue.set(store.state, "path_from", from.path);
    }

    // Check if there is session cookie (and user).
    let newurl = readSessionCookie(router, {to, from});
    if (newurl) {
        Vue.set(store.state, "path_to", newurl);
        next(newurl);
    }
    else
        next();
});

// Start router.
new Vue({
  el: 'app',
  router: router,
  data: function () {
      return {
          store
      }
  },
  render: h => h('router-view')
});
