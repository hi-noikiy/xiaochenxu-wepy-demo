import { host }  from "@/config/config";
import { get, post } from  "@/api/base";

let Banner = {
  //banner列表
  getList(data) {
    return get(`${host.banner}/Interface/getbanner`, data);
  }
}

module.exports = Banner;
