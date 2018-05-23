export const getMsg = (state, payload) => {
  state.msg = payload.msg
}
export const getUserInfo = (state, payload) => {
  state.userInfo = payload.msg // payload.msg--传入方法的参数
}
