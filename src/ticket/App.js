import React, { useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import URI from 'urijs'
import dayjs from 'dayjs'
import { h0 } from '../utils/fp'
import useNav from '../utils/useNav'

import Detail from './../common/Detail'
import Header from './../common/Header'
import Nav from './../common/Nav'
import { TrainContext } from './context'

import Candidate from './Candidate'
// import Schedule from './Schedule'

import './App.css'
import {
    setDepartStation,
    setArriveStation,
    setTrainNumber,
    setDepartDate,
    setSearchParsed,
    prevDate,
    nextDate,
    setDepartTimeStr,
    setArriveTimeStr,
    setArriveDate,
    setDurationStr,
    setTickets,
    toggleIsScheduleVisible,
} from './actions'

//异步引入
const Schedule = lazy(() => import('./Schedule.js'))

const App = (props) => {
    const {
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        departStation,
        arriveStation,
        trainNumber,
        durationsStr,
        tickets,
        isScheduleVisible,
        searchParsed,
        dispatch,
    } = props

    const onBack = useCallback(() => {
        window.history.back()
    }, [])

    //从URL获取数据，派发action
    useEffect(() => {
        const queries = URI.parseQuery(window.location.search)
        const { aStation, dStation, date, trainNumber } = queries

        //派发action
        dispatch(setDepartStation(dStation))
        dispatch(setArriveStation(aStation))
        dispatch(setTrainNumber(trainNumber))
        dispatch(setDepartDate(h0(dayjs(date).valueOf())))

        dispatch(setSearchParsed(true))
    }, [dispatch])

    useEffect(() => {
        document.title = trainNumber
    }, [trainNumber])

    //发起异步请求
    useEffect(() => {
        if (!searchParsed) {
            return
        }
        const url = new URI('/rest/ticket')
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('trainNumber', trainNumber)
            .toString() //返回字符串的url

        fetch(url)
            .then((response) => response.json())
            .then((result) => {
                const { detail, candidates } = result
                const {
                    departTimeStr,
                    arriveTimeStr,
                    arriveDate,
                    durationStr,
                } = detail

                dispatch(setDepartTimeStr(departTimeStr))
                dispatch(setArriveTimeStr(arriveTimeStr))
                dispatch(setArriveDate(arriveDate))
                dispatch(setDurationStr(durationStr))
                dispatch(setTickets(candidates))
            })
    }, [departDate, dispatch, searchParsed, trainNumber])

    const { isPrevDisabled, isNextDisabled, prev, next } = useNav(
        departDate,
        dispatch,
        prevDate,
        nextDate
    )

    const detailCbs = useMemo(() => {
        return bindActionCreators(
            {
                toggleIsScheduleVisible,
            },
            dispatch
        )
    }, [dispatch])

    //如果searchParsed不为真，就不渲染，因为title会为null，因为title是从url里拿出来的
    if (!searchParsed) {
        return null
    }

    return (
        <div className="app">
            <div className="header-wrapper">
                <Header title={trainNumber} onBack={onBack} />
            </div>

            <div className="nav-wrapper">
                <Nav
                    date={departDate}
                    isPrevDisabled={isPrevDisabled}
                    isNextDisabled={isNextDisabled}
                    prev={prev}
                    next={next}
                />
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
                    durationsStr={durationsStr}
                >
                    <span className="left"></span>
                    <span
                        className="schedule"
                        onClick={() => detailCbs.toggleIsScheduleVisible()}
                    >
                        时刻表
                    </span>
                    <span className="right"></span>
                </Detail>
            </div>

            {/* 时刻表 */}
            {isScheduleVisible && (
                <div
                    className="mask"
                    onClick={() => dispatch(toggleIsScheduleVisible())}
                >
                    {/* lazy load */}
                    <Suspense fallback={<div>loading...</div>}>
                        <Schedule
                            date={departDate}
                            trainNumber={trainNumber}
                            departStation={departStation}
                            arriveStation={arriveStation}
                        />
                    </Suspense>
                </div>
            )}

            {/* context */}
            <TrainContext.Provider
                value={{
                    trainNumber,
                    departStation,
                    arriveStation,
                    departDate,
                }}
            >
                <Candidate tickets={tickets} />
            </TrainContext.Provider>
        </div>
    )
}

export default connect(
    (state) => state,
    (dispatch) => ({ dispatch })
)(App)
