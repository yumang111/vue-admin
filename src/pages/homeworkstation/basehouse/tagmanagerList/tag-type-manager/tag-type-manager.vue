<style lang='scss'>
.tagManager {
  &__box {
    padding-left: 20px;
  }
  &__edit {
    margin-bottom: 20px;
  }
  &__table {
    border: 1px solid rgb(223, 230, 236);
  }
}

.sort_header {
  height: 45px;
  line-height: 45px;
  background: #eef1f6;
  color: #1f2d3d;
  font-size: 14px;
  border-bottom: 1px solid rgb(223, 230, 236);
  h3 {
    text-align: center;
    // padding-left: 24px;
    // font-weight: 700;
    cursor: default;
  }
}

.table__box {
  color: #1f2d3d;
  li {
    height: 45px;
    line-height: 45px;
    cursor: pointer;
    padding-left: 24px;
    padding-right: 24px;
    &:hover {
      color: #108ee9;
      background: #eef1f6;
    }
  }
}

.cursor {
  cursor: pointer;
}
</style>

<template>
  <div>
    <h1 class="header--title">标签分类管理</h1>
    <div class="tagManager__box">
      <el-row class="tagManager__edit">
        <el-button class="cursor" type="primary" @click="operateCategory" :disabled="JSON.stringify(currentTopCategory)=='{}'||(JSON.stringify(currentTopCategory)!='{}'&&JSON.stringify(currentSecondCategory)!='{}'&&JSON.stringify(currentThirdCategory)!='{}')">
          <i class="el-icon-plus"></i>
        </el-button>
        <el-button class="cursor" type="primary" icon="edit" @click="modifyTagCategory" :disabled="JSON.stringify(currentSecondCategory)=='{}'&&JSON.stringify(currentThirdCategory)=='{}'"></el-button>
      </el-row>
      <div class="tagManager__table">
        <el-row class="sort_header">
          <el-col :md="8">
            <h3>一级分类</h3>
          </el-col>
          <el-col :md="8">
            <h3>二级分类</h3>
          </el-col>
          <el-col :md="8">
            <h3>三级分类</h3>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <!-- <sp>一级分类</h3> -->
            <ul class="table__box">
              <li v-for="item in topCategoryData" @click="getSecondCategoryData(item)" :key="item.id">
                <span class="" :class="{'el-button--text':item.id==currentTopCategory.id}">{{item.labelName}}</span>
              </li>
            </ul>
          </el-col>
          <el-col :md="8">
            <ul class="table__box">
              <li v-for="item in secondCategoryData" @click="getThirdCategoryData(item)" :key="item.id">
                <span :class="{'el-button--text':item.id==currentSecondCategory.id}">{{item.labelName}}</span>
              </li>
            </ul>
          </el-col>
          <el-col :md="8">
            <ul class="table__box">
              <li v-for="item in thirdCategoryData" @click="activeedThirdCategory(item)" :key="item.id">
                <span :class="{'el-button--text':item.id==currentThirdCategory.id}">{{item.labelName}}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog v-if="categoryDialog" size="tiny" v-model="categoryDialog">
      <span slot="title">{{dialogTitle}}</span>
      <el-form ref="form" :rules='rules' label-width="80px" :model="form">
        <el-form-item :label="categoryName" prop="labelName">
          <el-input v-model="form.labelName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="categoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveChangedCategory('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import mixins from '@/mixins/mixins'
import { getTypeByRootId, getTypeSortData, modifyTagCategory, addTagCategory } from '@/api/label.api'
export default {
  data() {
    return {
      categoryDialog: false,
      dialogTitle: '',
      categoryName: '',
      secondLevel: '二级分类',
      thirdLevel: '三级分类',
      topCategoryData: [], // 一级分类
      secondCategoryData: [], // 二级分类
      thirdCategoryData: [], // 三级分类
      currentTopCategory: {}, // 当前选中的一级分类
      currentSecondCategory: {}, // 当前选中的二级分类
      currentThirdCategory: {}, // 当前选中的二级分类
      isAdd: false, // 判断是新增还是编辑 true 新增 false 编辑
      form: {
        labelName: ''
      },
      rules: {
        labelName: [
          { required: true, message: '请输入名称', trigger: 'change&blur' },
          { max: 10, message: '必须在10字以内', trigger: 'change&blur' }
        ]
      }
    }
  },
  mixins: [mixins],
  methods: {
    // 根据一级分类获取二级分类
    getSecondCategoryData(item) {
      this.currentTopCategory = item
      this.currentSecondCategory = {}
      this.currentThirdCategory = {}
      this.thirdCategoryData = []
      console.log(this.currentTopCategory)
      getTypeSortData({ parentId: item.id })
        .then((data) => {
          this.secondCategoryData = data.tagList
        })
    },
    getThirdCategoryData(item) {
      this.currentSecondCategory = item
      this.currentThirdCategory = {}
      getTypeSortData({ parentId: item.id })
        .then((data) => {
          this.thirdCategoryData = data.tagList
        })
    },
    activeedThirdCategory(item) {
      this.currentThirdCategory = item
    },
    // 新增分类弹窗
    operateCategory() {
      this.categoryDialog = true
      this.isAdd = true
      this.form.labelName = ''
      if (JSON.stringify(this.currentSecondCategory) === '{}') {
        this.categoryName = this.secondLevel
        this.dialogTitle = '新增' + '-' + this.currentTopCategory.labelName
      } else {
        this.categoryName = this.thirdLevel
        this.dialogTitle = '新增' + '-' + this.currentTopCategory.labelName + '-' + this.currentSecondCategory.labelName
      }
    },
    // 编辑分类 -- 弹窗
    modifyTagCategory() {
      this.categoryDialog = true
      this.isAdd = false
      this.form.labelName = ''
      if (JSON.stringify(this.currentSecondCategory) === '{}') {
        // this.categoryName = this.secondLevel
      } else {
        this.categoryName = this.secondLevel
        this.form.labelName = this.currentSecondCategory.labelName
      }
      this.dialogTitle = '编辑' + '-' + this.currentTopCategory.labelName
      console.log(JSON.stringify(this.currentThirdCategory), 'JSON.stringify(this.currentThirdCategory)')
      if (JSON.stringify(this.currentThirdCategory) !== '{}') {
        this.form.labelName = this.currentThirdCategory.labelName
        this.categoryName = this.thirdLevel
        this.dialogTitle = '编辑' + '-' + this.currentTopCategory.labelName + '-' + this.currentSecondCategory.labelName
      }
    },
    // 弹窗保存按钮触发事件
    saveChangedCategory(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.saveAddInfo()
          } else {
            this.saveEditInfo()
          }
        } else {
          this.showInfoMsg('error', '验证未通过！')
          return false
        }
      })
    },
    // 保存新增信息
    saveAddInfo() {
      let params = {
        labelName: this.form.labelName
      }
      if (this.categoryName === this.secondLevel) {
        params.parentId = this.currentTopCategory.id
      }
      if (this.categoryName === this.thirdLevel) {
        params.parentId = this.currentSecondCategory.id
      }
      addTagCategory(params)
        .then((res) => {
          if (res && res.data === 1) {
            this.categoryDialog = false
            if (this.currentSecondCategory.id) {
              this.getThirdCategoryData(this.currentSecondCategory)
              this.showInfoMsg('success', '新增三级分类成功！')
            } else {
              this.getSecondCategoryData(this.currentTopCategory)
              this.showInfoMsg('success', '新增二级分类成功！')
            }
          }
        })
        .catch(res => {
          this.showInfoMsg('error', res)
        })
    },
    // 保存编辑信息
    saveEditInfo() {
      let params = {}
      if (!this.form.labelName) {
        this.showInfoMsg('warning', '输入不能为空')
        return
      }
      if (this.form.labelName.length > 10) {
        this.showInfoMsg('warning', '必须在10字以内')
        return
      }
      if (this.categoryName === this.secondLevel) {
        params = JSON.parse(JSON.stringify(this.currentSecondCategory))
      }
      if (this.categoryName === this.thirdLevel) {
        params = JSON.parse(JSON.stringify(this.currentThirdCategory))
      }
      params.labelName = this.form.labelName
      modifyTagCategory(params)
        .then((res) => {
          if (res && res.data === 1) {
            this.categoryDialog = false
            if (this.categoryName === this.secondLevel) {
              this.getSecondCategoryData(this.currentTopCategory)
            } else {
              this.getThirdCategoryData(this.currentSecondCategory)
            }
            this.showInfoMsg('success', '编辑成功')
            console.log(this.currentSecondCategory, 'hahhaha')
          }
        })
        .catch(res => {
          this.showInfoMsg('error', res)
        })
    }
  },
  created() {
    getTypeByRootId().then(res => {
      this.topCategoryData = res.tagList
    })
    // // 获取一级分类
    // getTypeSortData({})
    //   .then((data) => {
    //     this.topCategoryData = data.tagList
    //   })
    // modifyTagCategory()
  }
}
</script>