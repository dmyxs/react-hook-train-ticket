import { createStore, combineReducers, applyMiddleware } from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'

export default createStore(
    combineReducers(reducers),
    {
        from: '北京',
        to: '上海',
        isCitySelectorVisible: false, //城市选择浮层开关
        currentSelectingLeftCity: false, //使用布尔值来做判断数据回填到哪里
        cityData: null, //城市数据
        isLoadingCityData: false, //是否正在加载
        isDateSelectorVisible: false, //日期选择浮层开关
        highSpeed: false, //是否选中高铁动车
        departDate: Date.now(),
    },
    applyMiddleware(thunk)
)
