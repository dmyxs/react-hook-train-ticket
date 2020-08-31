import React, { useCallback, useMemo } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Header from '../common/Header'
import DepartDate from './components/DepartDate/DepartDate'
import HighSpeed from './components/HighSpeed/HighSpeed'
import Journey from './components/joumey/Joumey'
import Submit from './components/Submit/Submit'
import CitySelector from '../common/CitySelector'
import DateSelector from '../common/DateSelector'

import './App.css'

import {
    exchangeFromTo,
    showCitySelector,
    hideCitySelector,
    fetchCityData,
    setSelectedCity,
    showDateSelector,
    hideDateSelector,
    setDepartDate,
    toggleHighSpeed,
} from './store/actions'
import { h0 } from './../utils/fp'

const App = (props) => {
    const {
        from,
        to,
        dispatch,
        isCitySelectorVisible,
        cityData,
        isLoadingCityData,
        departDate,
        isDateSelectorVisible,
        highSpeed,
    } = props

    //返回函数
    const onBack = useCallback(() => {
        window.history.back()
    }, [])

    //批量传递
    const cbs = useMemo(() => {
        return bindActionCreators(
            {
                exchangeFromTo,
                showCitySelector,
            },
            dispatch
        )
    }, [dispatch])

    const hideCitySelectorCbs = useMemo(() => {
        return bindActionCreators(
            {
                onBack: hideCitySelector,
                fetchCityData,
                onSelect: setSelectedCity,
            },
            dispatch
        )
    }, [dispatch])

    const departDateCbs = useMemo(() => {
        return bindActionCreators(
            {
                onClick: showDateSelector,
            },
            dispatch
        )
    }, [dispatch])

    const dateSelectorCbs = useMemo(() => {
        return bindActionCreators(
            {
                onBack: hideDateSelector,
            },
            dispatch
        )
    }, [dispatch])

    const HighSpeedCbs = useMemo(() => {
        return bindActionCreators(
            {
                toggle: toggleHighSpeed,
            },
            dispatch
        )
    }, [dispatch])

    const onSelectDate = useCallback(
        (day) => {
            if (!day) return
            if (day < h0()) return
            dispatch(setDepartDate(day))
            dispatch(hideDateSelector())
        },
        [dispatch]
    )

    return (
        <div>
            <div className="header-wrapper">
                <Header title="火车票" onBack={onBack} />
            </div>
            <form action="./query.html" className="form">
                <Journey from={from} to={to} {...cbs} />
                <DepartDate time={departDate} {...departDateCbs} />
                <HighSpeed {...HighSpeedCbs} highSpeed={highSpeed} />
                <Submit />
            </form>

            {/* 挂载城市选择浮层 */}
            <CitySelector
                show={isCitySelectorVisible}
                cityData={cityData}
                isLoading={isLoadingCityData}
                {...hideCitySelectorCbs}
            />

            {/* 挂载日期选择浮层 */}
            <DateSelector
                show={isDateSelectorVisible}
                {...dateSelectorCbs}
                onSelect={onSelectDate}
            />
        </div>
    )
}

const mapState = (state) => {
    return state
}

const mapDispatch = (dispatch) => {
    return { dispatch }
}

export default connect(mapState, mapDispatch)(App)
