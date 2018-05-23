import {
  getuserInfo
} from '@/api/api'
import userInfo from '@/mock/userInfo.json'
export const getMsg = ({
  commit
}, newMsg) => {
  commit({
    type: 'getMsg', // 对应mutation.js中的getMsg方法
    msg: newMsg
  })
}
export const getUserInfo = ({
  commit
}, newMsg) => {
  getuserInfo('auth.login.userInfo', {}).then(res => {
    if (process.env.NODE_ENV === 'development') {
      commit({
        type: 'getUserInfo', // 对应mutation.js中的getUserInfo方法
        msg: userInfo.data
      })
    } else {
      commit({
        type: 'getUserInfo', // 对应mutation.js中的getUserInfo方法
        msg: res.login_userInfo_response.data
      })
    }
  })
}
