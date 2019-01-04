import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardPlugin from './dashboard-plugin'

/**
 * Use lodash
 */
window._ = require('lodash');

/** AXIOS */
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.baseURL = '/api';

/**
 * VUE MOMENT, TWIX
 * http://isaaccambron.com/twix.js/docs.html#basic-formatting
 */
import Moment from 'vue-moment/vue-moment';
Vue.use(Moment);
require('twix');

/** EVENT BUS */
window.Event = new Vue; // See Auth class reference

/**
 * AUTH MODULE
 * http://voerro.com/blog/building-spas-with-laravel-5.5-and-vue.js-2-pt.3
 */
import Auth from './auth.js';
window.auth = new Auth();

/** Create filters */
Vue.filter('uppercase', function (v) {
  return v.toUpperCase();
})
Vue.filter('capitalize', function (v) {
  return v.charAt(0).toUpperCase() + v.substr(1);
})

/** Create Directives */
Vue.directive('focus', {
  inserted: function (el) {
    Vue.nextTick(() => el.focus());
  }
})

/** Vuejs-Confirm */
import VuejsDialog from "vuejs-dialog"
// import VuejsDialogMixin from "vuejs-dialog/vuejs-dialog-mixin.min.js"
import 'vuejs-dialog/dist/vuejs-dialog.min.css'
Vue.use(VuejsDialog)

// Plugins
import App from './App.vue'

// router setup
import routes from './routes/routes'

// plugin setup
Vue.use(VueRouter)
Vue.use(DashboardPlugin)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
});

/** ROUTE AUTHENTICATION */
router.beforeEach((to, from, next) => {
  // Handle authentication
  if (to.matched.some(record => record.meta.auth)) {
    if (!auth.check()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }
  }
  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
});

/**
 * Handle Axios errors with Event bus
 *
 * https://www.qcode.in/api-error-handling-in-vue-with-axios/
 */
window.axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Check if caller wants to catch own errors
  if( error.config.hasOwnProperty('handleError') && error.config.handleError === false ) {
    return Promise.reject(error);
  }

  // Trigger Event bus since caller passed doesn't want error
  if (error.response) {
    Event.$emit('error', {message: error.response.data.message});
  }

  return Promise.reject(error);
})

/* We import element-ui variables at the end so they can override the default element-ui colors */
import './assets/sass/element_variables.scss'
