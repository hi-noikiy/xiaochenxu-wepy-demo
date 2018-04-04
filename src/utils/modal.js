//封装模态框，简化模态框调用,对于定制性很强的，还是采用微信原来的模态框


/*
oParam 
   content : 内容，必填
   title : 标题，可选
   success：确定按钮回调，可选
*/
export function myAlert( oParam ){
    oParam = Object.assign({
      title:'',
      content:'',
      success: () => { },
      showCancel: false
    }, oParam )
    wx.showModal( oParam )
}

/*
oParam 
   content : 内容，必填
   title : 标题，可选
   callbackOk：确定按钮回调，可选
   callbackCancel：取消按钮回调，可选
*/
export function myConfirm( oParam ) {
  oParam = Object.assign({
    title: '',
    content: ''
  }, oParam )

  oParam.success = ( res ) => {
    if (res.confirm) {
      oParam.callbackOk && oParam.callbackOk();
    } else if (res.cancel) {
      oParam.callbackCancel && oParam.callbackCancel();
    }
  }
  wx.showModal(oParam)
}
