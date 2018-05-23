<style lang="scss" src="@/assets/style/transversetab.scss">


</style>
<style lang="scss" src="./oldhouselist.component.scss" scoped>


</style>
<template>
  <div class="houselist-container">
    <searchbox @reset="reset" searchtype="2"></searchbox>
    <div class="hl-tab">
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">
          <router-link to="/homeworkstation/housemanage/nhlist">新房</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/homeworkstation/housemanage/oldlist">二手房</router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link to="/homeworkstation/housemanage/rentlist">出租</router-link>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="icon-panel">
      <span class="icon-btn-item">
        <i class="iconfont icon-tongguo"></i>通过</span>
      <!-- <span class="icon-btn-item">
        <i class="iconfont icon-zhuanziying"></i>转自营</span> -->
      <span class="icon-btn-item">
        <i class="iconfont icon-guanlian"></i>关联小区</span>
      <span class="icon-btn-item">
        <i class="iconfont icon-shangjia"></i>上架</span>
      <span class="icon-btn-item">
        <i class="iconfont icon-xiajia"></i>下架</span>
      <span class="icon-btn-item">
        <i class="iconfont icon-huifu"></i>恢复有效</span>
      <span class="icon-btn-item">
        <i class="iconfont icon-shanchu"></i>删除</span>
      <span class="icon-btn-item">
        <i class="iconfont icon-heimingdan"></i>删除+黑名单</span>
    </div>
    <el-table v-loading='loading' :data="oldhouseData" @row-click="rowClick" :row-class-name="tableRowClassName" class="small-padding"
      style="width: 100%">
      <el-table-column prop="houseNo" label="房源编号" width="96">
        <template slot-scope="scope">
          <a class="color_blank" target="_blank" v-if="scope.row.publishState=='2'&&scope.row.auditState=='3'" :href="houseLink + scope.row.id + '.htm'">{{scope.row.houseNo}}</a>
          <div v-else>{{scope.row.houseNo}}</div>
        </template>
      </el-table-column>
      <el-table-column label="小区名称">
        <template slot-scope="scope">
          <div :class="{'redfont':scope.row.isRes!=='1'}">{{scope.row.residentialName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="districtDesc" label="行政区" width="84">
      </el-table-column>
      <el-table-column prop="districtSubDesc" label="板块" width="84">
      </el-table-column>
      <el-table-column prop="infoFromTypeDesc" label="来源" width="60">
      </el-table-column>
      <el-table-column label="联系人/手机" width="108">
        <template slot-scope="scope">
          <template v-if="scope.row.agentPhone">
            <div>{{scope.row.agentName}}</div>
            <div>{{scope.row.agentPhone}}</div>
          </template>
          <template v-else>
            <div>{{scope.row.contact}}</div>
            <div>{{scope.row.contactPhone}}</div>
          </template>
        </template>
      </el-table-column>
      <!-- todo 隐藏 -->
      <!-- <el-table-column prop="businessTypeDesc" label="租售属性" width="70">
      </el-table-column> -->
      <el-table-column prop="totalPrice" label="总价万元" width="72">
      </el-table-column>
      <el-table-column label="更新时间" width="108" :render-header="renderHeaderTime">
        <template slot-scope="scope">
          <div style="paddingRight:10px">{{scope.row.updateTime|timeFormat}}</div>
        </template>
      </el-table-column>
      <el-table-column label="日/总PV" width="84">
        <template slot-scope="scope">
          <div>{{scope.row.realTodayPV}}/{{scope.row.realTotalPV}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="84" :render-header="renderHeaderStatus">
        <template slot-scope="scope">
          <template>
            <div v-if="scope.row.publishState=='1'&&scope.row.auditState=='1'">未发布</div>
            <div v-else-if="scope.row.publishState=='2'&&scope.row.auditState=='3'">
              已发布
              <template v-if="scope.row.isAgent=='1'">-自营</template>
            </div>
            <div v-else-if="scope.row.publishState=='1'&&scope.row.auditState=='3'">已下架</div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="是否审核" width="72">
        <template slot-scope="scope">
          <div v-if="scope.row.auditState==='1'">未审核</div>
          <div v-if="scope.row.auditState==='3'">已审核</div>
        </template>
      </el-table-column>
      <el-table-column prop="delState" label="是否删除" width="72">
        <template slot-scope="scope">
          <div v-if="scope.row.delState==='0'">否</div>
          <div v-if="scope.row.delState==='1'">是</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" width="168" label="操作">
        <template slot-scope="scope">
          <!-- <i title="关联" class="icon-btn iconfont icon-guanlian" @click.prevent.stop="linkcmDialog(scope.row.id)"></i> -->
          <template v-if="scope.row.isRes!=='1'">
            <i title="关联" class="icon-btn iconfont icon-guanlian" @click.prevent.stop="linkcmDialog(scope.row.id)"></i>
          </template>
          <template v-if='scope.row.delState==="0"'>
            <template v-if="scope.row.isRes==='1'">
              <template v-if="scope.row.publishState=='1'&&scope.row.auditState=='1'">
                <i title="通过" class="icon-btn icon-btn iconfont icon-tongguo" @click.prevent.stop="housePass(scope.row)"></i>
              </template>
              <template v-else-if="scope.row.publishState=='1'&&scope.row.auditState=='3'">
                <i title="上架" class="icon-btn iconfont icon-shangjia" @click.prevent.stop="upCm(scope.row.id)"></i>
              </template>
              <template v-else-if="scope.row.publishState=='2'&&scope.row.auditState=='3'">
                <!-- <i title="转自营" class="icon-btn iconfont icon-zhuanziying" @click.prevent.stop="toOwn(scope.row)"></i> -->
                <i title="下架" class="icon-btn iconfont icon-xiajia" @click.prevent.stop="deleteBlanklist(scope.row,'house')"></i>
              </template>
            </template>
            <i title="删除" class="icon-btn iconfont icon-shanchu" @click.prevent.stop="deleteBlanklist(scope.row,'oldHouseDelete')"></i>
            <i title="黑名单" class="icon-btn iconfont icon-heimingdan" @click.prevent.stop="deleteBlanklist(scope.row,'oldHouseBlackList')"></i>
          </template>
          <template v-if='scope.row.delState==="1"'>
            <i title="恢复有效" class="icon-btn iconfont icon-huifu" @click.prevent.stop="recover(scope.row)"></i>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-wraper">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curpage" :page-sizes="[10, 20, 30, 100]"
        :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalDataNum">
      </el-pagination>
    </div>
    <linkcm ref="linkhouse" @reset='reset' houseType="1"></linkcm>
    <housebaseinfo houseinfoType='1' @reset='reset' :houseId="checkedHouseId"></housebaseinfo>
    <deletedialog :multipleSelection="multipleSelection" :type='type' @reset="reset" ref="deletedialog"></deletedialog>
    <el-dialog class="dialog-wraper-own dialog-wraper-center" title="转自主经营" :visible.sync="ownDialogshow" @close="clearOwnData">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="130px" class="demo-ruleForm">
        <el-form-item label="请选择联系人" required prop="contactPeople">
          <el-select clearable v-model="ruleForm.contactPeople" @change="changeOwncontact" placeholder="请选择联系人">
            <el-option v-for="item in contactPeopleData" :key="item.empId" :label="item.userName" :value="item.empId+'/val/'+item.phoneNumber+'/val/'+item.userName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <div>{{contactPhone}}</div>
        </el-form-item>
        <el-form-item label="处理人">
          <div>administrator</div>
        </el-form-item>
        <el-form-item label="处理时间">
          <div v-if="dealTime">{{dealTime|timeFormat}}</div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer linkdata-footer">
        <el-button @click="ownDialogshow = false">取 消</el-button>
        <el-button type="primary" @click="transferOwn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script src="./oldhouselist.component"></script>
