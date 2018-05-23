<template>
  <div class="album__wrap">
    <el-row>
      <el-col :md="18">
        <el-radio-group class="tab__box" size='large' v-model="activeType" @change='fetchPhotosByList'>
          <el-radio-button :label="list.dictItemCode" :class="{'active':activeType==list.dictItemCode}" v-for="list in photoTypeListData"
            :key="list.dictItemId">{{list.dictItemValue}}</el-radio-button>
        </el-radio-group>
      </el-col>
      <div class="f-r">
        <el-button :disabled="activeType === '1'" type="primary" @click="showUploadDialog">上传
        </el-button>
        <el-button :disabled="activeType === '1'||activeType === '11'||activeType === '10'" type="primary" @click="imgSort">更新排序
        </el-button>
        <el-button :disabled="activeType === '1'||activeType === '11'||activeType === '10'" type="danger" @click="addAlbum">添加相册
        </el-button>
      </div>
    </el-row>
    <el-row>
      <ul class="album__photoList">
        <!-- 相册 -->
        <template v-for="pic in showAlbumList">
          <li :class="['album__picList','album__type'+activeType]" :key="pic.id">
            <i class="el-icon-picture album__albumIcon"></i>
            <img :src="pic.imgSrc">
            <div class="album__imgdec-wrap">
              <!-- 控制样式与图片展示相同 -->
              <p v-if="activeType==='7'" class="album__imgdec"></p>
              <p class="album__imgdec">
                <span :title="pic.imgName">{{pic.imgName}}</span>
              </p>
              <p class="album__imgdec">
                <span>{{pic.imgDesc}}</span>
              </p>
              <p>
                <el-button-group>
                  <el-button class="btn--group" @click="deleteAlbum(pic.id)" title="删除">
                    <i class="iconfont icon-shanchu"></i>
                  </el-button>
                  <el-button class="btn--group" @click="lookAlbum(pic)" title="查看">
                    <i class="iconfont icon-chakan"></i>
                  </el-button>
                  <el-button class="btn--group" title="编辑" @click="editAlbumInfo(pic)">
                    <i class="iconfont icon-bianji"></i>
                  </el-button>
                </el-button-group>
              </p>
            </div>
          </li>
        </template>
        <!-- 可拖拽图片 -->
        <draggable v-model='showImgList' :options="{draggable:'.imgItem'}" @start="drag=true" @end="drag=false">
          <li :class="['album__picList','album__type'+activeType,{'imgItem':activeType!=='1'}]" v-for="(pic,index) in showImgList" :key="pic.id">
            <i v-if="pic.inAlbum==='1'" class="redfont iconfont icon-yinyong album__albumIcon"></i>
            <img class="preview-img" :src="pic.imgSrc" height="100" @click="$preview.open(index, showImgList)">
            <div class="album__imgdec-wrap">
              <p class="album__imgdec">
                <span :title="pic.imgName">{{pic.imgName}}</span>
              </p>
              <p v-if="activeType==='7'" class="album__imgdec">
                <span>{{pic.residentialSubName?(pic.residentialSubName+'期'):''}}{{pic.buildingName?(pic.buildingName+'栋'):''}}</span>
              </p>
              <p class="album__imgdec">
                <span>{{pic.imgDesc}}</span>
              </p>
              <p v-if="activeType !== '1'">
                <el-button-group>
                  <el-button class="btn--group" @click="deletePic(pic)" title="删除">
                    <i class="iconfont icon-shanchu"></i>
                  </el-button>
                  <a title='查看' v-if="activeType === '11'||activeType === '10'" class="btn--group el-button el-button--default" :href="'http://'+pic.urlLink"
                    target="__blank">
                    <i class="iconfont icon-chakan"></i>
                  </a>
                  <el-button class="btn--group" title="编辑" @click="editImgInfo(pic)">
                    <i class="iconfont icon-bianji"></i>
                  </el-button>
                </el-button-group>
              </p>
            </div>
          </li>
        </draggable>
        <div class="noPic" v-if="!showAlbumList.length&&!showImgList.length">暂无图片</div>
      </ul>
    </el-row>
    <pic-upload @reset='reset' :active-type="activeType" :img-type='activeType' :active-type-name="activeTypeName" ref="picUpload"></pic-upload>
    <edit-img @reset='reset' :form-data='formData' :img-type='activeType' ref='editImg'></edit-img>
    <edit-album @reset='reset' :album-form-data='albumFormData' ref='editAlbum'></edit-album>
  </div>
</template>
<script src='./album.js'></script>
<style src="./album.component.scss" lang='scss'></style>
