import './utils/stringutils'
import {Timer} from './utils/timer'
import Bus from './utils/bus'
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './alang';
import store from './astore'
Vue.config.productionTip = false;
Vue.prototype.$bus=Bus;
Vue.prototype.$timer = function (callback, time, limit, delay) {
  return new Timer(callback, time, limit, delay);
};
Vue.prototype.$failed=function(msg){
  Bus.$emit('failed',msg);
};
Vue.prototype.$success=function(msg){
  Bus.$emit('success',msg);
};
new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount('#app');
