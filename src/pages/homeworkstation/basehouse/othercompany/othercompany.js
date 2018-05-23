import mixins from '@/mixins/mixins'
import { sendOtherCompany, thinkOtherCompany, searchOtherCompany, updateOtherCompany } from './othercompany.api'
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogTitle: '添加公司',
      form: {
        companyType: '',
        companyName: '',
        url: '',
        descInfo: '',
        disabled: 1
      },
      rules: {
        companyType: [
          { required: true, message: '请选择公司类型', trigger: 'change&blur' }
        ],
        companyName: [
          { required: true, message: '请输入公司名称', trigger: 'change&blur' },
          { max: 50, message: '公司名不得超过50字', trigger: 'change&blur' }
        ],
        url: [
          { max: 200, message: '链接不得超过50字', trigger: 'change&blur' }
        ],
        descInfo: [
          { max: 400, message: '描述不得超过400字', trigger: 'change&blur' }
        ]
      },
      formLabelWidth: '100px',
      companyType: '',
      companyName: '',
      props: {
        value: 'companyName',
        label: 'companyName'
      },
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      isAdd: true,
      useOrderType: ''
    }
  },
  mixins: [mixins],
  methods: {
    sort(row) {
      // 使用次数排序
      if (row.labelClassName === 'sortable__companyUse') {
        console.log('123')
        this.useOrderType = '1-desc'
        this.getTableData()
      } else if (row.labelClassName === 'sortable__companyClick') { // 被用户点击次数排序
        this.useOrderType = '2-desc'
        this.getTableData()
      }
    },
    addCompany() {
      this.form = {
        companyType: '',
        companyName: '',
        url: '',
        descInfo: '',
        disabled: 1
      }
      this.dialogTitle = '添加公司'
      this.dialogFormVisible = true
      this.isAdd = true
    },
    getTableData() {
      let params = {
        companyName: this.companyName,
        companyType: this.companyType,
        curpage: this.currentPage,
        pages: this.currentPage,
        pagesize: this.pageSize,
        orderType: this.useOrderType
      }
      searchOtherCompany(params).then(res => {
        if (res.data) {
          if (this.useOrderType) {
            this.showInfoMsg('success', '更新排序成功！')
          }
          console.log(res.data)
          this.tableData = res.data
          this.tableData.forEach(v => {
            switch (v.companyType) {
              case '1':
                v.companyTypeName = '代理商'
                break
              case '2':
                v.companyTypeName = '投资商'
                break
              case '3':
                v.companyTypeName = '景观设计'
                break
              case '4':
                v.companyTypeName = '施工单位'
                break
              case '5':
                v.companyTypeName = '建筑设计'
                break
              case '6':
                v.companyTypeName = '品牌公寓代理商'
                break
            }
          })
          this.totalCount = res.totalDatas
        }
      })
    },
    // 处理每页显示条数
    handleSizeChange(size) {
      this.pageSize = size
      this.getTableData()
    },
    // 更改当前页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getTableData()
    },
    // 搜索公司信息
    searchCompany() {
      this.currentPage = 1
      this.useOrderType = ''
      this.getTableData()
    },
    // 公司联想
    querySearchAsync(queryString, cb) {
      if (!queryString) {
        return false
      }
      let params = {
        companyName: queryString,
        pages: 1,
        curpage: 1,
        pagesize: 20
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        thinkOtherCompany(params).then(res => {
          if (res) {
            var restaurants = res.data
            var results = restaurants.filter(function (v) {
              return v.companyName.includes(queryString)
            })
            cb(results)
          }
        })
      }, 1000 * Math.random())
    },
    // 编辑公司信息
    editCompany(companyInfo) {
      console.log(companyInfo)
      this.dialogFormVisible = true
      this.dialogTitle = '修改公司'
      this.form = { ...companyInfo }
      // this.tableRowData = companyInfo
      this.isAdd = false
    },
    // 禁用公司
    disableCompany(companyInfo) {
      this.form = companyInfo
      if (companyInfo.disabled === '1') {
        this.$confirm('是否禁用该公司', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.form.disabled = 0
            this.showInfoMsg('success', '禁用成功！')
            this.updateInfo(this.form)
          })
          .catch(() => {
            this.showInfoMsg('info', '已取消禁用！')
          })
      } else {
        this.$confirm('是否启用该公司', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.form.disabled = 1
            this.showInfoMsg('success', '已启用成功！')
            this.updateInfo(this.form)
          })
          .catch(() => {
            this.showInfoMsg('info', '已取消启用！')
          })
      }
    },
    // 更新公司信息
    updateInfo(params) {
      updateOtherCompany(params).then(res => {
        if (res.data === 1) {
          this.dialogFormVisible = false
          this.showInfoMsg('success', '修改公司信息成功！')
          this.getTableData()
        } else if (res.repeat === 1) {
          this.showInfoMsg('error', '公司名已经存在！')
        }
      })
    },
    // 确认添加+修改
    confirm(formName) {
      let params
      if (this.isAdd) {
        params = { ...this.form }
      } else {
        params = {
          ...this.form
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            sendOtherCompany(params).then(res => {
              if (res.data === 1) {
                this.dialogFormVisible = false
                this.showInfoMsg('success', '添加公司成功')
                this.useOrderType = ''
                this.getTableData()
              } else {
                if (res.repeat === 1) {
                  this.showInfoMsg('error', '该公司名已经存在')
                } else {
                  this.showInfoMsg('error', '添加失败')
                }
              }
            })
          } else {
            this.updateInfo(params)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.dialogFormVisible = false
      this.showInfoMsg('info', '取消添加')
    }
  },
  created() {
    this.getTableData()
  }
}
