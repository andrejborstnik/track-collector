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
        provider: null,
        trackStorage: new MultiTrackStorage(),
        bottomNavigation: [],
        groupFilter: '',
        leftMenuEnabled: false,
        rightMenuEnable: false,
        messagesEnabled: true,
        historyEnabled: false,
        toolbarTitle: 'Tracker',
        messages: null,
        messageTo: null,   // linked to user receiver, if specified
        messageBaseGroup: null,  // if null, then messaging mode is "USER" otherwise it is "GROUP" and group name is in this variable
        sendingType: "NOTIFICATION", // NOTIFICATION, EMAIL
        messageTitle: null,
        messageText: null,
        errorTitle: '',
        errorMessage: '',
        showAlert: false,
        pointAnalysisType: "SPEED",   // 0-SPEED, 1-DELAY
        showPointLayer: true,
        operationMode: 'HISTORY',
        bottomNavState: null,
        intervalLiveLoad: null,
        selectedUser: {'username': null, 'groupId': null},
        defaultZoom: 8,
        defaultCenterCoordinates: [14.5, 46]
    },
    state: {
        path_to: null,
        path_from: null
    },
    event: {},
    providers: [],
    groups: [],
    pallete: new ColorPallete()
};

Object.defineProperty(Vue.prototype, '$store', {
    get () {
        return this.$root.store;
    }
});

// Events plugin

let EventsPlugin = {};

EventsPlugin.install = function (Vue, options) {
    Vue.mixin({
        mounted() {
            ['click', 'keydown', 'keyup', 'wheel', 'touchmove', 'mousedown', 'mouseup', 'mousewheel'].forEach(function (eventName) {
                document.addEventListener(eventName, function (event) {
                    this.$store.event = event;
                }.bind(this));
            }.bind(this));
        }
    });
};

Vue.use(EventsPlugin);

// Vuetify
import Vuetify from 'vuetify';
Vue.use(Vuetify);

// i18n configuration
import i18n from 'common/vue-translation'

// Import main application.
import main_app from 'src/App.vue';

// Cookies support.
import {cookie_law} from 'common/cookie-law';
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
        Vue.set(store.user, "provider", session_cookie.provider);
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
    i18n,
    data: function () {
        return {
            store
        }
    },
    render: h => h('router-view')
});
