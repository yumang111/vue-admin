<template>
  <div class="checkTag">
    <p>
      <el-tag type="gray" v-for="(tag,m) in chooseTags" :key="m" :closable="true" @close="handleClose(tag,m)">{{tag.labelName}}</el-tag>
    </p>
    <div ref="exhibition" :class="[{heightLimit:limit},'exhibition']">
      <div v-for="(item,index) in allTag" :key="index">
        <div v-for="(val,i) in item.tagThreeList" :key="i">
          <el-row class="tag-title">
            <span>{{item.labelName}}>{{val.labelName}}</span>
            <el-button v-if="showBtn&&i==0&&index==0" type="text" class="showAll" @click="tagShow">{{limitWord}}<i :class="limitWord=='展开'?'el-icon-arrow-down':'el-icon-arrow-up'" class="el-icon--right"></i></el-button>
          </el-row>
          <el-row>
            <span :class="{'el-tag--primary':v.isChoose}" class="el-tag el-tag--gray" @click="choose(v)" :key="v.labelName" :closable="true" v-for="(v,n) in val.tagsList">{{v.labelName}}</span>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
.checkTag {
  .el-tag {
    margin-right: 10px;
    cursor: pointer;
    &:hover {
      background-color: rgba(16, 142, 233, 0.1);
      border-color: rgba(16, 142, 233, 0.2);
      color: #108ee9;
    }
  }
  .tag-title {
    color: #878d99;
  }
  .heightLimit {
    max-height: 30px * 4;
    overflow: hidden;
  }
  .exhibition {
    position: relative;
  }
  .showAll {
    display: inline-block;
    margin-left: 20px;
    .el-icon-arrow-down {
      font-size: 12px;
    }
  }
}
</style>
<script>
import { getTagList } from './tag.api'
import { getTagInfo } from '@/api/plot.api'
export default {
  props: ['rootId', 'value', 'type'],
  data() {
    return {
      msg: '我是Tag',
      allTag: [],
      chooseTags: [],
      limit: false, // 是否限制显示区域高度
      limitWord: '展开',
      showBtn: false
    }
  },
  watch: {
    value(n) {
      if (n) {
        getTagInfo({ id: n }).then(result => {
          this.chooseTags = result.data
        })
      } else {
        this.chooseTags = []
      }
      if (!this.allTag.length) {
        this.getTagLists().then(res => { this.addFlag(n) })
      } else {
        this.addFlag(n)
      }
    }
  },
  methods: {
    tagShow() {
      if (this.limitWord === '展开') {
        this.limit = false
        this.limitWord = '收起'
      } else {
        this.limit = true
        this.limitWord = '展开'
      }
    },
    choose(v) {
      // 判断是否选择过
      let chooseIndex = this.chooseTags.findIndex(val => val.id === v.id)
      if (chooseIndex === -1) {
        v.isChoose = true // 高亮显示
        this.chooseTags.push(v) // 添加进数组
      } else {
        v.isChoose = false
        this.chooseTags.splice(chooseIndex, 1)
      }
      this.$emit('input', this.dealData(this.chooseTags))
    },
    handleClose(tag, index) {
      this.chooseTags.splice(index, 1)
      this.$emit('input', this.dealData(this.chooseTags))
    },
    dealData(arr) {
      let dataArr = []
      arr.forEach(function (v) {
        dataArr.push(v.id)
      })
      return dataArr.join(',')
    },
    // 获取该类型下的所有标签
    getTagLists() {
      return getTagList({ rootId: this.rootId }).then(res => {
        res.list.forEach(v => {
          if (v.tagThreeList && v.tagThreeList.length !== 0) {
            v.tagThreeList.forEach(val => {
              if (val.tagsList && val.tagsList.length !== 0) {
                val.tagsList.forEach(item => {
                  item.isChoose = ''
                })
              }
            })
          }
        })
        this.allTag = res.list
        // 在数据赋值之后写
        this.$nextTick(() => {
          if (this.$refs.exhibition && this.$refs.exhibition.offsetHeight > 36 * 4) {
            this.limit = true
            this.showBtn = true
          }
        })
        if (this.type === 5) {
          this.allTag = []
          this.allTag.push(res.list[1])
        }
      })
    },
    // 给选中标签设置高亮
    addFlag(value) {
      this.allTag.forEach(v => {
        if (v.tagThreeList && v.tagThreeList.length !== 0) {
          v.tagThreeList.forEach(val => {
            if (val.tagsList && val.tagsList.length !== 0) {
              val.tagsList.forEach(item => {
                if (value && value.indexOf(item.id) !== -1) {
                  item.isChoose = true
                } else {
                  item.isChoose = false
                }
              })
            }
          })
        }
      })
    }
  },
  created() {
    this.getTagLists()
  }
}
</script>
