//
// LIBRARIES
//

import Test from 'Test.vue';
import Test2 from 'Test2.vue';
import _404 from '404.vue';
import PostGreDemo from 'PostGreDemo.vue';

import ExampleMap from 'pages/ExampleMap.vue';
import TrackDemo from 'pages/TrackDemo.vue';
import Signin from 'pages/Signin.vue';
import Registration from 'pages/Registration.vue';
import User_update from 'pages/User_update.vue';
import DisplayTrack from 'pages/DisplayTrack.vue';
import BrowseComponents from 'pages/BrowseComponents.vue';

import App from 'App.vue';

import * as config from 'config';

//
// FRONTEND ROUTING
//

let routes = [

    //
    // Redirect
    //

    {
        path: 'index.html',
        redirect: '/'
    },
    {
        path: 'index.htm',
        redirect: '/'
    },
    {
        path: 'index',
        redirect: '/'
    },

    //
    // Pages
    //

    {
        path: '/',
        redirect: 'signin'
        // component: BrowseComponents,
        // meta: { auth: true }
    },

    {
        path: 'browse',
        component: BrowseComponents,
        meta: { auth: true }
    },

    {
        path: 'track',
        component: TrackDemo,
        meta: { auth: true }
    },

    {
        path: 'map',
        component: ExampleMap,
        meta: { auth: true }
    },

    {
        path: 'signin',
        component: Signin
    },

    {
        path: 'registration',
        component: Registration
    },

    {
        path: 'display/:tracks',
        component: DisplayTrack,
        meta: { auth: true }
    },

    {
        path: 'test',
        component: Test,
        meta: { auth: true }
    },

    {
        path: 'test2',
        component: Test2,
        meta: { auth: true }
    },

    {
        path: 'db',
        component: PostGreDemo,
        meta: { auth: true }
    },

    {
        path: '*',
        component: _404
    },

];

routes = [
    {
        path: config.path_prefix,
        children: routes,
        component: App
    },
    {
        path: '*',
        component: _404
    }
];

// Frontend routes.
export default routes;
