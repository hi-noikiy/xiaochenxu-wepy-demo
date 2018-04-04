/**
 * @signParams 小程序签名参数
 * @dealInfo 订单信息
 */
export function wxPay(signParams,dealInfo={}){
  return new Promise((resolve, reject)=>{
    wx.requestPayment({
      timeStamp: signParams.timestamp,
      nonceStr: signParams.noncestr,
      'package': signParams.package,
      signType: signParams.signType,
      paySign: signParams.paySign,
      complete: (res) => {
        resolve(res)
        // if (res.errMsg == 'requestPayment:ok') {
        //   resolve(res)
        // } else {
        //   reject(res)
        // }
      }
    })
  })
}