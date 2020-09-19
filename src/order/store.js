import { createStore, combineReducers, applyMiddleware } from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
    combineReducers(reducers),
    {
        trainNumber: null,
        departStation: null,
        arriveStation: null,
        seatType: null, //坐席类型
        departDate: Date.now(),
        arriveDate: Date.now(),
        departTimeStr: null, //出发时间的字符串表示，该数据从服务端获取
        arriveTimeStr: null,
        durationStr: null, //行程时间
        price: null,
        passengers: [], //旅客信息
        menu: null, //弹出菜单
        isMenuVisible: false,
        searchParsed: false,
    },
    applyMiddleware(thunk)
)
