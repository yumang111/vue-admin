<template>
  <div>
    <el-row>
      <el-radio-group class="tab__box" size='large' v-model="currentInstallmentId" @change='selectInstallment'>
        <el-radio-button :label="item.id" class="tab__item" :class="{active:item.id === currentInstallmentId}" :id='item.id' v-for="(item,index) in installmentList"
          :key="index">{{item.residentialSubName+'('+item.serialNumber+')'}}</el-radio-button>
      </el-radio-group>
    </el-row>
    <div v-if="currentInstallmentId">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="content">
          <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="f-r" @click="publicDynamic" type="primary">发布动态</el-button>
        </el-form-item>
      </el-form>
      <div class="header--titleH2">动态列表</div>
      <div v-for="(item,index) in dynamicList" :key="index" class="dynamic__list cf">
        <div :class="['dynamic__item',{'first':!index}]">{{item.content}}</div>
        <span class="dynamic__time">{{item.createTime|timeFormat}}</span>
        <el-button @click="deleteDynamic(item.id)" class="dynamic__btn f-r" type="primary">
          <i class="iconfont icon-shanchu"></i>
        </el-button>
        <el-button @click="editDynamic(item)" class="dynamic__btn f-r" type="primary">
          <i class="iconfont icon-bianji"></i>
        </el-button>
      </div>
      <div v-if="totalDatas>pagesize" class="dynamic__more">
        <el-button @click="loadMore" type="primary" size="large">加载更多</el-button>
      </div>
    </div>
    <div v-else>
      <span class="tip">暂无动态</span>
      <el-button type="danger" @click="addInstallment">新增分期</el-button>
    </div>

    <el-dialog title="编辑动态" :visible.sync="dynamicDialog">
      <el-form ref="editForm" :model="editForm">
        <el-form-item prop="content" :rules="[
          { required: true, message: '动态内容不得为空', trigger: 'change&blur' },
          { max: 400, message: '动态内容必须在400字以内', trigger: 'change&blur' }
        ]">
          <el-input v-model="editForm.content" type="textarea" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dynamicDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateDynamic">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    addDynamicInfo,
    deleteDynamicInfo,
    getDynamicInfo,
    editDynamicInfo
  } from './dynamic.api'
  import {
    getResidentialsubPlot
  } from '@/api/plot.api'
  import mixins from '@/mixins/mixins'
  export default {
    data() {
      return {
        throttle: true,
        plotid: '',
        currentInstallmentId: '',
        pagesize: 20,
        installmentList: [],
        dynamicList: [],
        form: {
          content: ''
        },
        rules: {
          content: [{
            max: 400,
            message: '动态内容必须在400字以内',
            trigger: 'change&blur'
          }]
        },
        editForm: {

        },
        dynamicDialog: false,
        totalDatas: 0
      }
    },
    mixins: [mixins],
    methods: {
      addInstallment() {
        this.$router.push({ path: '/homeworkstation/plot/plotPortal/installment', query: { way: 'add' } })
        // this.$router.push('/homeworkstation/plot/plotPortal/installment')
      },
      updateDynamic() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            editDynamicInfo({
              id: this.editForm.id,
              content: this.editForm.content
            }).then(res => {
              if (res.data === 1) {
                this.dynamicDialog = false
                this.showInfoMsg('success', '修改动态信息成功')
                this.getDynamicList()
              }
            })
          } else {}
        })
      },
      editDynamic(form) {
        this.dynamicDialog = true
        this.editForm = JSON.parse(JSON.stringify(form))
      },
      loadMore() {
        this.pagesize += 20
        this.getDynamicList()
      },
      // 删除
      deleteDynamic(id) {
        this.$confirm('是否删除该动态？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return deleteDynamicInfo({
            id: id
          })
        }).then(res => {
          if (res.data === 1) {
            this.showInfoMsg('success', '删除成功')
            this.getDynamicList()
          }
        }).catch(err => {
          if (err === 'cancel') {} else {
            this.showInfoMsg('error', err)
          }
        })
      },
      // 发布
      publicDynamic() {
        if (!this.form.content.trim()) {
          return false
        }
        if (this.throttle) {
          this.throttle = false
          this.$refs.form.validate(valid => {
            if (valid) {
              addDynamicInfo({
                residentialInfoId: this.plotid,
                residentialSubId: this.currentInstallmentId,
                content: this.form.content.trim()
              }).then(res => {
                this.throttle = true
                if (res.data === 1) {
                  this.showInfoMsg('success', '发布成功')
                  this.$refs.form && this.$refs.form.resetFields()
                  this.getDynamicList()
                }
              }).catch(err => {
                this.throttle = true
                this.showInfoMsg('error', err)
              })
            } else {
              this.throttle = true
            }
          })
        }
      },
      // 获取
      getDynamicList() {
        getDynamicInfo({
          residentialInfoId: this.plotid,
          residentialSubId: this.currentInstallmentId,
          pagesize: this.pagesize,
          pages: 1
        }).then(res => {
          this.totalDatas = res.totalDatas
          this.dynamicList = res.data
        })
      },
      selectInstallment(val) {
        this.currentInstallmentId = val
        // 获取动态列表
        this.getDynamicList()
        // 获取楼栋信息
        this.$router.push({
          path: '/homeworkstation/plot/plotPortal/dynamic',
          query: {
            installmentId: val
          }
        })
      },
      init(id) {
        getResidentialsubPlot({
          residentialInfoId: this.plotid,
          getType: 'vo'
        }).then(res => {
          if (res.data) {
            this.installmentList = res.data.simpleInfoVOList
            let len = this.installmentList.length
            if (this.installmentList && len !== 0) {
              this.isInstallment = len - 1
              this.currentInstallmentId = id || this.installmentList[len - 1].id
            }
          }
        })
      }
    },
    created() {
      let queryId = window.location.href.split('=')[1]
      this.plotid = sessionStorage.getItem('plotid')
      this.init(queryId)
    }
  }

</script>
<style src='./dynamic.scss' lang="scss" scoped></style>
