//
// LIBRARIES
//

import Test from 'Test.vue';
import Test2 from 'Test2.vue';
import _404 from '404.vue';
import PostGreDemo from 'PostGreDemo.vue';

import ExampleMap from 'pages/ExampleMap.vue';

import BrowseComponents from 'pages/BrowseComponents.vue';

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
        redirect: ''
    },
    {
        path: 'index.htm',
        redirect: ''
    },
    {
        path: 'index',
        redirect: ''
    },

    //
    // Pages
    //

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
    }

];

routes = [
    {
        path: config.path_prefix,
        children: routes,
        component: BrowseComponents
    },
    {
        path: '*',
        component: _404
    }
];

// Frontend routes.
export default routes;