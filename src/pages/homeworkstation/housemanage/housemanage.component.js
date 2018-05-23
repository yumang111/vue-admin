import searchbox from '@/pages/share/searchbox/searchbox.vue'
export default {
  data() {
    return {
      saleStatevalue: '',
      housekeyword: ''
    }
  },
  components: {
    searchbox
  },
  methods: {
    getData() {
      console.log('请求房源')
    },
    getvalue(val, param) {
      val = val.split(param)
      console.log(val)
    },
    onSubmit() {
      console.log('点击搜索')
    }
  }
}
