import {DEAL_STATE} from "../constants/constants";

/**
 * @desc 链接数组对象里的某个属性,并返回一个数组，如 [{mis_doctor_id:123},{mis_doctor_id:3497}] 返回数组[123, 3497]
 * @param arr
 * @param prop
 * @returns {Array}
 */
export function getArrProp(arr, prop) {
  let result = [];
  if (!arr) return result;
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i][prop])
  }
  return result;
}

//按位与解析医生标签，返回Boolean值 sign: 十进制; num:移位的位数
export function decodeSign(sign, num) {
  let _sign = sign & Math.pow(2, num);
  return (_sign > 0);
}
//按位或返回医生标签值，返回number
export function encodeSign(num) {
  return 0 | Math.pow(2, num);
}
//按位解析位和,返回array
export function decodeSignList(signSum, map) {
  let result = [];
  Object.keys(map).forEach((item) => {
    if (decodeSign(signSum, item)) {
      result.push(map[item])
    }
  });
  return result;
}

//价格转换
export function convertPrice(price, fixFlag) {
  if (price < 100) {
    return fixFlag ? '0' : '0.00';
  } else {
    price = Math.floor(price / 100) * 100;
    return fixFlag ? (Number.parseInt(price) / 10000) : ((Number.parseInt(price) / 10000).toFixed(2));
  }
}

//性别转换
export function convertGender(genderCode) {
  genderCode = String( genderCode )
  switch (genderCode) {
    case '0':
      return '未填写';
      break;
    case '1':
      return '男';
      break;
    case '2':
      return '女';
      break;
    default:
      return '';
  }
}


//获取时间戳或计算
export function getTimeStamp(format = 's') {
  let now = new Date();
  switch (format) {
    case 's':
      return Math.round(now.getTime() / 1000); //输出秒
    case 'ms':
      return now.getTime(); //输出毫秒
    default:
      return Math.round(now.getTime() / 1000); //输出秒
  }
}

//时间转换,处理13位的时间戳(毫秒)
export function convertTimeToStr(timeStamp, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if ( timeStamp == 0 ) return '';
  let date, k, o, tmp;
  if (!timeStamp) { return false; }
  if (typeof timeStamp == 'string') {
    timeStamp = parseInt(timeStamp)
  }
  //如果是10位数,则乘以1000转换为毫秒
  if (timeStamp.toString().length == 10) {
    timeStamp = timeStamp * 1000
  }
  date = new Date(timeStamp);
  o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      tmp = RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length);
      fmt = fmt.replace(RegExp.$1, tmp);
    }
  }
  return fmt
}

//获取当天开始结束时间戳
export function getTodayTime() {
  let oDate = new Date(), startTime, endTime;
  oDate.setHours(0, 0, 0, 0)
  startTime = parseInt(oDate.getTime() / 1000);
  oDate.setHours(24, 0, 0, 0)
  endTime = parseInt(oDate.getTime() / 1000);
  return {
    startTime,
    endTime
  }
}

//将初始年月转化成年龄
export function birth2age(birth){
  if (!birth) return '';
  let oDate = new Date();
  let year = oDate.getFullYear()
  let sBirth = birth.split("-")[0]
  return year - sBirth;
}


/**
  * @description 将对象转换为URL字符串,方便发送或存储
  * @param o 将要转为URL参数字符串的对象
  * @param key URL参数字符串的前缀
  * @param encode true/false 是否进行URL编码,默认为true
  * @return string URL参数字符串
 **/
export function objToUrlString(o,  key,  encode)  {
  if  (o  ==  null)  return  '';
  var  fn  =  function (obj,  key,  encode) {
    var  paramStr  =  '',
      t  =  typeof  (obj);
    if  (t  ==  'string'  ||  t  ==  'number'  ||  t  ==  'boolean')  {
      paramStr  +=  '&'  +  key  +  '='  +  ((encode  ==  null  ||  encode)  ?  encodeURIComponent(obj)  :  obj);
    }  else  {
      for  (var  i  in  obj)  {
        var  k  =  key == null ? i : key  +  (obj  instanceof  Array  ?  '['  +  i  +  ']'  :  '.'  +  i);
        paramStr  +=  fn(obj[i],  k,  encode);
      }
    }
    return  paramStr;
  };
  var  result  =  fn(o,  key,  encode);
  return  result.substr(1)
}


/**
 * @description url字符串转换成对象
 * @param string
 * @returns {{}}
 */
export function urlStringToObj(string) {
  'use strict';
  var params = {},
    q = string ? string : window.location.search.substring(1),
    e = q.split('&'),
    l = e.length,
    f,
    i = 0;
  for (i; i < l; i += 1) {
    f = e[i].split('=');
    params[f[0]] = decodeURIComponent(f[1]);
  }
  return params;
}


/**
 * @desc 平台限制医生:如果医生仅限的平台与当前平台相同，或没有限制则通过。
 * @name platformMatchDoctor
 * @return {boolean}
 */
export function platformMatchDoctor(sign) {
  let match = true,
    pingAnLimited = decodeSign(sign, 15);
  if (pingAnLimited) {
    match = false;
    switch (detectPlatform()) {
      case "pingan":
        match = true;
        break;
      case "web":
      case "weixin":
      default:
    }
  }
  return match;
}


/*
 * @desc 门店项目选项装换
 * @num 小于15的数字
 * @return object 是否为理疗、公医、医保、直营店。
 */
export function hospitalOption(num = 0) {
  let binaryArray = [],
    dividend = num,
    opt = {
      "hasPhysicalTherapy": false,//理疗
      "isFreeMedicalService": false,//公医
      "hasMedicalInsurance": false,//医保
      "idDirectSaleStore": false//直营店
    };
  if (num > 15) {
    return opt;
  }
  //转换成二进制
  for (var i = 0; i < Math.ceil(num / 2); i++) {
    if (dividend != 1) {
      binaryArray.unshift(dividend % 2);
      dividend = parseInt(dividend / 2);
    } else {
      binaryArray.unshift(1);
      break;
    }
  }

  //转换成二进制后补全4位
  switch (binaryArray.length) {
    case 1:
      binaryArray = [0, 0, 0].concat(binaryArray);
      break;
    case 2:
      binaryArray = [0, 0].concat(binaryArray);
      break;
    case 3:
      binaryArray = [0].concat(binaryArray);
      break;
    default:
  }
  if (binaryArray[0] == 1) {
    opt["idDirectSaleStore"] = true;
  }
  if (binaryArray[1] == 1) {
    opt["hasMedicalInsurance"] = true;
  }
  if (binaryArray[2] == 1) {
    opt["isFreeMedicalService"] = true;
  }
  if (binaryArray[3] == 1) {
    opt["hasPhysicalTherapy"] = true;
  }
  return opt;
}


/**
 * 判断活动是否可以报名
 * @param startTime 报名开始时间
 * @param endTime 报名结束时间
 * @param isLimit 是否限制
 * @param totalNum 已报名人数
 * @param limitNum 限制人数
 * @return {{value: number,listText: string,btnText: string}} 0 报名未开始，1 报名，2 报名结束，3 报名已满
 */
export function mapLecturesStatus(startTime, endTime, isLimit, totalNum, limitNum) {
  isLimit = isLimit || false;
  const curDate = Date.parse(new Date());
  let status = {
    value: -1,
    listText: "",
    btnText: ""
  };
  if (startTime * 1000 > curDate) {
    status.value = 0;
    status.listText = "未开始";
    status.btnText = "报名未开始";
  } else if (startTime * 1000 < curDate && curDate < endTime * 1000) {
    if (isLimit && totalNum >= limitNum) {
      status.value = 3;
      status.listText = "已满";
      status.btnText = "报名已满";
    } else {
      status.value = 1;
      status.listText = "可报名";
      status.btnText = "我要报名";
    }
  } else {
    status.value = 2;
    status.listText = "已结束";
    status.btnText = "报名已结束";
  }
  return status;
}

//去除字符串两边空格
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

//把年龄转化成出生年份，月日统一为1月1日
export function age2birth(age){
  const year = new Date().getFullYear() - age;
  return `${year}-01-01`;
}
/*
  获取处方状态,由于前端显示状态和后台并不对应，所以必须根据时间来判断
  data 包含以下4个字段的
    deal_create_time ：转方完成时间
    payment_return_time ： 支付完成时间
    all_prepared_time ：配药完成时间
    ship_time ： 发货时间
    deal_state ：订单状态，只用于显示已取消的状态
*/
export function getPrescriptionSate(data) {
  let txt = "";
  if (data.deal_create_time > 0) {
    txt = "待支付";
  }
  if (data.payment_return_time > 0) {
    txt = "已支付";
  }
  if (data.all_prepared_time > 0) {
    txt = "配药完成";
  }
  if (data.ship_time > 0) {
    txt = "已发货";
  }
  if (data.deal_state == '13') {
    txt = "交易取消";
  }
  if (data.deal_state == '12') {
    txt = "退款中";
  }
  if (data.deal_state == '19') {
    txt = "已退款";
  }
  if (data.deal_state == '35') {
    txt = "已失效";
  }
  return txt;
}

//计算用于显示的距离,大于1000米需要进行处理
export function distanceDisplay(list){
  if ( list ) {
    return list.map((item, index) => {
      if (item.distance > 1000) {
        item.showDistance = (item.distance / 1000).toFixed(2);
      } else {
        item.showDistance = item.distance;
      }
      return item;
    })
  }
}
/**
 * 处方代码转名称
 */
export function mapRecipeCodeToName(code) {
  switch (code) {
    case '1':
      return '西药'
      break;
    case '3':
      return '中药饮片'
      break;
    case '4':
      return '检查'
      break;
    case '5':
      return '检验'
      break;
    case '6':
      return '治疗'
      break;
    case '7':
      return '材料'
      break;
    case '8':
      return '其他'
      break;
    case '9':
      return '协定方'
      break;
    case '10':
      return '其他'
      break;
    case '11':
      return '颗粒剂'
      break;
    default:
      return '未知'
  }
}

  

