// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
Vue.config.productionTip = false
    //引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
//引入axios
import axios from 'axios'
Vue.prototype.axios = axios
    /* eslint-disable no-new */

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})