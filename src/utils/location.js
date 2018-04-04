import { GAODE_MAP_KEY } from "../config/config";
import amapFile from "../libs/amap-wx.js";
var myAmapFun = new amapFile.AMapWX({ key: GAODE_MAP_KEY });

export function getMapInfo() {
  return new Promise(function (resolve, reject) {
    myAmapFun.getRegeo({
      success: function (data) {
        resolve(data);
      },
      fail: function (info) {
        reject(info);
      }
    })
  });
}