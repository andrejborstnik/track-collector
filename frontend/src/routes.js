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
import resetPassword from 'pages/ResetPassword.vue';
import User_update from 'pages/User_update.vue';
import DisplayTrack from 'pages/DisplayTrack.vue';
import BrowseComponents from 'pages/BrowseComponents.vue';
import Profile from 'pages/Profile.vue';
import Groups from 'pages/Groups.vue';
import Follow from 'pages/Follow.vue';
import UserAddApp from 'pages/UserAddApp.vue';
import GroupsTest from 'pages/GroupsTest.vue';

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

    {
        path: '/',
        redirect: 'signin'
    },

    //
    // Pages
    //

    // Prve tiste, ki rabijo auth

    // AUTH TRUE

    {
        path: 'profile',
        component: Profile,
        meta: { auth: true }
    },

    {
        path: 'change_password',
        component: User_update,
        meta: { auth: true }
    },

    {
        path: 'groups',
        component: Groups,
        meta: { auth: true }
    },


    {
        path: 'track',
        component: TrackDemo,
        meta: { auth: true }
    },

    // OLD

    {
        path: 'test',
        component: Test,
        meta: { auth: true }
    },

    {
        path: 'db',
        component: PostGreDemo,
        meta: { auth: true }
    },

    {
        path: 'display/:tracks',
        component: DisplayTrack,
        meta: { auth: true }
    },

    {
        path: 'browse',
        component: BrowseComponents,
        meta: { auth: true }
    },


    {
        path: 'map',
        component: ExampleMap,
        meta: { auth: true }
    },

    // NO AUTH

    {
        path: 'signin',
        component: Signin,
        meta: { auth: false }
    },

    {
        path: 'registration',
        component: Registration,
        meta: { auth: false }
    },

    {
        path: 'resetPassword',
        component: resetPassword,
        meta: { auth: false }
    },

    {
        path: 'follow/:token',
        component: Follow,
        meta: { auth: false }
    },

    {
        path: 'useraddapp',
        component: UserAddApp,
        meta: { auth: false }
    },
   
    {
        path: 'groupstest',
        component: GroupsTest,
    },

    {
        path: '*',
        component: _404,
        meta: { auth: false }
    },

    {
        path: 'test2',
        component: Test2 //,
        //meta: { auth: true }
        //vedno viden test 2 (nima auth)
        //za test
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
        component: _404,
        meta: { auth: false }
    }
];

// Frontend routes.
export default routes;
