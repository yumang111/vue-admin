<style lang="scss" scoped>
.noborderbtm {
  .td {
    border-bottom: 0 !important;
  }
}

.demo-form-inline {
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>

<template>
  <div>
    <h1 class="header--title">
      标签管理
      <div class="f-r">
        <router-link class="el-button el-button--danger" :to="$route.path+'/tagtypemanager'">分类管理</router-link>
      </div>
    </h1>
    <div class="page-container">
      <el-radio-group class="tab__box" size='large' v-model="tabelTabIndex" @change='changeTab'>
        <el-radio-button :label="tab.id" v-for="(tab,index) in tabTags" :key="tab.id" :class="{active:tabelTabIndex==tab.id}">{{tab.labelName}}</el-radio-button>
      </el-radio-group>
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-col :md="4">
            <el-form-item>
              <el-select clearable v-model="curSecondCategory" placeholder="二级分类" @change="getThirdCategory">
                <el-option v-for="item in secondCategory" :key="item.id" :label="item.labelName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="4">
            <el-form-item>
              <el-select clearable v-model="curThirdCategory" placeholder="三级分类">
                <el-option v-for="item in thirdCategory" :key="item.id" :label="item.labelName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="2" style="marginLeft:10px;">
            <el-form-item>
              <el-button type="primary" @click="viewTagList">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="4">
            <el-form-item>
              <el-select clearable v-model="secondCate" placeholder="二级分类" @change="getThirdCateList">
                <el-option v-for="item in secondCateList" :key="item.id" :label="item.labelName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="4">
            <el-form-item>
              <el-select clearable v-model="thirdCate" placeholder="三级分类">
                <el-option v-for="item in thirdCateList" :key="item.id" :label="item.labelName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="4">
            <el-form-item>
              <el-input v-model="labelName" placeholder="标签名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="4">
            <el-form-item>
              <el-input v-model="shortKey" placeholder="标签编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="2" style="marginLeft:10px;">
            <el-form-item>
              <el-button type="primary" @click="addTags">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="cf"></div>
      <template>
        <el-table @header-click='tagSort' :data="categoryTableList" :row-class-name="tableRowClassName" style="width: 100%">
          <el-table-column prop="secondName" label="二级分类">
          </el-table-column>
          <el-table-column prop="thirdName" label="三级分类">
          </el-table-column>
          <el-table-column prop="labelName" label="标签">
          </el-table-column>
          <el-table-column prop="shortKey" label="编码">
          </el-table-column>
          <el-table-column label-class-name='sortable__tagUse' prop="useCount" label="使用次数↓">
          </el-table-column>
          <el-table-column label-class-name='sortable__tagClick' prop="clickCount" label="被用户点击次数↓">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div @click="editTag(scope.row)" title='编辑' class="othercompany_table_iconBtn">
                <i class="iconfont icon-bianji icon-btn"></i>
              </div>
              <template v-if='scope.row.delState == "0"'>
                <div @click="forbidden(scope.$index, scope.row)" title='禁用' class="othercompany_table_iconBtn">
                  <i class="iconfont icon-jinzhi icon-btn"></i>
                </div>
              </template>
              <template v-else>
                <div @click="open(scope.$index, scope.row)" title='启用' class="othercompany_table_iconBtn">
                  <i class="icon-btn icon-btn iconfont icon-chongxinqiyong"></i>
                </div>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-dialog size="tiny" title="修改标签信息" :visible.sync="modifyTagDialog">
        <el-form :model="form" :rules="rules" ref='form' :label-width="formLabelWidth">
          <el-form-item prop="labelName" required label="标签名">
            <el-input v-model="form.labelName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyTagDialog = false">取 消</el-button>
          <el-button type="primary" @click="editTagInfo('albumForm')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/mixins'
import { getTypeByRootId, modifyTag, getTypeSortData, fetchCategoryList, addTagCategory, forbiddenTag } from '@/api/label.api'
export default {
  data: () => ({
    secondCate: '',
    thirdCate: '',
    secondCateList: [],
    thirdCateList: [],
    addNewKindsDialog: false,
    tabTags: [],
    tabelTab: '小区',
    tabelTabIndex: '',
    categoryTableList: [],
    labelName: '',
    shortKey: '',
    form: {
      id: '',
      labelName: ''
    },
    rules: {
      labelName: [
        { required: true, message: '标签名不能为空', trigger: 'blur' },
        { max: 10, message: '标签名必须在10字以内', trigger: 'change&blur' }
      ]
    },
    formLabelWidth: '80px',
    secondCategory: [], // 二级分类
    thirdCategory: [], // 三级分类
    curSecondCategory: '',
    curThirdCategory: '',
    useOrderType: '',
    modifyTagDialog: false
  }),
  mixins: [mixins],
  methods: {
    // 获取当前编辑标签信息
    editTag(row) {
      this.form.id = row.id
      this.form.labelName = row.labelName
      this.modifyTagDialog = true
      console.log(row, 'row')
    },
    // 更新标签信息
    editTagInfo() {
      modifyTag({
        id: this.form.id,
        labelName: this.form.labelName
      }).then(res => {
        if (res.data === 1) {
          this.modifyTagDialog = false
          this.showInfoMsg('success', '修改标签信息成功！')
          this.getTagList()
        }
      }).catch(res => {
        this.showInfoMsg('error', res)
      })
    },
    // 排序
    tagSort(row, event, column) {
      let sort = () => {
        this.getTagList().then(res => {
          if (res.tagList && this.useOrderType) {
            this.showInfoMsg('success', '排序成功！')
          }
        }).catch(res => {
          this.showInfoMsg('error', res)
        })
      }
      // 使用次数排序
      if (row.labelClassName === 'sortable__tagUse') {
        this.useOrderType = 'useCount_desc'
        sort()
      } else if (row.labelClassName === 'sortable__tagClick') { // 被用户点击次数排序
        this.useOrderType = 'clickCount_desc'
        sort()
      }
    },
    // 获取标签信息
    getTagList() {
      return fetchCategoryList({
        rootId: this.tabelTabIndex,
        secondId: this.curSecondCategory,
        thirdId: this.curThirdCategory,
        sqlOrderBy: this.useOrderType
      }).then(res => {
        this.categoryTableList = res.tagList
        return res
      })
    },
    // 获取标签分类
    getTabs(param) {
      return getTypeSortData(param)
        .then((data) => {
          return Promise.resolve(data)
        })
    },
    // tab 页点击 (获取一级下所有标签-二级分类)
    changeTab(tab) {
      this.tabelTabIndex = tab
      this.curSecondCategory = ''
      this.curThirdCategory = ''
      this.useOrderType = ''
      this.getTagList()
        .then(res => {
          return this.getTabs({ parentId: tab })
        })
        .then((data) => {
          this.secondCategory = data.tagList
          this.secondCateList = data.tagList
          return Promise.resolve()
        })
      this.$router.push({ path: this.$route.path, query: { parentId: tab } })
    },
    // 根据二级标签获取三级标签
    getThirdCategory(value) {
      this.thirdCategory = []
      this.curThirdCategory = ''
      if (!value) {
        return false
      }
      getTypeSortData({ parentId: value })
        .then((data) => {
          this.thirdCategory = data.tagList
        })
    },
    // 添加标签获取三级分类
    getThirdCateList(value) {
      this.thirdCateList = []
      this.thirdCate = ''
      if (!value) {
        return false
      }
      getTypeSortData({ parentId: value })
        .then((data) => {
          this.thirdCateList = data.tagList
        })
    },
    // 查看
    viewTagList() {
      this.useOrderType = ''
      this.getTagList()
    },
    addTags() {
      if (!this.secondCate) {
        this.showInfoMsg('info', '请选择分类')
        return
      }
      if (!this.thirdCate) {
        this.showInfoMsg('info', '请选择三级分类')
        return
      }
      if (!this.labelName) {
        this.showInfoMsg('info', '请输入标签名')
        return
      }
      if (!this.shortKey) {
        this.showInfoMsg('info', '请输入标签编码')
        return
      }
      if (this.labelName.length > 10) {
        this.showInfoMsg('warning', '标签名必须在10字以内')
        return
      }
      if (!/[0-9|a-z|A-Z]{1,16}/.test(this.shortKey)) {
        this.showInfoMsg('warning', '标签编码为1-16位字母或数字')
        return
      }
      addTagCategory({
        parentId: this.thirdCate,
        labelName: this.labelName,
        shortKey: this.shortKey
      }).then(res => {
        if (res && res.data) {
          this.showInfoMsg('success', '新增标签成功')
          this.labelName = ''
          this.useOrderType = ''
          this.viewTagList()
        }
      }).catch(res => {
        this.showInfoMsg('error', res)
      })
    },
    // 控制表格样式
    tableRowClassName() {
      // return 'noborderbtm'
    },
    // 启用
    open(index, rowData) {
      this.$confirm('是否启用该标签', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return forbiddenTag({
            id: rowData.id,
            delState: 0
          })
        })
        .then(() => {
          this.showInfoMsg('success', '启用成功')
          this.viewTagList()
        })
        .catch(() => {
          this.showInfoMsg('info', '已取消启用')
        })
    },
    // 禁用
    forbidden(index, rowData) {
      this.$confirm('是否禁用该标签', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return forbiddenTag({
            id: rowData.id,
            delState: 1
          })
        })
        .then(() => {
          this.showInfoMsg('success', '禁用成功')
          this.viewTagList()
        })
        .catch(() => {
          this.showInfoMsg('info', '已取消禁用')
        })
    },
    // 删除标签
    deleteTag(index, rowData) {
      this.$confirm('是否删除角色', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('删除后要做的事')
          this.showInfoMsg('success', '删除成功')
        })
        .catch(() => {
          this.showInfoMsg('info', '已取消删除')
        })
    }
  },
  created() {
    let queryId = window.location.href.split('=')[1]
    getTypeByRootId().then(res => {
      this.tabTags = res.tagList
      this.tabelTabIndex = queryId || this.tabTags[0].id
    })
  }
}
</script>