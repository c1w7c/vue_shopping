// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios';
import 'bootstrap';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import { ValidationObserver, ValidationProvider, extend, localize} from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import TW from 'vee-validate/dist/locale/zh_TW.json';

// import VueI18n from 'vue-i18n';

import router from '@/router/index';
import App from './App';
//運型全局的代碼
import './bus';
import currency from '@/components/page/currency';

//vee validation
Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

//自訂extend
extend('nameRule',{
  validate: function(value){
    var regName =/^[\u4E00-\u9FFF]{2,4}$/;
      return regName.test(value);
  },
  message:'真實姓名填寫有誤'
});
extend('phoneRule',{
  validate:function(value){
    var regName =/^(09)[0-9]{8}$/;
    return regName.test(value);
  },
  message:'手機格式輸入有誤',
})

localize('zh_TW', TW);

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);



Vue.component('loading',Loading);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false

Vue.filter('currency',currency);
axios.defaults.withCredentials = true;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App},
  template: '<App/>',
  router,
  // i18n,
})

router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if(to.meta.requiresAuth){
      axios.post(`${process.env.APIPATH}/api/user/check`).then((response) => {
          if(response.data.success){
              next();
          }
          else{
            next({path:'/login'});
          }
      })
  }
  else{
    next();
  }

})
