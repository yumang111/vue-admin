<style lang="scss" scoped>
.page-wraper{
  margin:20px 0;
}
</style>

<template>
<div class="page-container">
  <h1 data-v-799d04ab="" class="header--title">
    敏感词列表
    <div  class="f-r"><a  class="el-button el-button--danger"  @click="dialogVisible = true;editOrAdd=1">增加敏感词</a></div></h1>
  <el-row>
    <el-table
      :data="sensitiveListData"
      border
      style="width: 100%">
      <el-table-column
        label="敏感词">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime|timeFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[10, 20, 50, 100]"
    class="page-wraper"
    :page-size="rowsPerPage"
    layout="total, sizes, prev, pager, next, jumper"
    :total="400">
  </el-pagination>
  <el-dialog
  :title="dialogInfo.title"
  @close="resetForm('ruleForm')"
  :visible.sync="dialogVisible"
  size="tiny"
  >
  <el-form label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left">
    <el-form-item label="敏感词" prop="sensitiveWords">
      <el-input
        v-model.trim="ruleForm.sensitiveWords"
        placeholder="请输入1-20个字的敏感词">
      </el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button  @click="resetForm('ruleForm')">取 消</el-button>
    <el-button type="primary"  @click="submitForm('ruleForm')">确 定</el-button>
  </span>
</el-dialog>
</div>

</template>

<script>
import {
  getsensitivelist, addsensitiveword, updatesensitiveword,
  deletesensitiveword
} from '@/api/sensitive.api'
export default {
  data() {
    return {
      editOrAdd: null,
      editeSenId: null,
      dialogVisible: false,
      currentPage: 1,
      rowsPerPage: 10,
      ruleForm: {
        sensitiveWords: ''
      },
      rules: {
        sensitiveWords: [
          { required: true, message: '敏感词不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '请输入1-20个字', trigger: 'blur' }
        ]
      },
      dialogInfo: {
        title: '新增',
        method: ''
      },
      sensitiveListData: []
    }
  },
  watch: {
    editOrAdd(val) {
      if (val === 2) {
        this.dialogInfo.title = '编辑'
        this.dialogInfo.method = 'homeworkstationapi.restful.inter.sensitiveword.update'
        this.dialogInfo.message = '修改敏感词成功'
      } else {
        this.dialogInfo.title = '新增'
        this.dialogInfo.method = 'homeworkstationapi.restful.inter.sensitiveword.add'
        this.dialogInfo.message = '增加敏感词成功'
      }
    }
  },
  methods: {
    handleEdit(index, row) {
      this.editOrAdd = 2
      this.dialogVisible = true
      this.editeSenId = row.id
      console.log(index, row)
      this.ruleForm.sensitiveWords = row.content
    },
    handleDelete(index, row) {
      this.$confirm('是否删除该敏感词?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletesensitiveword({id: row.id, w: this.ruleForm.sensitiveWords})
          .then(res => {
            if (res.data === 1) {
              this.getSensitiveData()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message.error('删除失败!')
            }
          })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.dialogInfo)
          this.dialogVisible = false
          if (this.editOrAdd === 1) {
            addsensitiveword({w: this.ruleForm.sensitiveWords})
              .then(res => {
                if (res.data === 1) {
                  this.getSensitiveData()
                  this.$message({
                    message: this.dialogInfo.message,
                    type: 'success'
                  })
                } else {
                  this.$message.error('增加敏感词失败')
                }
              })
          } else {
            updatesensitiveword({w: this.ruleForm.sensitiveWords, id: this.editeSenId})
              .then(res => {
                if (res.data === 1) {
                  this.getSensitiveData()
                  this.$message({
                    message: this.dialogInfo.message,
                    type: 'success'
                  })
                } else {
                  this.$message.error('修改敏感词失败')
                }
              })
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    getSensitiveData() {
      let param = {
        currentPage: this.currentPage,
        rowsPerPage: this.rowsPerPage
      }
      getsensitivelist(param)
        .then(res => {
          console.log(res)
          if (res.data.length > 0) {
            this.sensitiveListData = res.data
          }
        })
    },
    handleSizeChange(val) {
      this.rowsPerPage = val
      this.getSensitiveData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSensitiveData()
    }
  },
  created() {
    this.getSensitiveData()
  }
}
</script>
