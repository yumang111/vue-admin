<style src="./supportrafic.scss" lang="scss" scoped></style>
<template>
  <div class="support-trafic-wraper">
    <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" label-width="100px" label-position="left">
      <el-form-item label="商业:"  class="st-item" prop="business">
        <el-input type="textarea" class="st-input" v-model="ruleForm.business" ></el-input>
      </el-form-item>
      <el-form-item label="金融:"  class="st-item" prop="money">
        <el-input type="textarea" class="st-input" v-model="ruleForm.money" ></el-input>
      </el-form-item>
      <el-form-item label="学校:"  class="st-item" prop="school">
        <el-input type="textarea" class="st-input" v-model="ruleForm.school" ></el-input>
      </el-form-item>
      <el-form-item label="医疗:"  class="st-item" prop="hospital">
        <el-input type="textarea" class="st-input" v-model="ruleForm.hospital" ></el-input>
      </el-form-item>
      <el-form-item label="娱乐:"  class="st-item" prop="entertainment">
        <el-input type="textarea" class="st-input" v-model="ruleForm.entertainment" ></el-input>
      </el-form-item>
      <el-form-item label="公园:"  class="st-item" prop="park">
        <el-input type="textarea" class="st-input" v-model="ruleForm.park" ></el-input>
      </el-form-item>
      <el-form-item label="其它:"  class="st-item" prop="other">
        <el-input type="textarea" class="st-input" v-model="ruleForm.other" ></el-input>
      </el-form-item>
      <el-form-item label="环线位置:"  class="st-item" prop="circlelocate">
        <el-input type="textarea" class="st-input" v-model="ruleForm.circlelocate" ></el-input>
      </el-form-item>
      <el-form-item label="片区/商圈:"  class="st-item" prop="district">
        <el-input type="textarea" class="st-input" v-model="ruleForm.district" ></el-input>
      </el-form-item>
      <el-form-item label="轨道交通:"  class="st-item" prop="trafic">
        <el-input type="textarea" class="st-input" v-model="ruleForm.trafic" ></el-input>
      </el-form-item>
      <el-form-item label="公交:"  class="st-item" prop="bus">
        <el-input type="textarea" class="st-input" v-model="ruleForm.bus" ></el-input>
      </el-form-item>
      <el-form-item label="自驾线路:"  class="st-item" prop="driving">
        <el-input type="textarea" class="st-input" v-model="ruleForm.driving" ></el-input>
      </el-form-item>
    </el-form>
  </div>

</template>
<script src="./supportrafic"></script>
