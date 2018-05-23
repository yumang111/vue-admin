<style lang="scss" scoped>
.labelForm {
  margin-top: 20px;
}
.rules-title{
  font-size:16px;
  color:#333;
}
.add-condition{
  margin:20px auto;
  display: block;
}
</style>

<template>
  <div class="page-container">
    <el-row>
      <el-form :inline="true" :model="labelForm" class="labelForm">
        <el-form-item label="楼盘名：">
          <el-input v-model="labelForm.labelName" placeholder="标签名："></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogVisible = true">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">批量删除</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        ref="multipleTable"
        :data="tableData3"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"

          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="address"
          label="标签名"
          >
        </el-table-column>
        <el-table-column
          prop="name"
          label="规则"
          width="120">
        </el-table-column>
        <el-table-column
          prop="name"
          label="支持用户选择"
          width="120">
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          width="120">
        </el-table-column>
      </el-table>
      <div class="block f-r">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog
        title="新增标签1"
        :visible.sync="dialogVisible"
        size="tiny"
        >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" >
          <el-form-item label="标签名1" prop="name">
            <el-input v-model="ruleForm.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="序号" prop="order" required>
            <el-input-number v-model="ruleForm.order" @change="handleChange" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="用户可选" prop="chose">
            <el-radio-group v-model="ruleForm.chose">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label-width="0px"  v-show="ruleForm.chose==1">
            <div class="rules-title">配置规则</div>
            <el-form-item label="全部" prop="ruleChose">
              <el-radio-group v-model="ruleForm.ruleChose">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label-width="0px">
              <el-button class="add-condition">添加条件</el-button>
            </el-form-item>
            <el-form-item label-width="0px">
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-select v-model="value" placeholder="维度">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="value" placeholder="运算符">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="value" placeholder="分数/数量">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="value" placeholder="关系">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      labelForm: {
        labelName: ''
      },
      ruleForm: {
        name: '',
        order: '',
        chose: '',
        ruleChose: ''
      },
      dialogVisible: false,
      currentPage: 1,
      rules: {
        name: [
          { required: true, message: '请输入标签名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        order: [
          { required: true, trigger: 'blur' }
        ],
        chose: [
          { required: true, trigger: 'blur' }
        ],
        ruleChose: [{
          required: true, trigger: 'blur'
        }]
      },
      tableData3: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    }
  },
  methods: {
    search() {
      console.log(111111)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    handleChange() {
    }
  }
}
</script>

