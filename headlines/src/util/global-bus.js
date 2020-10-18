// 全局通信
import Vue from 'vue'

export default new Vue()

//假如a给b组件发送数据，b组件注册事件
// import globalBus from '@/util/global-bus'
//  globalBus.$on('自定义事件名称',(参数)=>{
//      //处理函数
//  })
//a组件发布通信事件
// import globalBus from '@/util/global-bus'
// globalBus.$emit('自定义事件名称', 要传递的参数)
//通信两端事件的名称要一致