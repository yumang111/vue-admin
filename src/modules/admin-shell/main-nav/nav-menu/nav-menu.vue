<style lang="scss" scoped>

</style>

<template>
  <el-menu :default-active="$route.path" @select="handleSelect" :unique-opened='true' class="el-menu-vertical-demo">
    <template v-for="(oneLevelItem,i) in routeData">
      <template v-if="!oneLevelItem.children">
        <el-menu-item :index="'/'+platformName+'/'+oneLevelItem.link" :key="i">
          <!-- <i class="el-icon-menu"></i> -->
          <span slot="title">{{oneLevelItem.title}}</span>
        </el-menu-item>
      </template>
      <template v-if="oneLevelItem.children">
        <el-submenu :index="'/'+platformName+'/'+oneLevelItem.link" :key="i">
          <template slot="title">
            <span>{{oneLevelItem.title}}</span>
          </template>
          <el-menu-item v-for="(twoLevelItem,n) in oneLevelItem.children" :key="n" :index="'/'+platformName+'/'+oneLevelItem.link+'/'+twoLevelItem.link">{{twoLevelItem.title}}</el-menu-item>
        </el-submenu>
      </template>
    </template>
  </el-menu>
</template>

<script>
import homeworkstationList from '@/mock/meauNavsList.json'
import commentList from '@/mock/newMeau.json'
import {
  getuserInfo
} from '@/api/api'
import tool from '@/tools/tool'
import Hub from '../hub'
export default {
  data: () => ({
    platformName: '',
    routeData: []
  }),
  methods: {
    handleSelect(index) {
      this.$router.push(index)
    },
    compileRouteData(data) {
      console.time()
      // 转换方法
      var arr = []
      data.forEach(function (v) {
        var linkArr = v.name.split('/')
        if (linkArr.length === 1) {
          arr.push({
            title: v.groupDisplay,
            link: linkArr[0]
          })
        } else {
          // array.find -- 返回匹配的第一项值，没有则返回undefined
          var isExist = arr.find(val => val.title === v.groupDisplay)
          if (isExist) {
            isExist.children.push({
              title: v.display,
              link: linkArr[1]
            })
          } else {
            arr.push({
              title: v.groupDisplay,
              link: linkArr[0],
              children: [{
                title: v.display,
                link: linkArr[1]
              }]
            })
          }
        }
      })
      data = arr
      console.timeEnd()
      return data
    },
    changeLimits(val) {
      // this.routeData = this.compileRouteData(commentMenu.data.panels)
      let param = {
        appcode: val,
        type: 'menu',
        v: 1000,
        timestamp: tool.getDate(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss')
      }
      getuserInfo('auth.login.projectlist', param).then(res => {
        if (res.data) {
          this.routeData = this.compileRouteData(res.data.panels)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  created() {
    // this.routeData = this.compileRouteData(projectList.data.panels)
    this.platformName = window.location.href.split('#/')[1].split('/')[0] || 'homeworkstation'
    if (process.env.NODE_ENV === 'development') {
      switch (this.platformName) {
        case 'homeworkstation':
          this.routeData = this.compileRouteData(homeworkstationList.data.panels)
          break
        case 'comment':
          this.routeData = this.compileRouteData(commentList.data.panels)
          break
      }
    } else {
      this.changeLimits(this.platformName)
      Hub.$on('changeLimits', this.changeLimits)
    }
  }
}

</script>
