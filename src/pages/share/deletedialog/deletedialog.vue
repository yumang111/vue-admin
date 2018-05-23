<template>
  <el-dialog size="tiny" class="dialog-wraper-delete dialog-wraper-center" :title="'房源'+status" :visible.sync="deleteDialogshow" @close="cleardeleteData">
    <el-form :model="ruleFormDelete" :rules="rules" ref="rulesDeletes" label-position="left" label-width="130px">
      <el-form-item :label="'房源'+status+'原因'" required prop="reason">
        <el-select ref="reason" clearable v-model="ruleFormDelete.reason" v-dict="{name:'hsDelReason',data:'hsDelReason'}" :placeholder="'请选择'+status+'原因'">
          <el-option v-for="item in dictData.hsDelReason" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item required v-if="ruleFormDelete.reason ==='8'" prop="processOtherReason" label="其他原因" :rules="{
        required:true,message:'其他原因不能为空',trigger:'blur'
      }">
        <el-input type="textarea" :rows="2" placeholder="请输入其他原因" v-model="ruleFormDelete.processOtherReason">
        </el-input>
      </el-form-item>
      <!-- <el-form-item label="处理时间">
        <div v-if="dealTime">{{dealTime|timeFormat}}</div>
      </el-form-item> -->
      <div v-if="type==='oldHouseBlackList'||type==='rentHouseBlackList'">
        <el-form-item required label="理由" prop="reasonType" :rules="{required:true,message:'理由不能为空',trigger:'blur' }">
          <el-select ref="reasonType" clearable v-model="ruleFormDelete.reasonType" placeholder="请选择加入黑名单理由">
            <el-option v-for="item in blackListReason" :key="item.dictItemCode" :label="item.dictItemValue" :value="item.dictItemCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细说明">
          <el-input type="textarea" v-model="ruleFormDelete.details"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="处理人">{{ruleFormDelete.processBy}}</el-form-item>
      <el-form-item>
        <el-button @click="deleteDialogshow = false">取 消</el-button>
        <el-button type="primary" @click="deleteConfirm('rulesDeletes')">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script src='./deletedialog.js'>


</script>
