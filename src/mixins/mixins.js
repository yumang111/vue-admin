export default {
  methods: {
    showInfoMsg(type, msg) {
      this.$message({
        type: type,
        message: msg,
        duration: 1000
      })
    }
  }
}
