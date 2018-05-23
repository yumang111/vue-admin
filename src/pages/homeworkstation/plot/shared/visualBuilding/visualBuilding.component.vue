<template>
  <div>
    <div class="houseTagBox">
      <el-row>
        <el-col :md="2" style="width:126px">
          <div class="houseTagTitle">物业类型：</div>
        </el-col>
        <el-col :md="21">
          <ul>
            <li class="tagRadio__item" v-for="(item,index) in colors" :key="index">
              <span class="tagRadio__circle" :class="['color_'+item.shortKey]"></span>
              <span @click="selectOneColor(item)" :class="{active:color===item.color}">{{item.propertyName}}</span>
            </li>
            <li class="tagRadio__item" style='width:150px'>
              <el-select clearable ref="allHouseType" @change='changeAllProType' v-model="allHouseType" placeholder="初始化物业类型">
                <el-option v-for="itemType in colors" :key="itemType.shortKey" :label="itemType.propertyName" :value="itemType.shortKey">
                </el-option>
              </el-select>
            </li>
          </ul>
          <!-- <span @click="selectOneColor(item)" :class="['cursorPointer','el-tag','houseTag','color_'+item.shortKey,{active:color===item.color}]" v-for="(item,index) in colors" :key="index">{{item.propertyName}}</span> -->
        </el-col>
      </el-row>
      <el-row style="marginTop:5px;">
        <el-col :md="2" style="width:126px">
          <div class="houseTagTitle">销售状态：</div>
        </el-col>
        <el-col :md="8">
          <ul>
            <li class="tagRadio__item" v-for="(saleItem,index) in saleStatusList" :key="index">
              <span :class="['sale__tag','sale__tag__'+saleItem.tit]"></span>
              <span @click="changeSale(saleItem)" :class="{active:isSale===saleItem.name}">{{saleItem.name}}</span>
            </li>
            <li class="tagRadio__item" style='width:150px'>
              <el-select clearable ref="allsaleStatus" @change='changeAllsaleStatusList' v-model="allsaleStatus" placeholder="初始化销售状态">
                <el-option v-for="item in saleStatusList" :key="item.name" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </li>
          </ul>
        </el-col>
        <el-col :md="2">
          <div class="houseTagTitle">标空/激活：</div>
        </el-col>
        <el-col :md="2">
          <div class="tagRadio__button">
            <i class="iconfont icon-qingchu"></i>
            <span :class="{active:delHouseStatus ===1}" @click="changeHouseStatus(1)" class="tagRadio__button--title">标空</span>
          </div>
        </el-col>
        <el-col :md="2">
          <div class="tagRadio__button">
            <i class="iconfont icon-jihuo"></i>
            <span :class="{active:delHouseStatus ===2}" @click="changeHouseStatus(2)" class="tagRadio__button--title">激活</span>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin:20px 0 40px 0;">
        <el-col style="marginLeft:126px" :md="2">
          <el-button type="primary" :disabled="houseList.length===0" @click="saveChange">保存修改</el-button>
        </el-col>
        <el-col style='marginLeft:5px;' :md="2">
          <el-button class="gray" type="primary" :disabled="houseList.length===0" @click="clearHouseList">取消操作</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="visualBuilding" v-loading.fullscreen.lock="loading">
      <div class="saveBuildingBox cf">
        <ul class="floorBox">
          <input class="floorList floorList--top" :value="unit.maxFloor" type="text" @keyup.enter="changeMaxFloor">
          <li v-if='unit.maxFloor-index!==0' v-for="(item,index) in numToArray(unit.floor)" :key="index" class="floorList floorList--noborder cursorArrow">
            {{unit.maxFloor-index}}层
          </li>
          <input class="floorList" :value="unit.minFloor" type="text" @keyup.enter="changeMinFloor">
          <template v-if="unit.floor">
            <div class="unitInfoName">房号：</div>
            <div class="unitInfoName">面积：</div>
            <div class="unitInfoName">户型：</div>
            <div class="unitInfoName">电梯：</div>
          </template>
        </ul>
        <div class='unitBox' v-for=" (v,i) in unit.unitList" :key="i">
          <!-- 单元楼显示及增加 -->
          <div class="unitFloorList cursorArrow" v-text="v.unitNum+'单元'"></div>
          <div v-if="v.bind==='0'" class="btn__visible btn__visible--bindUnit" @click="getYFYJUnit(v)">
            <i class="iconfont icon-guanlian"></i>
          </div>
          <div v-if="v.bind==='1'" class="btn__visible btn__visible--bindUnit" @click="unbindUnit(v)">
            <i class="iconfont icon-jiebang"></i>
          </div>
          <div v-if="v.unit" class="btn__visible--bindUnitTitle">{{v.unit}}</div>
          <div v-if="unit.unitList.length-1 === i" class="btn__visible btn__visible--deleteUnit" @click='reduceUnitFloor(v)'>
            <i class="iconfont icon-shanchu"></i>
          </div>
          <!-- 房间格子显示 -->
          <div :style="{left: v.maxRoom?(v.maxRoom * 42 + 10 +'px'):'10px'}" class="btn__visible btn__visible--addRoom" @click='addRoom(v)'>
            <i class="iconfont icon-jia"></i>
          </div>
          <div :style="{left: (v.maxRoom-1) * 42 + 10 +'px'}" v-if="v.unitRoom&&v.unitRoom.length" class="btn__visible btn__visible--deleteRoom"
            @click='reduceRoom(v)'>
            <i class="iconfont icon-shanchu"></i>
          </div>
          <div class="cf">
            <ul class="colBox" v-for="(item,index) in v.unitRoom" :key="index">
              <template v-for="(val,n) in item.colList">
                <template v-if="val !== null">
                  <li @click="changeThisColor(i,index,n,val,v)" :class="['color_'+val.propertySubType,{color__sale:val.saleStatusShow == '在售',color__sold:val.saleStatusShow == '已售',color__unknown:val.saleStatusShow == '未知'}]"
                    class="unitList" :key="n">
                    {{val.residentialInfoUnit?val.residentialInfoUnit:val.roomShow}}
                  </li>
                </template>
                <template v-else>
                  <li :key="n" class="unitList noexsit" @click="changeThisColor(i,index,n,item,v)"></li>
                </template>
              </template>
              <!-- 户型 -->
              <li class="unitColNum cursorArrow">#{{item.colNum}}</li>
              <li class="unitHouseNumList cursorArrow">{{item.colArea}}</li>
              <template v-if="item.colHousingType">
                <li @click="selectHouseType(item,v)" class="btn__visible btn__visible--unbindHouseType">
                  {{item.colHousingType}}
                </li>
              </template>
              <template v-else>
                <li @click="selectHouseType(item,v)" class="btn__visible btn__visible--bindHouseType">
                  <i class="iconfont icon-guanlian"></i>
                </li>
              </template>
            </ul>
            <ul class="colBox" v-if="!v.unitRoom" :style="{height:210+(unit.floor-1)*42+'px'}"></ul>
            <!-- 电梯 -->
            <ul class="cf elevatorStyle">
              <template v-for="(elevatorItem,elevatorIndex) in numToArray(v.elevatorNum)">
                <li :key="elevatorIndex" class="unitHouseNumList cursorArrow">
                  <i class="iconfont icon-dianti"></i>
                </li>
              </template>
              <template>
                <li class="btn__visible btn__visible--addElevator" @click='changeElevator(v,1)'>
                  <i class="iconfont icon-jia"></i>
                </li>
                <li v-if="v.elevatorNum!==0" class="btn__visible btn__visible--addElevator" @click='changeElevator(v,-1)'>
                  <i class="iconfont icon-shanchu"></i>
                </li>
              </template>
            </ul>
          </div>
          <!-- 弹框 v-if 在每次置空时销毁组件 -->
          <el-dialog :before-close='beforeClose' v-if="dialogTableVisible" @close='closeDialog' title='户型' size='tiny' :visible.sync="dialogTableVisible">
            <el-form>
              <el-form-item label="户型" label-width="40px">
                <el-select clearable v-model="currentHousingType" placeholder="请选择">
                  <el-option v-for="item in housingTypeList" :key="item.id" :label="item.housingTypeName+'： '+item.roomTypeName+' - '+item.coveredArea+'㎡'"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogTableVisible = false;houseList = []">取 消</el-button>
              <el-button type="primary" @click="setHouseType">确 定</el-button>
            </span>
          </el-dialog>
          <el-dialog v-if="bindUnitDialog" title='绑定单元' size='tiny' :visible.sync="bindUnitDialog">
            一房一价单元：
            <el-select clearable ref="yfyjUnit" @change='changeyfyjUnitInfo' v-model="yfyjUnit" placeholder="请选择">
              <el-option v-for="item in yfyjUnitList" :key="item.id" :label="item.unit" :value="item.unit" :disabled="item.unitId!==''&&!!item.unitId">
              </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
              <el-button @click="bindUnitDialog = false">取 消</el-button>
              <el-button type="primary" @click="bindUnit">确 定</el-button>
            </div>
          </el-dialog>
        </div>
        <div class="unitBox">
          <div class="btn__visible btn__visible--addUnit" @click='addUnitFloor'>
            <i class="iconfont icon-jia"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src='./visualBuilding.js'></script>
<style src="./visualBuilding.component.scss" lang='scss' scoped></style>
