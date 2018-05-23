<template>
  <div class="search-wrapper cf">
    <!--<div class="itemname f-l">查询条件</div>-->
    <el-row>
      <el-col :span="widthNum">
        <div class="search-condition-wrap" v-if="searchtype==0">
          <el-select clearable v-model="regionvalue" @change="getDistrict" placeholder="行政区">
            <el-option v-for="item in getRegionData" :key="item.dictItemValue" :label="item.dictItemValue" :value="item.dictItemCode">
            </el-option>
          </el-select>
          <el-select clearable v-model="districtvalue" placeholder="板块">
            <el-option v-for="item in districtData" :key="item.dictItemValue" :label="item.dictItemValue" :value="item.dictItemCode">
            </el-option>
          </el-select>

          <!-- <get-dict v-model="selectValue" dict-cat-code="sellinfo" placeholder="李雄"></get-dict> -->
          <el-select clearable v-model="newHouseSearch.loopLineId" placeholder="环线">
            <el-option v-for="item in listloopData" :key="item.id" :label="item.loopLineName" :value="item.id">
            </el-option>
          </el-select>
          <el-select clearable v-model="Propertyvalue" placeholder="物业类型">
            <el-option v-for="item in PropertyType" :key="item.propertyName" :label="item.propertyName" :value="item.id">
            </el-option>
          </el-select>
          <el-select clearable v-model="newHouseSearch.areaValue" v-dict="{name:'areaInterval',data:'area'}" placeholder="面积区间">
            <el-option v-for="item in dictData.area" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemValue">
            </el-option>
          </el-select>
          <el-select clearable v-model="newHouseSearch.priceValue" v-dict="{name:'priceInterval',data:'price'}" placeholder="价格区间">
            <el-option v-for="item in dictData.price" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemValue">
            </el-option>
          </el-select>

          <el-select clearable v-model="newHouseSearch.isLimit" placeholder="是否限购">
            <el-option value="1" label="是"></el-option>
            <el-option value="0" label="否"></el-option>
          </el-select>
          <el-select clearable v-model="newHouseSearch.saleStatusShow" placeholder="销售状态">
            <el-option label="在售" value="在售"></el-option>
            <el-option label="已售" value="已售"></el-option>
            <el-option label="未知" value="未知"></el-option>
          </el-select>
          <el-select clearable v-model="newHouseSearch.isShield" placeholder="上架状态">
            <el-option label="上架" value="0"></el-option>
            <el-option label="已下架" value="1"></el-option>
          </el-select>
          <el-input class="input-apart" v-model="housekeyword" placeholder="请输入小区关键词搜索"></el-input>
          <el-button type="primary" class="query-btn" icon="search" @click="querylist">查询</el-button>
        </div>
        <div class="search-condition-wrap" v-if="searchtype==1">
          <el-select clearable v-model="regionvalue" @change="getDistrict" placeholder="行政区">
            <el-option v-for="item in getRegionData" :key="item.dictItemValue" :label="item.dictItemValue" :value="item.dictItemCode">
            </el-option>
          </el-select>
          <el-select clearable v-model="districtvalue" placeholder="板块">
            <el-option v-for="item in districtData" :key="item.dictItemValue" :label="item.dictItemValue" :value="item.dictItemCode">
            </el-option>
          </el-select>
          <el-select clearable v-model="Propertyvalue" placeholder="物业类型">
            <el-option v-for="item in PropertyType" :key="item.propertyName" :label="item.propertyName" :value="item.shortKey">
            </el-option>
          </el-select>

          <el-select clearable v-model="statusvalue" placeholder="状态">
            <el-option v-for="item in statusData" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
          <el-input class="input-apart" v-model="housekeyword" placeholder="请输入小区关键词搜索"></el-input>
          <el-button type="primary" class="query-btn" icon="search" @click="querylist">查询</el-button>
        </div>
        <div class="search-condition-wrap" v-else-if="searchtype==2">
          <el-row>
            <el-col :span="20">
              <el-select clearable v-model="regionvalue" @change="getDistrict" placeholder="行政区">
                <el-option v-for="item in getRegionData" :key="item.dictItemValue" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
              <el-select clearable v-model="districtvalue" placeholder="板块">
                <el-option v-for="item in districtData" :key="item.dictItemValue" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
              <el-select clearable v-model="origionvalue" placeholder="来源">
                <el-option v-for="item in origionData" :key="item.origionKey" :label="item.origionName" :value="item.origionKey">
                </el-option>
              </el-select>
              <el-select class="status" clearable v-model="statusvalue2" placeholder="状态">
                <el-option v-for="item in statusData2" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
              <el-select clearable v-model="delState" placeholder="是否删除">
                <el-option label="否" value="0"></el-option>
                <el-option label="是" value="1"></el-option>
              </el-select>
              <el-select clearable v-model="PriceRangeval" placeholder="售价区间">
                <el-option v-for="item in PriceRangeData" :key="item.shortKey" :label="item.name" :value="item.shortKey">
                </el-option>
              </el-select>
              <el-select clearable v-model="cmMatched" placeholder="小区名匹配">
                <el-option v-for="item in cmMatchedData" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
              <el-input class="input-apart" v-model="housekeyword" placeholder="请输入小区关键词搜索"></el-input>
              <el-button type="primary" class="query-btn" icon="search" @click="querylist">查询</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="search-condition-wrap" v-else-if="searchtype==3">
          <el-select clearable v-model="regionvalue" @change="getDistrict" placeholder="行政区">
            <el-option v-for="item in getRegionData" :key="item.dictItemValue" :label="item.dictItemValue" :value="item.dictItemCode">
            </el-option>
          </el-select>
          <el-select clearable v-model="districtvalue" placeholder="板块">
            <el-option v-for="item in districtData" :key="item.dictItemValue" :label="item.dictItemValue" :value="item.dictItemCode">
            </el-option>
          </el-select>
          <el-select clearable v-model="origionvalue" placeholder="来源">
            <el-option v-for="item in origionData" :key="item.origionKey" :label="item.origionName" :value="item.origionKey">
            </el-option>
          </el-select>
          <el-select class="status" clearable v-model="statusvalue2" placeholder="状态">
            <el-option v-for="item in statusData3" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
          <el-select clearable v-model="PriceRangeval" placeholder="租价区间">
            <el-option v-for="item in PriceRangeData" :key="item.shortKey" :label="item.name" :value="item.shortKey">
            </el-option>
          </el-select>
          <el-select clearable v-model="cmMatched" placeholder="小区名匹配">
            <el-option v-for="item in cmMatchedData" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
          <el-input class="input-apart" v-model="housekeyword" placeholder="请输入小区关键词搜索"></el-input>
          <el-button type="primary" class="query-btn" icon="search" @click="querylist">查询</el-button>
        </div>
        <!-- <el-row class="lable-wraper">
          <el-col :span="22" class="el-form-item__content">
            <check-tag :rootId='rootId' v-model="tagsId"></check-tag>
          </el-col>
        </el-row> -->

      </el-col>
    </el-row>



  </div>
</template>
<script src="./searchbox"></script>
<style src="./searchbox.scss" lang="scss" scoped></style>
