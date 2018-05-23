<template>
  <div>
    <el-row>
      <el-radio-group class="tab__box" size='large' v-model="currentInstallmentId" @change='selectInstallment'>
        <el-radio-button :label="item.id" class="tab__item" :class="{active:item.id === currentInstallmentId}" :id='item.id' v-for="(item,index) in installmentList"
          :key="index">{{item.residentialSubName+'('+item.serialNumber+')'}}</el-radio-button>
      </el-radio-group>
    </el-row>
    <h3 class="sand__title--line">楼栋</h3>
    <ul>
      <li class="sand__iconImg" v-for="item in buildings" :key="item.id">
        <el-row class="sand__iconImg--line">
          <el-button v-if="item.bulidingNum" :class="['cursorArrow','color__'+item.saleState]">{{item.bulidingNum}}栋</el-button>
        </el-row>
        <el-row class="sand__iconImg--line">
          <el-button class="btn--group sand__iconImg--radius" :class="{active:item.id == choseBuildingArrow}" @click="choseBuilding($event,item,true)">
            <i class="iconfont icon-tuding"></i>
          </el-button>
        </el-row>
      </li>
    </ul>
    
    <h3 class="sand__title--line">
      其他
      <div class="sand__title--btn">
        <el-button @click="showUploadDialog('tiny','图钉图','picUpload')" type="primary">添加图标</el-button>
      </div>
    </h3>
    <el-row class="sand__other">
      <ul>
        <template v-if="iconList.length!==0">
          <li class="sand__iconImg" v-for="icon in iconList" :key="icon.id">
            <el-row class="sand__iconImg--line">
              <el-button :class="icon.iconType?'iconType_'+icon.iconType:'iconType_'" class="cursorArrow" type="danger">
                <img class="sand__btnImg" :src="icon.imgSrc" alt=""> {{icon.imgName}}
              </el-button>
            </el-row>
            <el-row class="sand__iconImg--line">
              <el-button-group>
                <el-button class="btn--group" :disabled="icon.delFlag==='1'" :class="{active:icon.id == choseBuildingArrow}" @click="choseBuilding($event,icon,false)">
                  <i class="iconfont icon-tuding"></i>
                </el-button>
                <el-button class="btn--group" @click="editImgInfo(icon)" title='编辑'>
                  <i class="iconfont icon-bianji"></i>
                </el-button>
                <el-button class="btn--group" v-if="icon.delFlag==='0'" title='禁用' @click="forbadeIcon(icon,'1')">
                  <i class="iconfont icon-jinzhi"></i>
                </el-button>
                <el-button class="btn--group" v-if="icon.delFlag==='1'" title='启用' @click="forbadeIcon(icon,'0')">
                  <i class="iconfont icon-chongxinqiyong"></i>
                </el-button>
              </el-button-group>
            </el-row>
          </li>
        </template>
      </ul>
    </el-row>
    <h3 class="sand__title--line">
      沙盘图
      <div v-if="currentInstallmentId" class="sand__title--btn">
        <el-button @click="save('sandImg')" type="primary">保存修改</el-button>
      </div>
      <div v-if="currentInstallmentId" class="sand__title--btn">
        <el-button style="background:#B4BCCC;border-color:#B4BCCC" @click="showUploadDialog('9','楼栋图','picUpload1')" type="primary">上传图片</el-button>
      </div>
    </h3>
    <div v-loading='loading' v-if="sandImg&&sandImg.id" class="houseImg" ref="houseImg" @click="point($event)">
      <span v-if="!sandImg.id" class="houseImg-default-text">沙盘图</span>
      <img v-if="sandImg.imgSrc" :src="sandImg.imgSrc" class="avatar" id="imgView">
      <template>
        <div @click="changeZIndex($event,item)" class="img-tooltips" v-for="(item,index) in imgSigns" :key="index" :style="{'top':item.posT,'left':item.posL}">
          <el-button :class="['sand__tuding','color__'+item.saleStatus,item.saleStatus?'':(item.iconType?'iconType_'+item.iconType:'iconType_')]" :title="formatSaleState(item.saleStatus)" type="danger">
            <template v-if="item.saleStatus">
              {{item.bulidingNum}}栋
            </template>
            <template v-else>
              <img v-if="item.url" class="sand__btnImg" :src="item.url" alt="">
              {{item.bulidingNum||item.imgName}}
            </template>
            <span class="sand__tuding--delete" @click.stop.prevent="removePoint(item)">
              <i class="iconfont icon-shanchutuding"></i>
            </span>
          </el-button>
        </div>
      </template>
    </div>
    <el-row v-if="sandImg&&sandImg.id">
      <el-col :md="2">
        <span class="bulidingTitle">简介描述：</span>
      </el-col>
      <el-col :md="8">
        <el-form :model="sandImg" ref="sandImg" class="demo-ruleForm">
          <el-form-item prop="imgDesc" :rules="{max:100,message:'描述在100字以内',trigger:'change&blur'}">
            <el-input type="textarea" v-model="sandImg.imgDesc"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <edit-img @reset='reset' :form-data='formData' :img-type='activeType' ref='editImg'></edit-img>
    <pic-upload @reset='reset' :active-type="iconType" :active-type-name="iconTypeName" ref="picUpload"></pic-upload>
    <pic-upload @reset='reset' :installment='currentInstallmentId' :active-type="iconType" :active-type-name="iconTypeName" ref="picUpload1"></pic-upload>
  </div>
</template>
<script src='./sandTableFigure.js'></script>
<style src="./sandTableFigure.component.scss" lang='scss'></style>
