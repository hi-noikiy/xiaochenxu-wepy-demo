//门店相关接口
import { host }  from "@/config/config";
import { get, post } from  "@/api/base";

let Shop = {
  //查询门店列表
  getList(data) {
    return get(`${host.cplus}/cgi-bin/mix/queryshop`, data);
  }

}

module.exports = Shop;
