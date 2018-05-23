<template>
  <div class="installment-wrap">
    <el-radio-group class="tab__box" size='large' v-model="installmentId" @change='checkThisInstallment'>
      <el-radio-button :label="item.id" class="tab__item" :class="{active:item.id === installmentId}" :id='item.id' v-for="(item,index) in installmentList"
        :key="index">{{item.residentialSubName+'('+item.serialNumber+')'}}</el-radio-button>
      <el-button class="tab__add" size="large" @click="addInstallment" type="text">新增分期</el-button>
    </el-radio-group>
    <div v-if="installmentList.length">
      <el-form v-loading.fullscreen.lock="loading" label-position="left" :model="ruleForm" :rules="ruleFormRules" ref="ruleForm"
        label-width="126px" class="demo-ruleForm">
        <el-row>
          <el-col :md="8">
            <el-form-item required label="分期名：" prop="residentialSubName">
              <el-input v-model="ruleForm.residentialSubName"></el-input>
            </el-form-item>
          </el-col>
          <div class="f-r">
            <el-button @click="submitRuleForm('ruleForm')" type="primary">保存修改</el-button>
          </div>
        </el-row>
        <el-row>
          <el-col>
            <el-row>
              <el-form-item label="售楼部地址：" prop="salesDepartmentAddress" size='mini'>
                <el-col :md="3">
                  <el-select clearable ref='provinceInfo' @change="changeProvince" v-model="ruleForm.salesDepartmentAddress.provinceId" placeholder="省">
                    <el-option v-for="item in provinceList" :key="item.provinceid" :label="item.province" :value="item.provinceid">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col style='marginLeft:10px' :md="3">
                  <el-select clearable ref='cityInfo' @change="changeCity" v-model="ruleForm.salesDepartmentAddress.cityId" placeholder="市">
                    <template v-if='cityList.length != 0'>
                      <el-option v-for="item in cityList" :key="item.cityid" :label="item.city" :value="item.cityid">
                      </el-option>
                    </template>
                  </el-select>
                </el-col>
                <el-col style='marginLeft:10px' :md="3">
                  <el-select clearable ref='areaInfo' v-model="ruleForm.salesDepartmentAddress.areaId" placeholder="县">
                    <el-option v-for="item in countyList" :key="item.areaid" :label="item.area" :value="item.areaid">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col style='marginLeft:10px' :md="8">
                  <el-input v-model="ruleForm.salesDepartmentAddress.streetDetail" placeholder="请输入街道地址"></el-input>
                </el-col>
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item required label="销售状态：" prop="saleStatus">
              <el-select style="width: 158px;" clearable v-model="ruleForm.saleStatus" v-dict="{name:'sellinfo',data:'sellinfo'}" placeholder="请选择">
                <el-option v-for="item in dictData.sellinfo" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="建筑年份：" prop="buildingAge">
              <div class="block">
                <el-date-picker :picker-options="pickerOptions" style='width:158px' v-model="ruleForm.buildingAge" align="right"
                  type="year" placeholder="选择年">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="开发商：" prop="companyPropertyDeveloper">
              <think-search :domain='"homebaseaction"' :searchMethod='"homebaseaction.base.developer.limitpage"' :modelStr='"developerName"'
                v-model="ruleForm.companyPropertyDeveloper"></think-search>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="投资商：" prop="companyInvestor">
              <think-search :domain='"homeworkstation"' :companyType='2' :modelStr='"companyName"' :searchMethod='"homeworkstation.base.othercompanyinfo.limitpage"'
                v-model="ruleForm.companyInvestor"></think-search>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="代理商：" prop="companyAgency">
              <think-search :domain='"homeworkstation"' :companyType='1' :modelStr='"companyName"' :searchMethod='"homeworkstation.base.othercompanyinfo.limitpage"'
                v-model="ruleForm.companyAgency"></think-search>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="施工单位：" prop="constructionCompanies">
              <think-search :domain='"homeworkstation"' :companyType='4' :modelStr='"companyName"' :searchMethod='"homeworkstation.base.othercompanyinfo.limitpage"'
                v-model="ruleForm.constructionCompanies"></think-search>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="景观设计：" prop="companyLandscape">
              <think-search :domain='"homeworkstation"' :companyType='3' :modelStr='"companyName"' :searchMethod='"homeworkstation.base.othercompanyinfo.limitpage"'
                v-model="ruleForm.companyLandscape"></think-search>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="建筑设计：" prop="companyArchitecturalDesign">
              <think-search :domain='"homeworkstation"' :companyType='5' :modelStr='"companyName"' :searchMethod='"homeworkstation.base.othercompanyinfo.limitpage"'
                v-model="ruleForm.companyArchitecturalDesign"></think-search>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="施工许可证：" prop="builderLicense">
              <el-input v-model="ruleForm.builderLicense"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="建设用地许可证：" prop="landUsePermit">
              <el-input v-model="ruleForm.landUsePermit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="国土使用证：" prop="landUseCertificate">
              <el-input v-model="ruleForm.landUseCertificate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="工程规划许可证：" prop="constructionPlanningPermit">
              <el-input v-model="ruleForm.constructionPlanningPermit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="22">
            <el-form-item label="标签：" prop="tagsId">
              <check-tag :rootId='1' v-model="ruleForm.tagsId"></check-tag>
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

        <template v-for="(item, index) in ruleForm.tellingYou">
          <el-row :key="index">
            <el-form-item class="tellyou" :label="index?'':'我想告诉你：'" :prop="'tellingYou.' + index + '.title'" :rules="{ max: 20, message: '必须在20字以内', trigger: 'change&blur' }">
              <el-input class="tellyou__tit" v-model="item.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item class="tellyou" label-width="20px" :prop="'tellingYou.' + index + '.description'" :rules="{ max: 50, message: '必须在50字以内', trigger: 'change&blur' }">
              <el-input class="tellyou__desc" v-model="item.description" placeholder="描述"></el-input>
            </el-form-item>
            <template v-if='index===0'>
              <el-button class="tellyou__btn" @click.prevent="tellyou('add')">新增</el-button>
            </template>
            <template v-if='index===ruleForm.tellingYou.length-1&&index!==0'>
              <el-button class="tellyou__btn" @click.prevent="tellyou('delete')">删除</el-button>
            </template>
          </el-row>
        </template>
      </el-form>
    </div>

    <template v-if='ruleForm.id'>
      <h2 class="header--titleH2">物业类型信息维护</h2>
      <el-row class="installment__proTyped">
        <el-col :md="4">已维护过的物业类型：</el-col>
        <el-col :md="20">
          <div class="installment__proItem" v-for="housingType in maintenancedList" :key="housingType.propertyParent">{{housingType.propertyParentName}}-{{housingType.propertyTypeName}}</div>
        </el-col>
      </el-row>
      <el-form label-position="left" :model="ruleForm2" :rules="ruleForm2Rules" ref="ruleForm2" label-width="126px" class="demo-ruleForm2">
        <el-row>
          <el-col :md="8">
            <el-form-item required label="物业类型：" prop="propertyParent">
              <el-cascader @change='getPropertyType' v-model="propertyTypeArr" @active-item-change="handleTypeChange" placeholder="请选择物业类型"
                :options="options"></el-cascader>
            </el-form-item>
          </el-col>
          <div class="f-r">
            <el-button @click="submitRuleForm2('ruleForm2')" type="primary">保存修改</el-button>
          </div>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item required label="用地性质：" prop="natureOfLandId">
              <el-select ref="natureOfLandId" clearable v-model="ruleForm2.natureOfLandId" v-dict="{name:'landNature',data:'landNature'}" placeholder="请选择">
                <el-option v-for="item in dictData.landNature" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item required label="产权：" prop="propertyRightsLimitsYear">
              <el-radio-group v-model="ruleForm2.propertyRightsLimitsYear">
                <el-radio v-for="item in propertyRightYearList" :key="item.dictItemCode" class="radio"
                  :label="item.dictItemCode">{{item.dictItemValue}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="销售电话1：" prop="salePhone1">
              <el-input placeholder="请输入销售电话" v-model="ruleForm2.salePhone1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="销售电话2：" prop="salePhone2">
              <el-input placeholder="请输入销售电话" v-model="ruleForm2.salePhone2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="400电话：" prop="phone400">
              <el-input :disabled="true" placeholder="400电话" v-model="ruleForm2.phone400"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="QQ号：" prop="qq">
              <el-input placeholder="请输入QQ号" v-model="ruleForm2.qq"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item :label="index === 0?'对口学校：':''" v-for="(school,index) in ruleForm2.counterpartSchoolsName"
              :key="index" :prop="'counterpartSchoolsName.' + index" :rules="{
              validator: valid, message: '必须匹配系统中含有的', trigger: 'change&blur'
            }">
              <think-search :domain='"homebaseaction"' :searchMethod='"homebaseaction.base.school.getschoolByparam"' :modelStr='"schoolName"'
                v-model="ruleForm2.counterpartSchoolsName[index]"></think-search>
            </el-form-item>
          </el-col>
          <el-col :md="2">
            <el-button class="tellyou__btn" @click="addSchoolName">新增学校</el-button>
          </el-col>
          <el-col :span='8' :offset="2">
            <el-form-item label="首付比例：" prop="downPaymentRatio">
              <el-input placeholder="整数" v-model="ruleForm2.downPaymentRatio">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="占地面积：" prop="usedLandArea">
              <el-input placeholder="整数" v-model="ruleForm2.usedLandArea">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="建筑面积：" prop="constructionArea">
              <el-input placeholder="整数" v-model="ruleForm2.constructionArea">
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="容积率：" prop="plotRatio">
              <el-input placeholder="两位小数" v-model="ruleForm2.plotRatio">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="绿化率：" prop="greenRates">
              <el-input placeholder="两位小数" v-model="ruleForm2.greenRates">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="车位数：" prop="parkingNumber">
              <el-input placeholder="整数" v-model="ruleForm2.parkingNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="车位配比：" prop="parkingSpaceThan">
              <el-input placeholder="两位小数" v-model="ruleForm2.parkingSpaceThan">
                <template slot="prepend">1：</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="物业公司：" prop="landedPropertyCompany">
              <think-search :domain='"homebaseaction"' :searchMethod='"homebaseaction.base.propertycompany.limitpage"' :modelStr='"propertyCompanyName"'
                v-model="ruleForm2.landedPropertyCompany"></think-search>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="物业费：" prop="landedPropertyFee">
              <el-input placeholder="两位小数" v-model="ruleForm2.landedPropertyFee">
                <template slot="append">元/平/月</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="装修情况：" prop="redecoratedInfoId">
              <el-select ref='redecoratedInfoId' clearable v-model="ruleForm2.redecoratedInfoId" v-dict="{name:'houseDecoration',data:'houseDecoration'}" placeholder="请选择">
                <el-option :disabled="!(item.dictItemCode==='p301'||item.dictItemCode==='p305')" v-for="item in dictData.houseDecoration" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="装修标准：" prop="decorationStandard">
              <el-input placeholder="整数" v-model="ruleForm2.decorationStandard">
                <template slot="append">元/㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="房源总套数：" prop="housingResourcesCounts">
              <el-input placeholder="整数" v-model="ruleForm2.housingResourcesCounts"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="交房标准：" prop="junctionRoomStandard">
              <el-select ref="junctionRoomStandard" clearable v-model="ruleForm2.junctionRoomStandard" v-dict="{name:'houseDecoration',data:'decorationIns'}" placeholder="请选择">
                <el-option :disabled="!(item.dictItemCode==='p301'||item.dictItemCode==='p305')" v-for="item in dictData.houseDecoration" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="供水类型：" prop="waterType">
              <el-select ref="waterType" clearable v-model="ruleForm2.waterType" v-dict="{name:'waterType',data:'waterType'}" placeholder="请选择">
                <el-option v-for="item in dictData.waterType" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="供电类型：" prop="powerType">
              <el-select ref="powerType" clearable v-model="ruleForm2.powerType" v-dict="{name:'powerType',data:'powerType'}" placeholder="请选择">
                <el-option v-for="item in dictData.powerType" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <el-form-item label="供气类型：" prop="gasType">
              <el-select ref="gasType" clearable v-model="ruleForm2.gasType">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :offset='4' :md="8">
            <el-form-item label="供暖类型：" prop="heatingType">
              <el-select ref="heatingType" clearable v-model="ruleForm2.heatingType">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-show="propertyTypeArr[0] ==='w402'&&ruleForm2.id">
        <shops :subInfoId='installmentId' :propertyTypeArr='propertyTypeArr'></shops>
      </div>
    </template>
  </div>
</template>
<script src='./installment.js'></script>
<style src="./installment.component.scss" lang='scss'></style>
