import searchbox from '@/pages/share/searchbox/searchbox.vue'
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎租房',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      // 物业类型
      PropertyType: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      Propertyvalue: '',
      // 销售状态
      saleStateType: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      saleStatevalue: '',
      housekeyword: ''
    }
  },
  components: {
    searchbox
  },
  props: ['listtype'],
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
