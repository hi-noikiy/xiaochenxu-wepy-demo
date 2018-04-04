import { SHOP_LIST } from '../types/shop'
import { createAction } from 'redux-actions'

//返回一个actionCreate函数
export const setShopList = createAction(SHOP_LIST, (data) => {
  return {
    data
  }
})
