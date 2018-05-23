<template>
  <div>
    <el-select clearable v-model="value" v-dict="{name:'propertyRightYear',data:'a'}" placeholder="请选择">
      <el-option
        v-for="item in dictData.a"
        :key="item.dictItemCode"
        :label="item.dictItemValue"
        :value="item.dictItemCode">
      </el-option>
    </el-select>
    <el-button @click="fun('123')">change</el-button>
    <el-input v-model="msg"></el-input>
    <div class="box">789</div>

    <cascade-ssx v-model="address"></cascade-ssx>
  </div>
</template>
<script>
import dict from '@/directives/dict.directive'
import { mapGetters, mapActions } from 'vuex'
import { fdcHttp } from 'fdc-common/http'
import cascadeSsx from '@/pages/share/cascade-ssx/cascade-ssx.vue'
export default {
  data: () => ({
    value: '',
    address: {
      areaId: '',
      areaName: '',
      cityId: '',
      cityName: '',
      provinceId: '',
      provinceName: ''
    }
  }),
  directives: {
    dict
  },
  computed: {
    ...mapGetters(['msg'])
  },
  methods: {
    ...mapActions(['fun'])
  },
  components: {
    cascadeSsx
  },
  created() {
    fdcHttp.post(process.env.API_ROOT_HOMEWORK + '/homeworkstation', 'homeworkstation.base.residentialsub.getbyid', {
      id: '5a1cd967c049c4467a3233a4'
    }).then(res => {
      this.address = JSON.parse(res.data.salesDepartmentAddress)
      console.log(this.address, 'aaa')
    })
  }
}
</script>
<style lang='scss' scoped>
$a1: 1px;
$a2: 2px;
$a3: 3;
$a4: 4px;
@function style($n) {
  @return $n*$a1, $n*$a2, #222 * $a3, $n*$a4;
}
@mixin box ($a,$b,$c,$d) {
  border: $a solid #ccc;
  background: $c;
  font-size: $d;
}
.box {
  @include box( style(4)...);
}
</style>
