import { createStore, combineReducers, applyMiddleware } from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'
import { h0 } from '../utils/fp'
import { ORDER_DEPART } from './constant'

export default createStore(
    combineReducers(reducers),
    {
        from: null,
        to: null,
        departDate: h0(Date.now()),
        highSpeed: false, //只看高铁动车
        trainList: [], //车次列表
        orderType: ORDER_DEPART, //出发早晚
        onlyTickets: false, //只看有票
        ticketTypes: [], //车票类型
        checkedTicketTypes: {}, //选中的车票类型
        trainTypes: [], //车次类型
        checkedTrainTypes: {}, //选中的车次类型
        departStations: [], //出发车站
        checkedDepartStations: {}, //选中的出发车站
        arriveStations: [], //到达车站
        checkedArriveStations: {}, //选中的到达车站

        departTimeStart: 0, //出发时间的起点，默认是0点
        departTimeEnd: 24, //出发时间的截止，默认是24点
        arriveTimeStart: 0, //到达时间的起点
        arriveTimeEnd: 24,

        isFilterVisible: false, //综合筛选浮层的显示与隐藏
        searchParsed: false, //用于判断是否解析完UIR参数
    },
    applyMiddleware(thunk)
)
