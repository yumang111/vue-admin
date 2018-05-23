<template>
  <div>
    <h2 class="header--titleH2 near">
      {{title}}
      <template v-if="sub===1">
        <el-row class="addHouseTypeSave">
          <el-button @click="modify('ruleForm')" type="primary">保存修改</el-button>
        </el-row>
      </template>
      <template v-if="sub === 2">
        <el-row class="addHouseTypeSave">
          <el-button type="primary" @click="submitForm('ruleForm')">确认添加</el-button>
        </el-row>
      </template>
    </h2>
    <div>
      <el-form label-position="left" :model="ruleForm" :rules="ruleFormRules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-row>
          <el-col :md="6">
            <el-form-item required label="户型名称：" prop="housingTypeName">
              <el-input v-model="ruleForm.housingTypeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="6">
            <el-form-item required label="销售状态：" prop="sellStatus">
              <el-select clearable v-model="ruleForm.sellStatus" v-dict="{name:'sellinfo',data:'sellinfo'}" placeholder="销售状态">
                <el-option v-for="item in dictData.sellinfo" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="6">
            <el-form-item label="户型均价：" prop="avagPrice">
              <el-row>
                <el-col :md="18">
                  <el-input v-model="ruleForm.avagPrice"></el-input>
                </el-col>
                <el-col :md="6">
                  元/平
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="6">
            <el-form-item label="户型属性：" prop="familyProperty">
              <el-select ref="familyProperty" clearable v-model="ruleForm.familyProperty" v-dict="{name:'familyProperty',data:'familyProperty'}" placeholder="户型属性">
                <el-option v-for="item in dictData.familyProperty" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="6">
            <el-form-item label="朝向：" prop="orientation">
              <el-select clearable v-model="ruleForm.orientation" v-dict="{name:'houseOrientation',data:'houseOrientation'}" placeholder="朝向">
                <el-option v-for="item in dictData.houseOrientation" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="6">
            <el-form-item label="层高：" prop="floorHeight">
              <el-row>
                <el-col :md="20">
                  <el-input v-model="ruleForm.floorHeight"></el-input>
                </el-col>
                <el-col :md="4">
                  米
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="6">
            <el-form-item required label="几居室:" prop="shortkey">
              <el-select clearable v-model="ruleForm.shortkey" v-dict="{name:'houseStyle',data:'houseStyle'}" placeholder="几居室">
                <el-option v-for="item in dictData.houseStyle" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="6">
            <el-form-item required label="房型：" prop="roomTypeId">
              <el-select ref="roomType" clearable v-model="ruleForm.roomTypeId" placeholder="房型">
                <el-option v-for="item in roomTypeList" :key="item.id" :label="item.houseStyleName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="6">
            <el-form-item required label="建筑面积：" prop="coveredArea">
              <el-row>
                <el-col :md="20">
                  <el-input v-model="ruleForm.coveredArea"></el-input>
                </el-col>
                <el-col :md="4">
                  ㎡
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="6">
            <el-form-item label="套内面积：" prop="insideSpace">
              <el-row>
                <el-col :md="20">
                  <el-input v-model="ruleForm.insideSpace"></el-input>
                </el-col>
                <el-col :md="4">
                  ㎡
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="20">
            <el-form-item required label="户型图：" prop="imgIds">
              <el-input v-show="false" v-model="ruleForm.imgIds"></el-input>
              <div class="addHouseType__img" v-for="item in imgList" :key="item.id">
                <img :src="item.imgSrc" alt="">
                <el-button-group class="addHouseType__icon">
                  <el-button class="btn--group" @click="deleteImg(item.id)" title="删除">
                    <i class="iconfont icon-shanchu"></i>
                  </el-button>
                  <el-button class="btn--group" title="编辑" @click="editImg(item)">
                    <i class="iconfont icon-bianji"></i>
                  </el-button>
                </el-button-group>
              </div>
              <el-button type="primary" @click="showUploadDialog">上传图片</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="标签：" prop="tagsIds">
            <check-tag :rootId='3' v-model="ruleForm.tagsIds"></check-tag>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="简介描述：" prop="housingDesc">
              <el-input placeholder="描述在2000字以内" type='textarea' v-model="ruleForm.housingDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <edit-img @reset='reset' :form-data='formData' :img-type='activeType' ref='editImg'></edit-img>
      <pic-upload @reset='reset' :active-type="activeType" :active-type-name="activeTypeName" ref="picUpload"></pic-upload>
    </div>
  </div>
</template>
<script src='./addForm.js'></script>
<style src='./addForm.scss' lang='scss'></style>