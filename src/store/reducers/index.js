import { combineReducers } from 'redux'
import counter from './counter'
import shop from './shop'

export default combineReducers({
  counter,
  shop
})
