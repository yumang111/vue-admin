<template>
  <div class="maplocate-wraper">
    <h2 class="header--titleH2">
      小区名称
      <div class="f-r">
        <el-button type="primary" v-if="status!='1'" @click="editecmName">保存修改</el-button>
      </div>
    </h2>
    <div class="cmname-info item-wraper">
      <template v-if="status=='1'">
        <h2 class="item-value-name" v-if="status!='3'">{{cmname}}</h2>
      </template>
      <template v-else>
        <el-form :model="ruleForm4" :rules="rules4" ref="ruleForm4" label-width="100px" label-position="left">
          <el-form-item label="当前名:" required class="tradeArea-item" prop="cmname">
            <el-input type="text" class="spell-input" @blur="verifyCmname" v-model="ruleForm4.cmname"></el-input>
          </el-form-item>
          <el-form-item label="别名:" class="tradeArea-item" prop="residentialNickName">
            <el-row>
              <el-col :span="10">
                <div v-for="(item,index) in ruleForm4.residentialNickName" :key="index">
                  <el-input type="text" class="spell-input" v-model="item.name"></el-input>
                </div>
              </el-col>
              <el-col :span="14">
                <el-button @click="addcmNickname">添加</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </template>
    </div>
    <h2 class="header--titleH2">
      地图标注
      <div class="f-r">
        <el-button type="primary" v-if="status!='1'" @click="submitcm(2)">保存修改</el-button>
      </div>
    </h2>
    <el-row>
      <el-col :span="12">
        <div id="map"></div>
        <div class="btn-wraper">
          <el-input class="width100" readonly v-model="lngvalue" placeholder="请输入内容"></el-input>
          <el-input class="width100" readonly v-model="latvalue" placeholder="请输入内容"></el-input>
          <el-button @click="resetPoint">重新标注</el-button>
          <el-button class="f-r" @click="drawImg">画图</el-button>
          <el-button class="f-r" @click="editeImg">编辑</el-button>
          <el-button class="f-r" @click="clearImg">清除</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="map-info">
          <el-form :model="ruleForm" label-position="top" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="小区地址" class="map-info-title first-item martopj10" required>
              <el-col :span="5">
                <el-select ref="province" clearable @change="changeProvince" class="padrg15" v-model="ruleForm.province" placeholder="请选择">
                  <el-option v-for="item in provinceArr" :key="item.provinceid" :label="item.province" :value="item.provinceid">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select ref="city" clearable @change="changeCity" class="padrg15" v-model="ruleForm.city" placeholder="请选择">
                  <el-option v-for="item in cityArr" :key="item.cityid" :label="item.city" :value="item.cityid+'/'+item.city">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-form-item prop="region">
                  <el-select size="small" :disabled="ruleForm.city!=='420100/武汉市'" clearable class="padrg15" @change="changeRegion" v-model="ruleForm.region"
                    placeholder="请选择">
                    <el-option v-for="item in getRegionData" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode+'/val/'+item.dictItemValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item prop="address">
                  <el-input v-model="ruleForm.address" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-form>
          <h2 class="map-info-title martopj15">周边配套</h2>
          <ul class="searchArround">
            <li class="arroundItem" :class="{cur:keywrods=='交通'}" @click="searchArrounding('交通')">交通</li>
            <li class="arroundItem" :class="{cur:keywrods=='娱乐'}" @click="searchArrounding('娱乐')">娱乐</li>
            <li class="arroundItem" :class="{cur:keywrods=='超市'}" @click="searchArrounding('超市')">超市</li>
            <li class="arroundItem" :class="{cur:keywrods=='餐饮'}" @click="searchArrounding('餐饮')">餐饮</li>
            <li class="arroundItem" :class="{cur:keywrods=='银行'}" @click="searchArrounding('银行')">银行</li>
            <li class="arroundItem" :class="{cur:keywrods=='医院'}" @click="searchArrounding('医院')">医院</li>
            <li class="arroundItem" :class="{cur:keywrods=='学校'}" @click="searchArrounding('学校')">学校</li>
          </ul>
          <div id="r-result"></div>
        </div>
      </el-col>
    </el-row>
    <h2 class="header--titleH2">
      商圈功能区
    </h2>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" label-position="left" class="tradeArea-wraper demo-ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商圈:" class="tradeArea-item">
            <el-select clearable class="padrg15 block" @change='changTradeArea' v-model="ruleForm2.tradeCircle" placeholder="请选择">
              <el-option v-for="item in tradeAreaData" :key="item.shortKey" :label="item.tradingAreaParentName" :value="item.shortKey+'/val/'+item.tradingAreaParentName">
              </el-option>
            </el-select>
            <el-select clearable class="padrg15 block" v-model="ruleForm2.tradeCircleSub" placeholder="请选择">
              <el-option v-for="item in tradeAreaSubData" :key="item.shortKey" :label="item.tradingAreaName" :value="item.shortKey+'/val/'+item.tradingAreaName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="板块:" class="tradeArea-item" required prop="district">
            <el-select clearable class="padrg15 block" v-model="ruleForm2.district" placeholder="请选择">
              <el-option v-for="item in districtData" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode+'/val/'+item.dictItemValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="居住新区:" class="tradeArea-item" required prop="newArea">
            <el-select clearable class="padrg15 block" v-model="ruleForm2.newArea" placeholder="请选择">
              <el-option v-for="item in newAreaData" :key="item.shortKey" :label="item.districtName" :value="item.shortKey+'/val/'+item.districtName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="环线" class="tradeArea-item">
            <el-select clearable class="padrg15 block" v-model="listloop" placeholder="请选择">
              <el-option v-for="item in listloopData" :key="item.id" :label="item.loopLineName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item ref="nolimit" label="不限购区" class="tradeArea-item" prop="nolimitAreaId">
            <el-select v-model="ruleForm2.nolimitAreaId" clearable placeholder="请选择">
              <el-option v-for="item in unLimitArea" :key="item.shortKey" :label="item.areaName" :value="item.shortKey">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <h2 class="header--titleH2">
      其它信息
    </h2>
    <el-form :model="ruleForm3" :rules="rules3" ref="ruleForm3" label-width="100px" label-position="left">
      <el-row>
        <el-col :span="12">
          <el-form-item label="全拼缩写:" required class="tradeArea-item" prop="spell">
            <el-input type="text" class="spell-input" :disabled="status!='1'" v-model="ruleForm3.spell"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="小区来源:" required class="tradeArea-item" prop="residentialInfocol">
            <el-checkbox-group v-model="ruleForm3.residentialInfocol" :min="1" :max="2">
              <el-checkbox v-for="item in sourceList" :label="item.dictItemCode" :value='item.dictItemValue' :key="item.dictItemCode">{{item.dictItemValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="占地面积" class="tradeArea-item" prop="areanum">
            <el-input type="text" class="spell-input" v-model="ruleForm3.areanum"></el-input>
            <span> ㎡</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建筑面积" class="tradeArea-item" prop="buildingArea">
            <el-input type="text" class="spell-input" v-model="ruleForm3.buildingArea"></el-input>
            <span>㎡</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="createcmBtn" v-if="status=='1'">
      <el-button type="primary" class="btn" @click="submitcm(0)">创建</el-button>
      <el-button class="btn" @click="returnCheck">上一步</el-button>
    </div>
    <h2 class="header--titleH2" v-if="status!='1'">
      配套及交通
      <div class="f-r">
        <el-button type="primary" @click="editeST">保存修改</el-button>
      </div>
    </h2>
    <supportrafic v-if="status!=='1'" ref="support"></supportrafic>
  </div>
</template>
<script src="./maplocate.component"></script>
<style src="./maplocate.component.scss" lang="scss" scoped></style>
