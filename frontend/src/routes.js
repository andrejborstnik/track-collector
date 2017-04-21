//
// LIBRARIES
//

import Test from 'Test.vue';
import Test2 from 'Test2.vue';
import _404 from '404.vue';
import PostGreDemo from 'PostGreDemo.vue';

import ExampleMap from 'pages/ExampleMap.vue';
import TrackDemo from 'pages/TrackDemo.vue';

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
        component: BrowseComponents
    },

    {
        path: 'browse',
        component: BrowseComponents
    },

    {
        path: 'track',
        component: TrackDemo
    },

    {
        path: 'map',
        component: ExampleMap
    },

    {
        path: 'test',
        component: Test
    },

    {
        path: 'test2',
        component: Test2
    },

    {
        path: 'db',
        component: PostGreDemo
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