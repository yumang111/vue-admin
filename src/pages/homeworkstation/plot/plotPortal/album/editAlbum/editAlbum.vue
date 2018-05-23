<template>
  <div>
    <el-dialog title="编辑相册信息" v-model="albumEditDialog" size="tiny" v-if="albumEditDialog">
      <el-form :rules='rules' ref="albumForm" :model="albumForm" label-width="40px">
        <el-form-item label="名称" prop="albumName">
          <el-input v-model="albumForm.albumName" placeholder="请输入0-15汉字长度"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="albumDesc">
          <el-input type="textarea" v-model="albumForm.albumDesc" placeholder="请输入0-100汉字长度"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="albumEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateAlbum('albumForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { updateAlbumInfo } from '../album.api'
import mixins from '@/mixins/mixins'
export default {
  data() {
    return {
      isShowEditDialog: false,
      albumEditDialog: false,
      rules: {
        albumName: [
          { max: 15, message: '名称在15字以内', trigger: 'change&blur' }
        ],
        albumDesc: [
          { max: 100, message: '名称在100字以内', trigger: 'change&blur' }
        ]
      }
    }
  },
  props: ['albumFormData', 'imgType'],
  mixins: [mixins],
  computed: {
    albumForm: {
      get() {
        return this.albumFormData
      },
      set() {
      }
    }
  },
  methods: {
    updateAlbum(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateAlbumInfo(this.albumForm).then(res => {
            if (res.data) {
              this.showInfoMsg('success', '更新相册信息成功！')
              this.albumEditDialog = false
              this.$emit('reset', 'success')
            } else {
              this.showInfoMsg('error', '更新相册信息失败！')
            }
          })
        } else {
          return false
        }
      })
    }
  },
  created() {
  }
}
</script>
<style lang='scss'>
::-webkit-input-placeholder {
  font-family: 'Microsoft YaHei';
  font-size: 14px;
}
</style>
