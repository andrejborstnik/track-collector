//
// LIBRARIES
//


// vue.js web framework library.
import Vue from 'vue';

// Vue single page application routing.
import VueRouter from 'vue-router';

// Import routes.
import routes from 'src/routes';

// Import main application.
import main_app from 'src/App.vue';

//
// ROUTING
//


// Vue router.
Vue.use(VueRouter);

// Create a router instance.
let router = new VueRouter({
    mode: 'history',
    routes
});

// Create Vue application and start the router.
Vue.component('main_app', main_app);

// Start router.
new Vue({
  el: 'app',
  router: router,
  render: h => h('main_app')
});