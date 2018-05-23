<template>
  <div class="openHouse_wrap">
    <el-row class="openHouse__show" :gutter="20" style="marginRight:0">
      <el-col :md="3">
        <el-select clearable @change='selectInstallment' ref='installment' v-model="currentInstallmentId">
          <el-option v-for="item in installmentList" :label="item.residentialSubName" :value="item.id" :key='item.id'></el-option>
        </el-select>
      </el-col>
      <el-col v-if="currentInstallmentId" :md="18">
        <el-radio-group class="tab__box" size='large' v-model="curOpenHouseId" @change='checkOpenHouse'>
          <el-radio-button :label="item.id" :class="{active:curOpenHouseId === item.id}" class="openHouse_tip" v-for='(item,index) in openHouseList'
            :key="index">{{'第'+item.serialNumber+'次开盘'}}</el-radio-button>
          <el-button class="tab__add" size="large" @click="addOpenHouse" type="text">新增开盘</el-button>
        </el-radio-group>
      </el-col>
      <div v-if="openHouseList.length" class="f-r">
        <el-button @click="submit('ruleForm')" type="primary">保存修改</el-button>
      </div>
    </el-row>
    <template v-if="openHouseList.length">
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="138px" class="openHouse__form">
        <el-row>
          <el-col :md="6">
            <el-form-item required label="销售状态：" prop="saleStatus">
              <el-select clearable v-model="ruleForm.saleStatus" v-dict="{name:'sellinfo',data:'sellinfo'}" placeholder="请选择">
                <el-option v-for="item in dictData.sellinfo" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="6" :offset="4">
            <el-form-item label="预售许可证：" prop="preSalePermitPersonAdd">
              <el-input v-model="ruleForm.preSalePermitPersonAdd"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="6">
            <el-form-item required label="预开盘时间：" prop="prepareOpenTime">
              <el-input v-model="ruleForm.prepareOpenTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="6">
            <el-form-item label="开盘时间：" prop="openTime">
              <div class="block">
                <el-date-picker :editable='false' v-model="ruleForm.openTime" type="date" placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="简介描述：" prop="intro">
              <el-input placeholder="描述在2000字以内" type="textarea" v-model="ruleForm.intro"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="预售证：" prop="preSalePermit">
            <ul>
              <li class="permit" v-for="(item,index) in ruleForm.preSalePermit" :key="index">{{item}}</li>
            </ul>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :md="22">
            <el-form-item label="开盘楼栋：" prop="openBuildings">
              <template v-if="buildingList.length!==0">
                <el-checkbox-group @change="getHousingType" v-model="checkboxGroup" size="small">
                  <el-checkbox-button class="openHouse__building" v-for="(build,index) in buildingList" :label="build.id" :key="index">{{build.bulidingNum}}</el-checkbox-button>
                </el-checkbox-group>
              </template>
              <template v-else>
                <p class="openHouse__tip">未创建楼栋，请在“楼栋信息”中创建楼栋</p>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>

    <div class="houseType__table">
      <el-table @selection-change='selectHousingType' ref="multipleTable" :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="48"></el-table-column>
        <el-table-column property="housingImgId" label="户型图" width="144">
          <template slot-scope="scope">
            <img class="houseType__img" :src="scope.row.housingImgSrc" alt="">
          </template>
        </el-table-column>
        <el-table-column property="housingTypeName" label="户型名称" width="96"></el-table-column>
        <el-table-column property="sellStatus" label="销售状态" width="96">
          <template slot-scope="scope">
            <div v-html="dictTransform(scope.row.sellStatus,'sellinfoNewList')"></div>
          </template>
        </el-table-column>
        <el-table-column property="avagPrice" label="户型均价" width="96"></el-table-column>
        <el-table-column property="orientation" label="朝向" width="72">
          <template slot-scope="scope">
            <div v-html="dictTransform(scope.row.orientation,'houseOrientationList')"></div>
          </template>
        </el-table-column>
        <el-table-column property="shortkey" label="几居室" width="84">
          <template slot-scope="scope">
            <div v-html="dictTransform(scope.row.shortkey,'houseStyleList')"></div>
          </template>
        </el-table-column>
        <el-table-column property="roomTypeName" label="房型" width="108"></el-table-column>
        <el-table-column property="coveredArea" label="建筑面积" width="96"></el-table-column>
        <el-table-column property="insideSpace" label="套内面积" width="96"></el-table-column>
        <el-table-column property="houseNum" label="楼栋/单元/房号">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.houseAddress" :key="index">{{item}}</div>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="currentInstallmentId" class="installment__proTyped">
        <el-row :gutter="10">
          <el-col :span="6">
            <span class="f-l">已维护过的物业类型：</span>
            <el-select v-if="proTypeList.length" v-model="propertyType" ref="propertyType" @change="changePropertyType" class="installment__propertyType"
              clearable placeholder="请选择">
              <el-option v-for="(item,i) in proTypeList" :key="i" :label="item.propertyTypeName" :value="item.propertyType">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="16">
            <div class="installment__proItem" v-for="(housingType,index) in proTypeList" :key="index">{{housingType.propertyParentName}}-{{housingType.propertyTypeName}}</div>
          </el-col>
          <el-col :span="2">
            <el-button v-if="propertyType&&curOpenHouseId" @click="addPrice" class="f-r" type="primary">新增价格</el-button>
          </el-col>
        </el-row>
      </div>

      <div v-if="propertyType&&curOpenHouseId">
        <el-table class="installment__table" :data="priceTable" border style="width: 100%">
          <el-table-column prop="avgPrice" label="价格（元/平）" width="150">>
          </el-table-column>
          <el-table-column prop="preAvgPrice" label="预售证价格（元/平）" width="150">>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="150">
            <template slot-scope="scope">
              <div>{{scope.row.createTime|timeFormat}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="priceDesc" label="简介">
          </el-table-column>
          <el-table-column label="操作" width='120'>
            <template slot-scope="scope">
              <span @click="editPrice(scope.row)" title='编辑'>
                <i class="iconfont icon-bianji icon-btn"></i>
              </span>
              <span @click="deletePrice(scope.row)" title='删除'>
                <i class="iconfont icon-shanchu icon-btn"></i>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="block paginationStyle">
          <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage" :page-sizes="[10, 15, 20, 25]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
          </el-pagination>
        </div>
      </div>


      <el-dialog size='tiny' title="价格信息" :visible.sync="priceDialog">
        <el-form :model="priceForm" :rules="priceRules" ref="priceForm" label-width="100px">
          <el-form-item required :label="proObj.propertyTypeName+'均价'" prop="avgPrice">
            <el-input v-model="priceForm.avgPrice">
              <template slot="append">元/平</template>
            </el-input>
          </el-form-item>
          <el-form-item label="预售证均价" prop="preAvgPrice">
            <el-input v-model="priceForm.preAvgPrice">
              <template slot="append">元/平</template>
            </el-input>
          </el-form-item>
          <el-form-item label="简介" prop="priceDesc">
            <el-input type="textarea" v-model="priceForm.priceDesc"></el-input>
          </el-form-item>
          <el-form-item class="f-r">
            <el-button @click="priceDialog = false">取 消</el-button>
            <el-button :disabled="!throttle" type="primary" @click="submitEditPrice">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script src='./openHouse.js'></script>
<style src='./openHouse.component.scss' lang='scss'></style>
