import Vue from 'vue';
import VueConfirmDialog from 'vue-confirm-dialog';
import VueScheduler from 'v-calendar-scheduler';

import 'v-calendar-scheduler/lib/main.css';

import App from './App.vue';
import router from './router';

Vue.use(VueConfirmDialog);
Vue.use(VueScheduler);
Vue.component('vue-confirm-dialog', VueConfirmDialog.default);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
