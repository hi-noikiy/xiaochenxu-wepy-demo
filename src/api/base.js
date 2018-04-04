import wepy from 'wepy'

/*基础请求封装*/
function request(url, data, method, header={} ) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      header: Object.assign({
        'content-type': 'application/json'
      }, header),
      method: method,
      success: function (res) {
        resolve(res.data);
      },
      fail: function (error) {
        reject(error);
      }
    })
  });
}

//get请求,get 请求使用wepy.request，避免10个请求限制
export function get(url, data, method, header={} ) {
  return wepy.request({url:url,data:data}).then((res)=>{
    return Promise.resolve(res.data)
  })
}

//post请求，wepy.request 没测出如何发起post请求
export function post(url, data, header) {
  return request(url, data, "POST", header)
}
