
<template>
  <el-dialog title="图片上传" v-model="dialogVisible" size="large" v-if="dialogVisible">
    <el-row>
      <ul class="album__ready-photo-list">
      <el-form v-loading.fullscreen.lock="loading" ref="form" :model="form" label-width="60px">
        <el-col :md="5" v-for="(pic,index) in form.imgList" :key="pic.imgSrc">
          <li>
            <i class="iconfont icon-delete album__delete-icon" @click="deleteImg(index)"></i>
            <img :src="pic.imgSrc" alt="">
              <template v-if='activeType!=="11"&&activeType!=="10"'>
                <template v-if="activeType!=='9'">
                  <el-form-item label="名称" :prop="'imgList.'+index+'.imgName'" :rules="[
                    {required: activeType === 'tiny', message: '名称不能为空', trigger: 'change&blur'},
                    {max: 15, message: '名称不得超过15字', trigger: 'change&blur'}]">
                    <el-input v-model="pic.imgName" placeholder="请输入0-15汉字长度"></el-input>
                  </el-form-item>
                </template>
                <template v-if="activeType==='2'">
                  <el-form-item label="户型">
                    <el-select clearable v-model="pic.houseTypeId" placeholder="请选择户型">
                      <el-option v-for="item in houseTypeList" :key="item.id" :label="item.housingTypeName" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
                <template v-if="activeType==='7'">
                  <el-form-item label="楼栋">
                    <el-cascader v-model="pic.casArr" @active-item-change="handleSubChange" placeholder="请选择楼栋" :options="options"></el-cascader>
                  </el-form-item>
                </template>
                <template v-if="activeType!=='tiny'">
                  <el-form-item label="描述" :prop="'imgList.'+index+'.imgDesc'" :rules="{max: 100, message: '描述不得超过100字', trigger: 'change&blur'}">
                    <el-input type="textarea" v-model="pic.imgDesc" placeholder="请输入0-100汉字长度"></el-input>
                  </el-form-item>
                </template>
              </template>
              <template v-else>
                <el-form-item required label="链接" :prop="'imgList.'+index+'.urlLink'" :rules="[
                    {required: true, message: '链接不能为空', trigger: 'change&blur'}]">
                  <el-input v-model="pic.urlLink" placeholder="请输入链接"></el-input>
                </el-form-item>
              </template>
          </li>
        </el-col>
      </el-form>
        <el-col :md="5">
          <li>
            <div class="album__uploadWrap" role="button">
              <el-upload :file-list="form.imgList" :show-file-list='false' action="homebaseaction/homebaseaction.base.homeimg.upload.v1" class="upload-demo" name='file' ref="upload" :auto-upload="false" :multiple="true" :on-change="setImagePreview">
                <input slot="trigger" id="doc" class="album__uploadInput" multiple="multiple" accept="image/png,image/gif,image/jpeg,image/x-ms-bmp,image/bmp">
              </el-upload>
              <div class="album__uploadIcon">
                <p>
                  <i class="el-icon-plus"></i>
                </p>
                <p>选择图片</p>
              </div>
            </div>
          </li>
        </el-col>
      </ul>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitUpload('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import axios from 'axios'

import mixins from '@/mixins/mixins'
import { getHousingTypePlot, getResidentialsubPlot, getBuildingSub } from '@/api/plot.api'
export default {
  props: ['activeType', 'activeTypeName', 'installment'],
  data() {
    return {
      loading: false,
      houseTypeList: [],
      buildingList: [],
      plotid: '',
      signKey: '',
      form: {
        imgList: []
      },
      dialogVisible: false,
      options: [],
      casArr: []
    }
  },
  mixins: [mixins],
  methods: {
    dealImgName(name) {
      if (name) {
        let arr = name.split('.')
        arr.pop()
        return arr.join('.')
      }
    },
    // 图片预览数据处理
    setImagePreview(file, fileList) {
      let filterArr = []
      // 同一张图片单次只能传一次，自动过滤掉重复的
      fileList.forEach((v, i) => {
        if (filterArr.length > 0) {
          let flag = true
          filterArr.find(val => {
            if (val.imgName === this.dealImgName(v.name)) {
              this.showInfoMsg('warning', '同一张图片一次只能上传一张')
              fileList.splice(i, 1)
              flag = false
            }
          })
          if (flag) {
            filterArr.push(v)
          }
        } else {
          filterArr.push(v)
        }
      })
      let temp = []
      filterArr.forEach((item) => {
        temp.push({
          imgName: item.imgName || this.dealImgName(item.name),
          url: item.url,
          raw: item.raw,
          imgSrc: item.url,
          imgType: this.activeType,
          imgTypeDesc: this.activeTypeName,
          houseTypeId: item.houseTypeId,
          casArr: item.casArr,
          urlLink: item.urlLink,
          file: item.raw
        })
      })
      if (this.activeType !== '9' && this.activeType !== 'tiny') {
        this.form.imgList = temp
      } else {
        this.form.imgList = [temp[temp.length - 1]]
      }
      fileList = []
    },
    submitUpload(formName) {
      if (!this.form.imgList.length) {
        this.showInfoMsg('warning', '请先选择图片')
        return false
      }
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formData = new FormData()
          let list = []
          let larger = false
          // 限制上传图片大小 有一张不满足则不能上传
          this.form.imgList.forEach(v => {
            delete v.url
            delete v.raw
            if (v.file.size / 1024 / 1024 > 5) {
              larger = true
            }
          })
          if (larger) {
            this.showInfoMsg('warning', '上传图片不得大于5M')
            return false
          }
          console.log(this.form.imgList, 'this.form.imgList')
          formData.append('method', 'homeworkstation.base.homeimg.upload.v1')
          formData.append('residentialInfoId', this.plotid)
          formData.append('v', '10')
          this.form.imgList.forEach(ele => {
            let sign = Math.random().toString(36).slice(2)
            var info = {
              residentialId: this.plotid,
              imgType: ele.imgType || '',
              imgTypeDesc: ele.imgTypeDesc || '',
              houseTypeId: ele.houseTypeId || '',
              residentialSubId: ele.casArr && ele.casArr[0] || '',
              buildingId: ele.casArr && ele.casArr[1] || '',
              albumId: ele.albumId || '',
              imgName: ele.imgName || '',
              imgDesc: ele.imgDesc || '',
              urlLink: ele.urlLink || ''
            }
            if (ele.imgType === '9') {
              info.residentialSubId = this.installment
            }
            if (ele.imgType === '1') {
              info.delFlag = '1'
            }
            formData.append(sign + '', ele.file)
            formData.append(sign + '', JSON.stringify(info))
            list.push(sign)
          })
          formData.append('imglist', JSON.stringify(list))
          axios.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation/homeworkstation.base.homeimg.upload.v1', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          }).then(res => {
            this.loading = false
            if (res.data.base_homeimg_upload_v1_response && res.data.base_homeimg_upload_v1_response.data !== -1) {
              this.showInfoMsg('success', '上传成功!')
              this.dialogVisible = false
              this.$emit('reset', res.data.base_homeimg_upload_v1_response.data)
            } else if (res.data.base_homeimg_upload_v1_response.repeatName === 1) {
              this.showInfoMsg('error', '名称重复!')
            }
          }).catch(err => {
            this.loading = true
            this.showInfoMsg('error', err)
          })
        } else {
          this.loading = false
        }
      })
    },
    deleteImg(index) {
      this.form.imgList.splice(index, 1)
    },
    getHouseType() {
      getHousingTypePlot({
        residentialInfoId: this.plotid
      }).then(res => {
        this.houseTypeList = res.data
      })
    },
    // 选中分期
    handleSubChange(val) {
      this.getSecondTypeList(val[0])
    },
    // sub-building
    getSecondTypeList(val) {
      getBuildingSub({ residentialSubId: val })
        .then(res => {
          let arr = []
          res.data.forEach(v => {
            arr.push({ label: v.bulidingNum, value: v.id })
          })
          this.options
            .find(v => v.value === val)
            .children = arr
        })
    },
    init() {
      // 户型
      this.getHouseType()
      // 分期-楼栋
      getResidentialsubPlot({
        residentialInfoId: this.plotid,
        getType: 'vo'
      }).then(res => {
        if (res.data) {
          res.data.simpleInfoVOList.forEach(v => {
            this.options.push({ label: v.residentialSubName, value: v.id, children: [] })
          })
        }
      })
    }
  },
  created() {
    this.form.imgList = []
    this.plotid = sessionStorage.getItem('plotid')
    this.init()
  }
}
</script>
<style lang='scss' scoped>
.album {
  &__uploadInput {
    opacity: 0;
    width: 1px;
    height: 1px;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 99;
    cursor: pointer;
  }
  &__uploadWrap {
    width: 152px;
    height: 152px;
    position: relative;
    text-align: center;
    background: #f7f7f7;
    border: 1px dashed #bbb;
    &:hover {
      background: #e7e7e7;
    }
  }
  &__uploadIcon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &__ready-photo-list {
    li {
      width: 90%;
      float: left;
      position: relative; // text-align: center;
      img {
        width: 150px;
        height: 150px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>

