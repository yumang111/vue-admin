<template>
  <div>
    <el-row class="openHouse_show" :gutter="20" style="marginRight:0px;">
      <el-col :md="3">
        <el-select clearable @change='selectInstallment' ref='installment' v-model="currentInstallmentId">
          <el-option v-for="item in installmentList" :label="item.residentialSubName" :value="item.id" :key='item.id'></el-option>
        </el-select>
      </el-col>
      <el-col v-if="currentInstallmentId" :md="18">
        <el-radio-group class="tab__box" size='large' v-model="curBuildId" @change='changeBuilding'>
          <el-radio-button :label="item.id" class="tab__item" :class="{active:item.id === curBuildId}" :id='item.id' v-for="(item,index) in buildingNumList"
            :key="index">{{item.bulidingNum+'栋'}}</el-radio-button>
          <el-button class="tab__add" size="large" @click="addBuilding" type="text">新增楼栋</el-button>
          <el-button class="tab__add" size="large" @click="copyBuildDialog = true" type="text">复制楼栋</el-button>
        </el-radio-group>
        <!-- <div>
        </div> -->
      </el-col>
      <el-button v-if='currentInstallmentId&&buildingNumList.length' class="f-r" type="primary" @click="onSubmit('building')">保存修改</el-button>
    </el-row>
    <!-- 复制楼栋弹框 -->
    <el-dialog @close='$refs.copyForm.resetFields()' size="tiny" title="复制楼栋" :visible.sync="copyBuildDialog">
      <el-form label-width="100px" :rules="copyFormRules" ref='copyForm' label-position="left" :model="copyForm">
        <el-row>
          <el-col :span="20">
            <el-form-item required label="楼栋名：" prop='id'>
              <el-select clearable v-model="copyForm.id">
                <el-option :disabled="item.bind==='1'" v-for="item in buildingNumList" :label="item.bulidingNum" :value="item.id" :key='item.id'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item required label="新楼栋名：" prop='name'>
              <el-input v-model="copyForm.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="copyBuildDialog = false">取 消</el-button>
        <el-button type="primary" @click="copyBuild">确 定</el-button>
      </div>
    </el-dialog>
    <div v-loading.fullscreen.lock="loading" v-if='currentInstallmentId&&buildingNumList.length' class="buildingForm">
      <el-form label-position='left' :model="building" :rules="rules" ref="building" label-width="126px">
        <el-row>
          <el-col :md="6">
            <el-form-item required label="楼栋名：" prop="bulidingNum">
              <el-input type="text" v-model="building.bulidingNum" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="2" class="formItem_suffix">栋</el-col>
          <el-col :offset="2" :md="6">
            <el-form-item required label="销售状态：" prop="saleState">
              <el-select clearable v-model="building.saleState" v-dict="{name:'sellinfo',data:'sellinfo'}" placeholder="销售状态">
                <el-option v-for="item in dictData.sellinfo" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="6">
            <el-form-item label="朝向：" prop="orientation">
              <el-select clearable v-model="building.orientation" placeholder="朝向">
                <el-option v-for="item in houseOrientationList" :key='item.dictItemCode' :label="item.dictItemValue" :value="item.dictItemCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset="4" :md="6">
            <el-form-item label="日照时间：" prop="sunshineTime">
              <el-row>
                <el-col :md="18">
                  <el-input v-model="building.sunshineTime"></el-input>
                </el-col>
                <el-col :md="6">
                  小时
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="6">
            <el-form-item label="预交房时间：" prop="junctionRoomShowTime">
              <el-input v-model="building.junctionRoomShowTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="6">
            <el-form-item label="交房时间：" prop="junctionRoomTime">
              <div class="block">
                <el-date-picker :editable='false' v-model="building.junctionRoomTime" type="date" placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="6">
            <el-form-item label="公摊：" prop="share">
              <el-input v-model="building.share"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="1" class="formItem_suffix">%</el-col>
        </el-row>
        <el-row>
          <el-col :md="20">
            <el-form-item label="标签：" prop="tags">
              <check-tag :rootId='2' v-model="building.tags"></check-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="简介描述：" prop="buildingDesc">
            <el-input type="textarea" placeholder="描述在2000字以内" v-model="building.buildingDesc" style='width:600px;'></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <h2 v-if="building.id" class="header--titleH2">
        可视化楼栋 住宅
        <template v-if="building.bind==='0'">
          <el-row class="bindBuild">
            <el-button type="primary" @click="checkBuilding">绑定楼栋</el-button>
          </el-row>
        </template>
        <template v-if="building.bind==='1'">
          <el-row class="bindBuild">
            <span class="bindBuild--title">{{building.building}}</span>
            <el-button type="primary" @click="unbindBuilding">解绑楼栋</el-button>
          </el-row>
        </template>
      </h2>
      <el-dialog title='绑定楼栋' size='tiny' :visible.sync="bindBuildingDialog">
        <el-form>
          <el-form-item label="一房一价楼栋：">
            <el-select clearable ref="yfyjBuilding" @change='changeyfyjBuilding' v-model="selectyfyjBuilding" placeholder="请选择">
              <el-option v-for="item in yfyjBuildingList" :key="item.id" :label="item.projectName+'('+item.building+')'" :value="item.id"
                :disabled="item.buildingId!==''&&!!item.buildingId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="bindBuildingDialog = false">取 消</el-button>
          <el-button type="primary" @click="bindBuilding">确 定</el-button>
        </div>
      </el-dialog>
      <template v-if="building.id">
        <!-- 住宅 -->
        <visual-building ref="visual" :building='building' :proType='proType'></visual-building>
      </template>
      <h2 v-if="building.id" class="header--titleH2">可视化楼栋 商业</h2>
      <template v-if="building.id">
        <!-- 商业 -->
        <visual-building ref="visual2" :building='building' :proType='proSType'></visual-building>
      </template>
    </div>

  </div>
</template>
<script src='./buildingInfo.js'></script>
<style src="./buildingInfo.component.scss" lang='scss' scoped></style>
