<template>
  <div class="housebase-wraper" v-if="houseId">
    <h1 class="header--titleH2" v-text="'房源编号(编号'+houseInfoData.houseNo+')'"></h1>
    <div class="housebase-container">
      <h2 class="header--titleH2">关联小区
        <span class='subtitle'>(当前信息不可修改。如果信息不符，请前往小区进行修改维护)</span>
      </h2>
      <el-form label-position="left" :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="小区名称" required>
          <el-input disabled v-model="houseInfoData.residentialName" class="wid250"></el-input>
        </el-form-item>
        <el-form-item label="小区地址" required>
          <el-select clearable v-model="cmbaseinfo.cmprovice" class="wid100 marg15px" disabled placeholder="请选择">
          </el-select>
          <el-select clearable v-model="cmbaseinfo.cmcity" class="wid100 marg15px" disabled placeholder="请选择">
          </el-select>
          <el-select clearable v-model="cmbaseinfo.districtDesc" class="wid150 marg15px" disabled placeholder="请选择">
          </el-select>
          <el-input disabled v-model="cmbaseinfo.houseAddress" class="wid250"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商圈:" class="tradeArea-item">
              <el-select clearable class="padrg15 block" disabled v-model="cmbaseinfo.cmbusiness" placeholder="请选择">
              </el-select>
              <el-select clearable class="padrg15 block" disabled v-model="cmbaseinfo.cmbusinessSub" placeholder="请选择">
              </el-select>
            </el-form-item>
            <el-form-item label="居住新区:" class="tradeArea-item" required>
              <el-select clearable class="padrg15 block" disabled v-model="cmbaseinfo.cmnewapartment" placeholder="请选择">
                <!--<el-option
                  v-for="item in newAreaData"
                  :key="item.shortKey"
                  :label="item.districtName"
                  :value="item.shortKey+'/val/'+item.districtName">
                </el-option>-->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="板块:" class="tradeArea-item" required>
              <el-select clearable class="padrg15 block" disabled v-model="cmbaseinfo.districtSubDesc" placeholder="请选择">
              </el-select>
            </el-form-item>
            <el-form-item label="环线" class="tradeArea-item">
              <el-select clearable class="padrg15 block" disabled v-model="cmbaseinfo.loopLineId" placeholder="请选择">
                <el-option v-for="item in listloopData" :key="item.id" :label="item.loopLineName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="link-building">
      <h2 class="header--titleH2">
        关联楼栋
        <div class="f-r">
          <el-button type="primary" :disabled="!this.ruleForm.roomNum" @click="saveChangeBuild">保存修改</el-button>
        </div>
      </h2>
      <el-form class="link-building-container" label-position="left" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分期">
              <el-select clearable v-model="ruleForm.periodval" @change="changeBuild" placeholder="请选择">
                <el-option v-for="item in periodData" :key="item.id" :label="item.residentialSubName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="楼栋">
              <el-select clearable v-model="ruleForm.buildingval" @change="changeCell" placeholder="请选择">
                <el-option v-for="item in buildingData" :key="item.id" :label="item.bulidingNum" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单元">
              <el-select clearable v-model="ruleForm.cellval" @change="changHomenum" placeholder="请选择">
                <el-option v-for="item in cellData" :key="item.id" :label="item.unitNum" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房号">
              <el-select clearable v-model="ruleForm.roomNum" placeholder="请选择">
                <el-option v-for="item in roomNumData" :key="item.id" :label="item.roomShow?(item.roomShow+'0'+item.floor):''" :value="item.roomShow+'/val/'+item.floor + '//' + item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <div class="housebase-container">
      <h2 class="header--titleH2">
        房源信息
        <div class="f-r">
          <el-button type="primary" @click="submit">保存修改</el-button>
        </div>
        <div class="f-r" style="marginRight:20px;">
          <el-button type="primary" :disabled="!(this.houseInfoData.roomNum||this.houseInfoData.roomNumber)" @click="useAssociate">使用关联数据</el-button>
        </div>
      </h2>
      <el-dialog size="tiny" title="房东信息" :visible.sync="landlordDialog">
        <el-form label-width="60px" :model="ruleForm">
          <el-form-item label="联系人">
            <el-input disabled v-model="ruleForm.contactName"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input disabled v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="座机号">
            <el-input disabled v-model="ruleForm.fixedPhone"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="6">
            <el-form-item v-if="ruleForm.agentName" label="联系人" required prop="agentName">
              <el-input disabled v-model="ruleForm.agentName"></el-input>
              <el-button class="tab__add" type="text" @click="landlordDialog=true">查看房东联系方式</el-button>
            </el-form-item>
            <el-form-item v-if="!ruleForm.agentName" label="联系人" required prop="contactName">
              <el-input v-model="ruleForm.contactName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="6" :span="6">
            <el-form-item label="座机号" prop="fixedPhone">
              <el-input v-model="ruleForm.fixedPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item v-if="ruleForm.agentPhone" label="手机号" required prop="agentPhone">
              <el-input v-model="ruleForm.agentPhone"></el-input>
            </el-form-item>
            <el-form-item v-if="!ruleForm.agentPhone" label="手机号" required prop="phone">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-button class="tab__add" type="text" @click="getPublishList">此手机号曾发布{{publishedNum}}条房源</el-button>
          <a class="el-button tab__add el-button--text" :href="'https://www.baidu.com/baidu?word='+ruleForm.phone" target="_blank">百度此号码</a>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="房源标题" required prop="houseTitle">
              <el-input v-model="ruleForm.houseTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="6" v-if="houseinfoType==1">
            <el-form-item required label="总价" prop="totlePrice">
              <el-input v-model="ruleForm.totlePrice">
                <template slot="append">万元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="6" v-else>
            <el-form-item class="opacity0">
              <el-input v-model="ruleForm.acreage"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-form-item label="房源图片">
          <ul class="img-wraper" ref="previewImg">
            <li class="img-item" v-for="(item, index) in imgInfoArr" :key="index">
              <img class="preview-img" :src="item.src" height="100" @click="$preview.open(index, imgInfoArr)">
              <span class="coverFlag" v-if="item.isCover=='1'">封面</span>
              <i class="img-btn icon-btn iconfont icon-tongguo" v-if="item.isCover!='1'" @click="setCoverImg(item.id)"></i>
              <i class="img-btn--delete icon-btn iconfont icon-shanchu" @click="deleteDialog(item.id) "></i>
            </li>
            <el-button v-if="imgInfoArr.length<24" class="upload-img" type="primary" @click="showUploadDialog">上传
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </ul>
        </el-form-item>
        <template>
          <el-row>
            <el-col :span='6'>
              <el-form-item label="物业类型">
                <el-select clearable v-model="ruleForm.propertyval" @change="changeProperty" placeholder="请选择">
                  <el-option v-for="item in propertyData" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='6' :offset="6">
              <el-form-item label="二级物业">
                <el-select clearable v-model="ruleForm.propertySubval" placeholder="请选择">
                  <el-option v-for="item in propertySubData" :key="item.shortKey" :label="item.propertyName" :value="item.shortKey">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="rentType==2">
            <el-col :span='6'>
              <el-form-item label="出租间" required>
                <el-select clearable v-model="ruleForm.rentRoomType" placeholder="请选择">
                  <el-option v-for="item in rentRoomTypeData" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode+'/val/'+item.dictItemValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='6' :offset="6">
              <el-form-item required label="出租间面积" prop="acreage">
                <el-input v-model="ruleForm.acreage">
                  <template slot="append">㎡</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="houseinfoType==2">
            <el-col :span='6'>
              <el-form-item label="租金" required prop="rentPrice">
                <el-input v-model="ruleForm.rentPrice">
                  <template slot="append">元/月</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span='6' :offset="6">
              <el-form-item label="付款方式" required prop="rentPayType">
                <el-select clearable v-model="ruleForm.rentPayType" placeholder="选择">
                  <el-option v-for="item in rentPayTypeData" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode+'/val/'+item.dictItemValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='6'>
              <el-form-item label="装修情况" required>
                <el-select clearable v-model="ruleForm.decorationval" placeholder="请选择">
                  <el-option v-for="item in decorationData" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode+'/val/'+item.dictItemValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='6' :offset="6">
              <el-form-item v-if="houseinfoType==1" label="产权情况">
                <el-select clearable v-model="ruleForm.propertyRight" placeholder="选择">
                  <el-option v-for="item in propertyRightData" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode+'/val/'+item.dictItemValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="houseinfoType==2&&rentType==2" label="租客要求">
                <el-select clearable v-model="ruleForm.rentSex" placeholder="选择">
                  <el-option v-for="item in rentSexData" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode+'/val/'+item.dictItemValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="houseinfoType==2&&rentType==3" label="公寓代理商" prop="apartmentAgent">
                <el-input v-model="ruleForm.apartmentAgent" class="wid150"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="houseinfoType==1">
            <el-col :span='8'>
              <el-form-item label="产权年限" prop="propertyRightYearval">
                <el-radio-group v-model="ruleForm.propertyRightYearval">
                  <el-radio :label="item.dictItemCode+'/val/'+item.dictItemValue" :key="item.dictItemCode" v-for="item in propertyRightYearData">{{item.dictItemValue}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span='6' :offset="4">
              <el-form-item label="产权登记年份" prop="prSignDate">
                <div class="block">
                  <el-date-picker :editable='false' :picker-options="pickerOptions" v-model="ruleForm.prSignDate" type="year" placeholder="选择年">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="houseinfoType==2&&rentType==3" label="代理商服务">
            <el-checkbox-group v-model="ruleForm.ptfw">
              <el-checkbox v-for="item in ptfwData" :label="item.id+'/val/'+item.dictItemValue" :key="item.id">{{item.dictItemValue}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-row>
            <el-col :span='6'>
              <el-form-item label="朝向" prop="houseOrientationval">
                <el-select clearable v-model="ruleForm.houseOrientationval" placeholder="选择朝向">
                  <el-option v-for="item in houseOrientationData" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode+'/val/'+item.dictItemValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='6' :offset="6">
              <el-form-item v-if="rentType!=2" label="建筑面积" required prop="acreage">
                <el-input v-model="ruleForm.acreage">
                  <template slot="append">㎡</template>
                </el-input>
              </el-form-item>
              <el-form-item v-if="rentType==2" label="建筑面积" prop="buildingArea">
                <el-input v-model="ruleForm.buildingArea">
                  <template slot="append">㎡</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='12'>
              <el-form-item required label="房型" prop="houseOrientationval">
                <el-form-item required class="f-l housetype-item" prop="roomnum">
                  <el-input v-model="ruleForm.roomnum"></el-input>
                  <span class="f-r">室</span>
                </el-form-item>
                <el-form-item required class="f-l housetype-item" prop="hallnum">
                  <el-input v-model="ruleForm.hallnum"></el-input>
                  <span class="f-r">厅</span>
                </el-form-item>
                <el-form-item required class="f-l housetype-item" prop="toiletnum">
                  <el-input v-model="ruleForm.toiletnum"></el-input>
                  <span class="f-r">卫</span>
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-row>
                <el-form-item class="floorFormItem" label="楼层" prop="currentFloorNum">
                  <el-input v-model="ruleForm.currentFloorNum" class="wid150"></el-input>
                </el-form-item>
                <span class="floorFormItem">层/共</span>
                <el-form-item class="floorFormItem" ref="totalFloorNum" label-width='0px' prop="totalFloorNum">
                  <el-input v-model="ruleForm.totalFloorNum" class="wid150"></el-input>
                </el-form-item>
              </el-row>
              <!-- <el-form-item class="floor-item" label="楼层" required prop="floornum">
                <el-input v-model="ruleForm.currentFloorNum" class="wid150"></el-input>层/共
                <el-input v-model="ruleForm.totalFloorNum" class="wid150"></el-input>
              </el-form-item> -->
            </el-col>
          </el-row>
        </template>
        <el-form-item label="是否电梯房">
          <el-radio-group v-model="ruleForm.elevator">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配套">
          <el-checkbox-group v-model="ruleForm.housebaseservice">
            <el-checkbox v-for="item in housebaseserviceData" :label="item.id" :key="item.id">{{item.labelName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="房源描述">
          <div contenteditable="true" class="editable-text" v-html="ruleForm.textarea">
          </div>
        </el-form-item>
        <el-form-item label="房源标签：" v-if="houseinfoType === '1'">
          <el-checkbox-group :max="3" v-model="ruleForm.houseTag">
            <el-checkbox v-for="item in houseTagData" :label="item.id" :key="item.id">{{item.labelName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="运营标签：">
          <el-radio-group v-model="ruleForm.yytagval">
            <el-radio :label="item.id" :key="item.id" v-for="item in yyTagData">{{item.labelName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="特色标签：" v-if="houseinfoType === '2'">
          <el-checkbox-group :max="3" v-model="ruleForm.featureTag">
            <el-checkbox v-for="item in featureTagData" :label="item.id" :key="item.id">{{item.labelName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>

    <div v-show="showDeleteLog">
      <delete-log v-model="houseInfoData.id"></delete-log>
    </div>

    <pic-upload @reset='reset' :houseId="houseId" ref="picUpload"></pic-upload>
    <el-dialog title="关联房源列表" size="large" class="dialog-wraper-center" :visible.sync="linkHouseDialog">
      <div class="operate-house">
        <span>{{ruleForm.phone}}曾发布的房源</span>
        <el-button type="primary" @click="deletebtn" class="f-r martop25">批量下架</el-button>
      </div>
      <el-table ref="multipleTable" :data="publishedList" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="70">
        </el-table-column>
        <el-table-column label="房源编号" prop="houseNo">

        </el-table-column>
        <el-table-column prop="businessTypeDesc" label="业务类型">
        </el-table-column>
        <el-table-column prop="auditStateDesc" label="审核状态">
        </el-table-column>
        <el-table-column label="联系人">
          <template slot-scope="scope">{{ scope.row.contact }}({{scope.row.infoFromTypeDesc}})</template>
        </el-table-column>
        <el-table-column prop="residentialName" label="小区名称" width="200">
        </el-table-column>
        <el-table-column prop="acreageMax" label="面积">
        </el-table-column>
        <el-table-column label="价格" prop="totalPriceMax">

        </el-table-column>
        <el-table-column prop="recordTime" label="最后发布时间" width="100">
          <template slot-scope="scope">{{ scope.row.recordTime|timeFormat }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="180">
          <template slot-scope="scope">
            <template v-if="scope.row.delState==='1'">
              <i class="icon-btn iconfont icon-huifu" title="恢复" @click="changeDeleteState(scope.row)"></i>
            </template>
            <template v-else>
              <i class="icon-btn iconfont icon-shanchu" title="删除" @click="singleDelete(scope.row)"></i>
              <i class="icon-btn iconfont icon-chongxinfabu" title="重新发布" @click="republic(scope.row)"></i>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listCurpage" :page-sizes="[5, 10, 20]"
        class="martop25" :page-size="listPagesize" layout="total, sizes, prev, pager, next, jumper" :total="listPageTotalnum">
      </el-pagination>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="imgDeleteDialog" size="tiny">
      <span>是否确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imgDeleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteImg">确 定</el-button>
      </span>
    </el-dialog>
    <deletedialog :multipleSelection="multipleSelection" :type="'deleteHouse'" @reset="reset" ref="deletedialog"></deletedialog>
  </div>
</template>
<script src="./housebaseinfo.js"></script>
<style lang="scss" src="./housebaseinfo.scss"></style>
