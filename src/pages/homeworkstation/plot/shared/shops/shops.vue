<template>
  <div>
    <h2 class="header--titleH2">
      商业公共数据
      <div class="f-r">
        <el-button type="primary" @click="submit">保存修改</el-button>
      </div>
    </h2>
    <el-form label-position="left" label-width="126px" :model="shopsForm" :rules="rules" ref="shopsForm">
      <el-row>
        <el-col :span="8">
          <el-row>
            <el-col :span="16">
              <el-form-item label="开间面积（平方米）" prop="acreageMin">
                <el-input @change="change('acreage')" v-model="shopsForm.acreageMin" style="width:120px;">
                  <template slot="prepend">&ge;</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item ref="acreageMax" label-width='0px' prop="acreageMax">
                <el-input @change="change('acreage')" v-model="shopsForm.acreageMax" style="width:120px;">
                  <template slot="prepend">且&le;</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :offset='2' :md="6">
          <el-form-item label="面积区间-展示" prop="acreageShow">
            <el-input v-model="shopsForm.acreageShow"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="开业日期" prop="openTime">
            <div class="block">
              <el-date-picker @input="changeDate" v-model="shopsForm.openTime" type="date" placeholder="选择日期">
              </el-date-picker>
            </div>
          </el-form-item>
        </el-col>
        <el-col :offset='4' :md="6">
          <el-form-item label="开业日期-展示" prop="openTimeShow">
            <el-input v-model="shopsForm.openTimeShow"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-row>
            <el-col :span="16">
              <el-form-item label="层高（米）" prop="heightMin">
                <el-input @change="change('height')" v-model="shopsForm.heightMin" style="width:120px;">
                  <template slot="prepend">&ge;</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width='0px' prop="heightMax">
                <el-input @change="change('height')" v-model="shopsForm.heightMax" style="width:120px;">
                  <template slot="prepend">且&le;</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :offset='2' :md="6">
          <el-form-item label="层高-展示" prop="heightShow">
            <el-input v-model="shopsForm.heightShow"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="停车费" prop="parkingFee">
            <el-input v-model="shopsForm.parkingFee"></el-input>
          </el-form-item>
        </el-col>
        <el-col :offset='4' :md="6">
          <el-form-item label="收益(%)" prop="profit">
            <el-input v-model="shopsForm.profit"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-row>
            <el-col :span="16">
              <el-form-item label="租金收益（元/月.平米）" prop="rentalIncomeMin">
                <el-input @change="change('rentalIncome')" v-model="shopsForm.rentalIncomeMin" style="width:120px;">
                  <template slot="prepend">&ge;</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width='0px' prop="rentalIncomeMax">
                <el-input @change="change('rentalIncome')" v-model="shopsForm.rentalIncomeMax" style="width:120px;">
                  <template slot="prepend">且&le;</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :offset='2' :md="6">
          <el-form-item label="收益-展示" prop="profitShow">
            <el-input v-model="shopsForm.profitShow"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :md="6">
          <el-form-item label="可分割" prop="division">
            <el-radio v-for="item in divisionList" :key="item.dictItemCode" class="radio" v-model="shopsForm.division" :label="item.dictItemCode">{{item.dictItemValue}}</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <h2 class="header--titleH3">商铺数据</h2>
      <el-row>
        <el-col :span="8">
          <el-row>
            <el-col :span="16">
              <el-form-item label="面宽（米）" prop="wideMin">
                <el-input @change="change('wide')" v-model="shopsForm.wideMin" style="width:120px;">
                  <template slot="prepend">&ge;</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width='0px' prop="wideMax">
                <el-input @change="change('wide')" v-model="shopsForm.wideMax" style="width:120px;">
                  <template slot="prepend">且&le;</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :offset='2' :md="6">
          <el-form-item label="面宽-展示" prop="wideShow">
            <el-input v-model="shopsForm.wideShow"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-row>
            <el-col :span="16">
              <el-form-item label="进深（米）" prop="depthMin">
                <el-input @change="change('depth')" v-model="shopsForm.depthMin" style="width:120px;">
                  <template slot="prepend">&ge;</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width='0px' prop="depthMax">
                <el-input @change="change('depth')" v-model="shopsForm.depthMax" style="width:120px;">
                  <template slot="prepend">且&le;</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :offset='2' :md="6">
          <el-form-item label="进深-展示" prop="depthShow">
            <el-input v-model="shopsForm.depthShow"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="经营范围" prop="businessScope">
          <el-checkbox-group @change="changeBusinessScope" v-model="shopsForm.businessScope">
            <el-checkbox v-for="(item,index) in businessScopeList" :key="index" :label="item.dictItemValue" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span='12'>
          <el-form-item label="经营范围-展示" prop="businessScopeShow">
            <el-input type="textarea" v-model="shopsForm.businessScopeShow"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script src='./shops.js'></script>
