export const ACTION_SET_FROM = 'SET_FROM'
export const ACTION_SET_TO = 'SET_TO'
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE =
    'SET_IS_CITY_SELECTOR_VISIBLE'
export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY =
    'SET_CURRENT_SELECTING_LEFT_CITY'
export const ACTION_SET_CITY_DATA = 'SET_CITY_DATA'
export const ACTION_SET_IS_LOADING_CITY_DATA = 'SET_IS_LOADING_CITY_DATA'
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE =
    'SET_IS_DATE_SELECTOR_VISIBLE'
export const ACTION_SET_HIGH_SPEED = 'SET_HIGH_SPEED'
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE'

//设置始发站
export function setFrom(from) {
    return {
        type: ACTION_SET_FROM,
        payload: from,
    }
}

//设置终点站
export function setTo(to) {
    return {
        type: ACTION_SET_TO,
        payload: to,
    }
}

//是否显示城市浮层
export function setIsLoadingCityData(isLoadingCityData) {
    return {
        type: ACTION_SET_IS_LOADING_CITY_DATA,
        payload: isLoadingCityData,
    }
}

//设置城市数据
export function setCityData(cityDate) {
    return {
        type: ACTION_SET_CITY_DATA,
        payload: cityDate,
    }
}

//切换高铁动车
//异步action：：获取到最新的值，然后根据最新的值取反
export function toggleHighSpeed() {
    return (dispatch, getState) => {
        const { highSpeed } = getState()
        dispatch({
            type: ACTION_SET_HIGH_SPEED,
            payload: !highSpeed,
        })
    }
}

//显示城市选择浮层的同时，指定在哪里回填数据
//打开from的浮层时，传入true，选择城市时，再判断该变量真假回传到设定好的数据中
//参数currentSelectingLeftCity 如果是true，回填到from，是false 回填到to
export function showCitySelector(currentSelectingLeftCity) {
    return (dispatch) => {
        dispatch({
            // 设置显示城市选择浮层
            type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
            payload: true,
        })

        dispatch({
            // 回填数据
            type: ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
            payload: currentSelectingLeftCity,
        })
    }
}

//隐藏城市选择浮层
export function hideCitySelector() {
    return {
        type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
        payload: false,
    }
}

//在浮层选择城市，然后回填，参数是城市，通过判断currentSelectingLeftCity
export function setSelectedCity(city) {
    return (dispatch, getState) => {
        const { currentSelectingLeftCity } = getState()
        //如果为真，数据回填到form，否则回填到to
        if (currentSelectingLeftCity) {
            dispatch(setFrom(city))
        } else {
            dispatch(setTo(city))
        }

        //选择城市后，关闭城市选择浮层
        dispatch(hideCitySelector())
    }
}

//显示日期选择浮层
export function showDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: true,
    }
}

//隐藏日期选择浮层
export function hideDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: false,
    }
}

//切换始发站和终点站，获取值，再分别dispatch
export function exchangeFromTo() {
    return (dispatch, getState) => {
        const { from, to } = getState()
        dispatch(setFrom(to))
        dispatch(setTo(from))
    }
}

//设置日期选择浮层的时间
export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPART_DATE,
        payload: departDate,
    }
}

//发起异步请求
export function fetchCityData() {
    return (dispatch, getState) => {
        //如果请求已经发送，就什么都不做，等待另一个请求的返回
        const { isLoadingCityData } = getState()
        if (isLoadingCityData) {
            return
        }

        //获取缓存
        const cache = JSON.parse(
            localStorage.getItem('city_data_cache') || '{}'
        )

        //判断缓存是否过期：现在时间的时间挫是否小于设置的时间挫
        if (Date.now() < cache.expires) {
            //没有过期就使用缓存
            dispatch(setCityData(cache.data))
            return
        }

        // 设置为正在加载城市数据
        dispatch(setIsLoadingCityData(true))

        //发送请求
        //加上随机的参数，防止缓存
        fetch('/rest/cities?_' + Date.now())
            .then((res) => res.json())
            .then((cityData) => {
                // 发送请求成功之后，设置城市状态
                dispatch(setCityData(cityData))

                // 设置缓存
                localStorage.setItem(
                    'city_data_cache',
                    JSON.stringify({
                        //过期时间：1天
                        expires: Date.now() + 60 * 1000 * 60 * 24,
                        data: cityData,
                    })
                )

                //最后设置加载完成
                dispatch(setIsLoadingCityData(false))
            })
            .catch(() => {
                dispatch(setIsLoadingCityData(false))
            })
    }
}
