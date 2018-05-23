<template>
  <div>
    <el-dialog title="编辑图片信息" v-model="isShowEditDialog" size="tiny" v-if="isShowEditDialog">
      <el-form :rules='rules' ref="form" :model="form" label-width="60px">
        <template v-if="imgType!=='11'&&imgType!=='10'&&imgType!=='tiny'">
          <el-form-item label="名称" prop='imgName'>
            <el-input v-model="form.imgName" placeholder="请输入0-15汉字长度"></el-input>
          </el-form-item>
          <template v-if="imgType==='2'">
            <el-form-item label="户型">
              <el-select clearable v-model="form.houseTypeId" placeholder="请选择户型">
                <el-option v-for="item in houseTypeList" :key="item.id" :label="item.housingTypeName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-if="imgType==='7'">
            <el-form-item label="楼栋">
              <el-cascader @change='getBuilding' v-model="casArr" @active-item-change="handleSubChange" placeholder="请选择楼栋" :options="options"></el-cascader>
            </el-form-item>
          </template>
          <el-form-item label="描述" prop='imgDesc'>
            <el-input type="textarea" v-model="form.imgDesc" placeholder="请输入0-100汉字长度"></el-input>
          </el-form-item>
        </template>
        <template v-else-if="imgType==='tiny'">
          <el-form-item required label="名称" prop='imgName'>
            <el-input v-model="form.imgName" placeholder="请输入0-15汉字长度"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop='iconType'>
            <el-select clearable v-model="form.iconType" placeholder="请选择icon类型">
              <el-option v-for="(item,i) in iconType" :key="i" :label="item.name" :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item required label="链接" prop='urlLink'>
            <el-input v-model="form.urlLink" placeholder="请输入链接"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateImg('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  updatePic
} from '../album.api'
import mixins from '@/mixins/mixins'

import {
  getHousingTypePlot,
  getResidentialsubPlot,
  getBuildingSub
} from '@/api/plot.api'
export default {
  data() {
    return {
      isShowEditDialog: false,
      rules: {
        imgName: [{
          required: this.imgType === 'tiny',
          message: '名称不能为空',
          trigger: 'change&blur'
        },
        {
          max: 15,
          message: '名称在15字以内',
          trigger: 'change&blur'
        }
        ],
        imgDesc: [{
          max: 100,
          message: '描述在100字以内',
          trigger: 'change&blur'
        }],
        urlLink: [{
          required: true,
          message: '链接不能为空',
          trigger: 'change&blur'
        }]
      },
      iconType: [
        {type: '1', name: '地铁'},
        {type: '2', name: '商铺'},
        {type: '3', name: '学校'},
        {type: '99', name: '其他'}
      ],
      plotid: '',
      options: [],
      casArr: []
    }
  },
  props: ['formData', 'imgType'],
  mixins: [mixins],
  computed: {
    form: {
      get() {
        if (this.formData && this.formData.residentialSubId) {
          this.init()
        }
        console.log(this.formData)
        return this.formData
      },
      set() { }
    }
  },
  methods: {
    getBuilding(val) {
      this.form.residentialSubId = val[0]
      this.form.buildingId = val[1]
    },
    // 选中分期
    handleSubChange(val) {
      this.getSecondTypeList(val[0])
    },
    // sub-building
    getSecondTypeList(val) {
      getBuildingSub({
        residentialSubId: val
      })
        .then(res => {
          let arr = []
          res.data.forEach(v => {
            arr.push({
              label: v.bulidingNum,
              value: v.id
            })
          })
          this.options
            .find(v => v.value === val)
            .children = arr
        })
    },
    updateImg(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updatePic(this.form).then(res => {
            if (res.data === 1) {
              this.showInfoMsg('success', '更新图片信息成功！')
              this.isShowEditDialog = false
              this.$emit('reset', this.imgType)
            } else if (res.repeatName === 1) {
              this.showInfoMsg('error', '名称重复')
            }
          })
        } else {
          return false
        }
      })
    },
    getHouseType() {
      getHousingTypePlot({
        residentialInfoId: this.plotid
      }).then(res => {
        this.houseTypeList = res.data
      })
    },
    init() {
      this.getHouseType()
      // 分期 - 楼栋
      getResidentialsubPlot({
        residentialInfoId: this.plotid,
        getType: 'vo'
      }).then(res => {
        if (res.data) {
          this.options = []
          res.data.simpleInfoVOList.forEach(v => {
            this.options.push({
              label: v.residentialSubName,
              value: v.id,
              children: []
            })
          })
        }
      }).then(() => {
        if (this.form.residentialSubId) {
          return this.getSecondTypeList(this.form.residentialSubId)
        }
      }).then(() => {
        this.casArr = []
        this.casArr.push(this.formData.residentialSubId)
        this.casArr.push(this.formData.buildingId)
      })
    }
  },
  created() {
    this.plotid = sessionStorage.getItem('plotid')
    this.init()
  }
}

</script>
