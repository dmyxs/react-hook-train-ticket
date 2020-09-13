import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import URI from 'urijs'
import dayjs from 'dayjs'

import Header from '../common/Header'
import Detail from '../common/Detail'
import Ticket from './Ticket'
import Menu from './Menu'
import Passengers from './Passengers'
import Account from './Account'
import Choose from './Choose'

import './App.css'
import {
    setTrainNumber,
    setDepartStation,
    setArriveStation,
    setSeatType,
    setDepartDate,
    setSearchParsed,
    fetchInitial,
    createAdult,
    createChild,
    removePassenger,
    updatePassenger,
    hideMenu,
    showGenderMenu,
    showFollowAdultMenu,
    showTicketTypeMenu,
} from './actions'

const App = memo((props) => {
    const {
        trainNumber,
        departStation,
        arriveStation,
        seatType,
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        durationStr,
        price,
        passengers,
        menu,
        isMenuVisible,
        searchParsed,
        dispatch,
    } = props

    const onBack = useCallback(() => {
        window.history.back()
    }, [])

    useEffect(() => {
        const queries = URI.parseQuery(window.location.search)
        const { trainNumber, dStation, aStation, date, type } = queries

        dispatch(setTrainNumber(trainNumber))
        dispatch(setDepartStation(dStation))
        dispatch(setArriveStation(aStation))
        dispatch(setSeatType(type))
        dispatch(setDepartDate(dayjs(date).valueOf())) //字符串转时间挫
        dispatch(setSearchParsed(true))
    }, [dispatch])

    //发起异步请求
    useEffect(() => {
        //如果没有解析完URL参数，什么都不做
        if (!searchParsed) {
            return
        }
        const url = new URI('/rest/order')
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('type', seatType)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString() //返回字符串的url

        dispatch(fetchInitial(url))
    }, [
        arriveStation,
        departDate,
        departStation,
        dispatch,
        searchParsed,
        seatType,
    ])

    const passengersCbs = useMemo(() => {
        return bindActionCreators(
            {
                createAdult,
                createChild,
                removePassenger,
                updatePassenger,
                showGenderMenu,
                showFollowAdultMenu,
                showTicketTypeMenu,
            },
            dispatch
        )
    }, [dispatch])

    const menuCbs = useMemo(() => {
        return bindActionCreators(
            {
                hideMenu,
            },
            dispatch
        )
    }, [dispatch])

    const chooseCbs = useMemo(() => {
        return bindActionCreators(
            {
                updatePassenger,
            },
            dispatch
        )
    }, [dispatch])

    if (!searchParsed) {
        return null
    }

    return (
        <div className="app">
            <div className="header-wrapper">
                <Header title="订单填写" onBack={onBack} />
            </div>
            <div className="detail-wrapper">
                <Detail
                    departDate={departDate}
                    arriveDate={arriveDate}
                    departTimeStr={departTimeStr}
                    arriveTimeStr={arriveTimeStr}
                    trainNumber={trainNumber}
                    departStation={departStation}
                    arriveStation={arriveStation}
                    durationsStr={durationStr}
                >
                    <span
                        style={{ display: 'block' }}
                        className="train-icon"
                    ></span>
                </Detail>
            </div>
            <Ticket price={price} type={seatType} />

            <Passengers passengers={passengers} {...passengersCbs} />

            {passengers.length > 0 && (
                <Choose passengers={passengers} {...chooseCbs} />
            )}

            <Account price={price} passengers={passengers} />

            <Menu show={isMenuVisible} {...menu} {...menuCbs} />
        </div>
    )
})

export default connect(
    (state) => state,
    (dispatch) => ({ dispatch })
)(App)
