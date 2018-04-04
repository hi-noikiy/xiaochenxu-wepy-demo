/**
 * 强制用户登录
 */
import User from '@/api/user';


/**
 * @ref 完善资料后的回调地址
 * @autoLogin 是否自动跳转到完善资料页
 * 获取用户信息，如果用户未注册则直接注册
 */
export function getUser(ref = '',autoLogin = true){
  let user = wx.getStorageSync("user");
  if (user.user_id && user.user_id!='0'){
    return new Promise((resolve, reject)=>{
      resolve(user);
    })
  }
  return login().then(res => {
    if(res.status==100){
      return new Promise((resolve, reject) => {
        return reject()
      })
    } else if (res.status == '0'){
      return wx.getStorageSync("user");
    } else if (res.status == '1') {
      //用户尚未注册逻辑
      if (autoLogin) {
        wx.redirectTo({
          url: '/pages/register/index?ref=' + ref
        });
        return new Promise((resolve, reject) => {
          reject()
        })
      }
      return user
    } else {}
  }).catch(()=>{
    wx.hideLoading();
    return new Promise((resolve, reject) => {
      reject()
    })
  })
}
export function login(){
  //判断用户是否登录
  if (checkLogin()) {
    return new Promise((resolve, reject)=>{
      resolve({
        status: 0,
        message: '登录成功'
      });
    })
  }
  return new Promise((resolve, reject)=>{
    //获取用户的授权设置
    wx.getSetting({
      success: function (res) {
        if (res.authSetting["scope.userInfo"]==false) {
          wx.showModal({
            content: '请先打开用户信息授权设置',
            showCancel: false,
            success: function () {
              wx.openSetting({
                success: function (settingRes) {
                  // if (!settingRes.authSetting["scope.userInfo"]) {

                  // } else {
                  //   resolve(true);
                  // }

                }
              })
            }
          })
        } else {
          resolve(true);
        }
      },
      fail: function (res) {
        wx.showModal({
          content: '获取用户授权设置失败，' + res.errMsg,
          showCancel: false
        })
        resolve(false);
      }
    })
  }).then((setting)=>{
    if (setting){
      return getCode2Login()
    }else{
      return {
        status: 100,
        message: '用户拒绝获取微信用户资料'
      }
    }
  })
}

function getCode2Login(){
  return new Promise((resolve, reject)=>{
    //获取登录凭证code
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          withCredentials: true,
          success: function (response){
            if (res.code){
              User.login({
                code: res.code,
                data: response.encryptedData,
                iv: response.iv
              }).then(json => {
                if (json.status != '0') {
                  return wx.showModal({
                    content: json.message,
                    showCancel: false
                  })
                }
                wx.setStorageSync('user', json.data);
                const status = (json.data.user_id && json.data.user_id != '0') ? '0' : '1';
                resolve({
                  status: status,
                  data: json.data,
                  message: status=='0' ? '登录成功' : '尚未注册'
                });
              })
            }else{
              wx.showModal({
                content: '获取用户登录态失败！' + res.errMsg,
                showCancel: false
              });
              reject();
            }
          },
          fail: function(res){
            wx.showModal({
              content: '请先打开用户信息授权设置',
              showCancel: false,
              success: function () {
                wx.openSetting({
                  success: function (settingRes) {
                  }
                })
              }
            })
          }
        })
      },
      fail: function () {
        wx.showModal({
          content: '你取消了登录！',
          showCancel: false
        });
        reject();
      }
    });
  })

}





/*检查用户是否登录*/
function checkLogin() {
  const user = wx.getStorageSync("user");
  if ( user.userId ) {
    return user;
  }else{
    return null
  }
}


// function login(){
//   if ( checkLogin() ){

//   }else{

//   }
// }

// function login(callback = () => { }, registeFn) {
//   const user = wx.getStorageSync("user");
//   if (user.userId) {
//     callback(user);
//     return;
//   }
//   goLogin(callback);
// }
