import { handleActions } from 'redux-actions'
import { SHOP_LIST } from '../types/shop'

export default handleActions({
  [SHOP_LIST] (state,{ payload: { data } }) {
    return {
      ...state,
      shopList: data
    }
  }
}, {
  shopList: []
})
