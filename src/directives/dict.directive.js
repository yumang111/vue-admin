import Vue from 'vue'
import { fdcDict } from 'fdc-common/http'
Vue.mixin({
  data: () => ({
    dictData: {}
  })
})
export default {
  bind: (el, binding, vnode) => {
    const vm = vnode.context
    let dataKey = binding.value.data // data -- string
    fdcDict(process.env.API_ROOT_DICT, binding.value.name).then(data => {
      vm.$set(vm.dictData, dataKey, data)
    })
  }
}
