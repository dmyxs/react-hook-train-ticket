import React, { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import URI from 'urijs'
import dayjs from 'dayjs'
import './App.css'

import { h0 } from './../utils/fp'

import Header from '../common/Header'
import Nav from '../common/Nav'
import List from './List'
import Bottom from './Bottom'
import {
    setFrom,
    setTo,
    setDepartDate,
    setHighSpeed,
    setSearchParsed,
    setTrainList,
    setTicketTypes,
    setTrainTypes,
    setDepartStations,
    setArriveStations,
    prevDate,
    nextDate,
    toggleOrderType,
    toggleHighSpeed,
    toggleOnlyTickets,
    toggleIsFilterVisible,
    setCheckedTicketTypes,
    setCheckedTrainTypes,
    setCheckedDepartStations,
    setCheckedArriveStations,
    setDepartTimeEnd,
    setDepartTimeStart,
    setArriveTimeStart,
    setArriveTimeEnd,
} from './actions'

const App = (props) => {
    const {
        trainList,
        from,
        to,
        departDate,
        highSpeed,
        dispatch,
        searchParsed,
        orderType,
        onlyTickets,
        isFilterVisible,

        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
    } = props

    const onBack = useCallback(() => {
        window.history.back()
    }, [])

    //UIR解析
    useEffect(() => {
        const queries = URI.parseQuery(window.location.search)
        const { from, to, date, highSpeed } = queries
        dispatch(setFrom(from))
        dispatch(setTo(to))
        dispatch(setDepartDate(h0(dayjs(date).valueOf())))
        dispatch(setHighSpeed(highSpeed === 'true')) //精辟
        dispatch(setSearchParsed(true))
    }, [dispatch])

    //发起异步请求
    useEffect(() => {
        //只有解析完URL才发起请求
        if (!searchParsed) {
            return
        }

        //设置发起请求的参数
        const url = new URI('/rest/query')
            .setSearch('from', from)
            .setSearch('to', from)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('highSpeed', highSpeed)
            .setSearch('orderType', orderType)
            .setSearch('onlyTickets', onlyTickets)

            //对象的处理
            .setSearch(
                'checkedTicketTypes',
                Object.keys(checkedTicketTypes).join()
            )
            .setSearch(
                'checkedTrainTypes',
                Object.keys(checkedTrainTypes).join()
            )
            .setSearch(
                'checkedDepartStations',
                Object.keys(checkedDepartStations).join()
            )
            .setSearch(
                'checkedArriveStations',
                Object.keys(checkedArriveStations).join()
            )
            .setSearch('departTimeStart', departTimeStart)
            .setSearch('departTimeEnd', departTimeEnd)
            .setSearch('arriveTimeStart', arriveTimeStart)
            .setSearch('arriveTimeEnd', arriveTimeEnd)
            .toString()

        fetch(url)
            .then((response) => response.json())
            .then((result) => {
                //解构深层数据
                const {
                    dataMap: {
                        directTrainInfo: {
                            trains,
                            filter: {
                                ticketType,
                                trainType,
                                depStation,
                                arrStation,
                            },
                        },
                    },
                } = result
                dispatch(setTrainList(trains))
                dispatch(setTicketTypes(ticketType))
                dispatch(setTrainTypes(trainType))
                dispatch(setDepartStations(depStation))
                dispatch(setArriveStations(arrStation))
            })
    }, [
        from,
        to,
        departDate,
        highSpeed,
        searchParsed,
        orderType,
        onlyTickets,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
        dispatch,
    ])

    //h0是当天的0时刻，h0(departDate)是出发日期的0时刻
    //isPrevDisabled = 如果出发时刻小于 当天时刻，是过去的时间，不可点
    //isNextDisabled = 如果出发时刻减去 当天时刻，大于20天的时间
    const isPrevDisabled = h0(departDate) <= h0()
    const isNextDisabled = h0(departDate) - h0() > 20 * 86400 * 1000

    const prev = useCallback(() => {
        if (isPrevDisabled) {
            return
        }
        dispatch(prevDate())
    }, [dispatch, isPrevDisabled])

    const next = useCallback(() => {
        if (isNextDisabled) {
            return
        }
        dispatch(nextDate())
    }, [dispatch, isNextDisabled])

    const bottomCbs = useMemo(() => {
        return bindActionCreators(
            {
                toggleOrderType,
                toggleHighSpeed,
                toggleOnlyTickets,
                toggleIsFilterVisible,
                setCheckedTicketTypes,
                setCheckedTrainTypes,
                setCheckedDepartStations,
                setCheckedArriveStations,
                setDepartTimeEnd,
                setDepartTimeStart,
                setArriveTimeStart,
                setArriveTimeEnd,
            },
            dispatch
        )
    }, [dispatch])

    if (!searchParsed) {
        return null
    }

    return (
        <div>
            <div className="header-wrapper">
                <Header title={`${from} → ${to}`} onBack={onBack} />
            </div>
            <Nav
                date={departDate}
                prev={prev}
                next={next}
                isPrevDisabled={isPrevDisabled}
                isNextDisabled={isNextDisabled}
            />
            <List list={trainList} />
            <Bottom
                highSpeed={highSpeed}
                orderType={orderType}
                onlyTickets={onlyTickets}
                isFilterVisible={isFilterVisible}
                ticketTypes={ticketTypes}
                trainTypes={trainTypes}
                departStations={departStations}
                arriveStations={arriveStations}
                checkedTicketTypes={checkedTicketTypes}
                checkedTrainTypes={checkedTrainTypes}
                checkedDepartStations={checkedDepartStations}
                checkedArriveStations={checkedArriveStations}
                departTimeStart={departTimeStart}
                departTimeEnd={departTimeEnd}
                arriveTimeStart={arriveTimeStart}
                arriveTimeEnd={arriveTimeEnd}
                {...bottomCbs}
            />
        </div>
    )
}

export default connect(
    (state) => state,
    (dispatch) => ({ dispatch })
)(App)
