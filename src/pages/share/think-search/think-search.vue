<template>
  <div ref="autoWrap">
    <el-autocomplete :props='props' v-model="showItem" :trigger-on-focus="false" :fetch-suggestions="querySearchAsync" placeholder="请输入关键词搜索" @select="handleSelect"></el-autocomplete>
    <!-- <div v-show="error" class="el-form-item__error">请匹配系统中含有的！</div> -->
  </div>
</template>
<script>
import { fdcHttp, fdcJsonp } from 'fdc-common/http'
export default {
  props: ['value', 'companyType', 'searchMethod', 'modelStr', 'domain'],
  data() {
    return {
      noselected: false,
      timeout: null,
      isRepetition: null,
      props: {
        value: this.modelStr,
        label: this.modelStr
      },
      id: this.value.id
    }
  },
  computed: {
    // error: {
    //   get() {
    //     return !this.value.id && this.value.name
    //   }
    // },
    showItem: {
      get() {
        return this.value.name
      },
      set() {
        let inputValue = this.$refs.autoWrap.getElementsByTagName('input')[0].value
        this.$emit('input', { name: inputValue, id: '' })
      }
    }
  },
  methods: {
    querySearchAsync(queryString, cb) {
      this.noselected = true
      var params = {
        totaldatas: 20,
        totalpages: 1,
        pages: 1,
        curpage: 1,
        pagesize: 20
      }
      params[this.modelStr] = queryString
      this.companyType && (params.companyType = this.companyType)
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        request(this.domain, this.searchMethod)
          .then(res => {
            if (res) {
              var restaurants = res.data
              var results = restaurants.filter(v => {
                return v[this.modelStr].includes(queryString)
              })
              cb(results)
            }
          })
      }, 1000 * Math.random())
      function request(domain, searchMethod) {
        if (domain === 'homeworkstation') {
          return fdcHttp.get(process.env.API_ROOT_HOMEWORK + '/' + domain, searchMethod, params)
        } else {
          return fdcJsonp(process.env.API_ROOT_HOMEWORKBASE + '/' + domain + '/' + searchMethod, searchMethod, params)
        }
      }
    },
    handleSelect(item) {
      this.noselected = false
      this.id = item.id
      if (this.companyType) {
        this.$emit('input', { name: item[this.modelStr], id: this.id })
      } else {
        this.$emit('input', { ...item, name: item[this.modelStr] })
      }
    }
  },
  created() {
  }
}
</script>