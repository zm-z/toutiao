import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        msgs: {}
    },
    mutations: {
        getmessage(state, msg) {
            state.msgs = msg
        }
    },
    actions: {},
    modules: {}
})