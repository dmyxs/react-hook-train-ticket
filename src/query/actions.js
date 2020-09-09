import { ORDER_DEPART, ORDER_DURATION } from './constant'
import { h0 } from '../utils/fp'

export const ACTION_SET_FROM = 'ACTION_SET_FROM'
export const ACTION_SET_TO = 'ACTION_SET_TO'
export const ACTION_SET_DEPARTDATE = 'ACTION_SET_DEPARTDATE'
export const ACTION_SET_HIGHSPEED = 'ACTION_SET_HIGHSPEED'
export const ACTION_SET_TRAINLIST = 'ACTION_SET_TRAINLIST'
export const ACTION_SET_ORDERTYPE = 'ACTION_SET_ORDERTYPE'
export const ACTION_SET_ONLYTICKETS = 'ACTION_SET_ONLYTICKETS'
export const ACTION_SET_TICKETTYPES = 'ACTION_SET_TICKETTYPES'
export const ACTION_SET_CHECKEDTICKETTYPES = 'ACTION_SET_CHECKEDTICKETTYPES'
export const ACTION_SET_TRAINTYPES = 'ACTION_SET_TRAINTYPES'
export const ACTION_SET_CHECKEDTRAINTYPES = 'ACTION_SET_CHECKEDTRAINTYPES'
export const ACTION_SET_DEPARTSTATIONS = 'ACTION_SET_DEPARTSTATIONS'
export const ACTION_SET_CHECKEDDEPARTSTATIONS =
    'ACTION_SET_CHECKEDDEPARTSTATIONS'
export const ACTION_SET_ARRIVESTATIONS = 'ACTION_SET_ARRIVESTATIONS'
export const ACTION_SET_CHECKEDARRIVESTATIONS =
    'ACTION_SET_CHECKEDARRIVESTATIONS'
export const ACTION_SET_DEPARTTIMESTART = 'ACTION_SET_DEPARTTIMESTART'
export const ACTION_SET_DEPARTTIMEEND = 'ACTION_SET_DEPARTTIMEEND'
export const ACTION_SET_ARRIVETIMESTART = 'ACTION_SET_ARRIVETIMESTART'
export const ACTION_SET_ARRIVETIMEEND = 'ACTION_SET_ARRIVETIMEEND'
export const ACTION_SET_ISFILTERVISIBLE = 'ACTION_SET_ISFILTERVISIBLE'
export const ACTION_SET_SEARCHPARSED = 'ACTION_SET_SEARCHPARSED'

export function setFrom(from) {
    return {
        type: ACTION_SET_FROM,
        payload: from,
    }
}
export function setTo(to) {
    return {
        type: ACTION_SET_TO,
        payload: to,
    }
}
export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPARTDATE,
        payload: departDate,
    }
}
export function setHighSpeed(highSpeed) {
    return {
        type: ACTION_SET_HIGHSPEED,
        payload: highSpeed,
    }
}

export function toggleHighSpeed() {
    return (dispatch, getState) => {
        const { highSpeed } = getState()
        dispatch(setHighSpeed(!highSpeed))
    }
}

export function setTrainList(trainList) {
    return {
        type: ACTION_SET_TRAINLIST,
        payload: trainList,
    }
}

//切换早晚
export function toggleOrderType() {
    return (dispatch, getState) => {
        const { orderType } = getState()
        if (orderType === ORDER_DEPART) {
            dispatch({
                type: ACTION_SET_ORDERTYPE,
                payload: ORDER_DURATION,
            })
        } else {
            dispatch({
                type: ACTION_SET_ORDERTYPE,
                payload: ORDER_DEPART,
            })
        }
    }
}

//只看有票
export function toggleOnlyTickets() {
    return (dispatch, getState) => {
        const { onlyTickets } = getState()
        dispatch({
            type: ACTION_SET_ONLYTICKETS,
            payload: !onlyTickets,
        })
    }
}

export function setTicketTypes(ticketTypes) {
    return {
        type: ACTION_SET_TICKETTYPES,
        payload: ticketTypes,
    }
}
export function setCheckedTicketTypes(checkedTicketTypes) {
    return {
        type: ACTION_SET_CHECKEDTICKETTYPES,
        payload: checkedTicketTypes,
    }
}
export function setTrainTypes(trainTypes) {
    return {
        type: ACTION_SET_TRAINTYPES,
        payload: trainTypes,
    }
}
export function setCheckedTrainTypes(checkedTrainTypes) {
    return {
        type: ACTION_SET_CHECKEDTRAINTYPES,
        payload: checkedTrainTypes,
    }
}
export function setDepartStations(departStations) {
    return {
        type: ACTION_SET_DEPARTSTATIONS,
        payload: departStations,
    }
}
export function setCheckedDepartStations(checkedDepartStations) {
    return {
        type: ACTION_SET_CHECKEDDEPARTSTATIONS,
        payload: checkedDepartStations,
    }
}
export function setArriveStations(arriveStations) {
    return {
        type: ACTION_SET_ARRIVESTATIONS,
        payload: arriveStations,
    }
}
export function setCheckedArriveStations(checkedArriveStations) {
    return {
        type: ACTION_SET_CHECKEDARRIVESTATIONS,
        payload: checkedArriveStations,
    }
}
export function setDepartTimeStart(departTimeStart) {
    return {
        type: ACTION_SET_DEPARTTIMESTART,
        payload: departTimeStart,
    }
}
export function setDepartTimeEnd(departTimeEnd) {
    return {
        type: ACTION_SET_DEPARTTIMEEND,
        payload: departTimeEnd,
    }
}
export function setArriveTimeStart(arriveTimeStart) {
    return {
        type: ACTION_SET_ARRIVETIMESTART,
        payload: arriveTimeStart,
    }
}
export function setArriveTimeEnd(arriveTimeEnd) {
    return {
        type: ACTION_SET_ARRIVETIMEEND,
        payload: arriveTimeEnd,
    }
}
export function toggleIsFilterVisible() {
    return (dispatch, getState) => {
        const { isFilterVisible } = getState()
        dispatch({
            type: ACTION_SET_ISFILTERVISIBLE,
            payload: !isFilterVisible,
        })
    }
}
export function setSearchParsed(searchParsed) {
    return {
        type: ACTION_SET_SEARCHPARSED,
        payload: searchParsed,
    }
}

//获取前一天和后一天
export function nextDate() {
    return (dispatch, getState) => {
        const { departDate } = getState()
        //departDate是当天的0时刻
        dispatch(setDepartDate(h0(departDate + 86400 * 1000)))
    }
}
export function prevDate() {
    return (dispatch, getState) => {
        const { departDate } = getState()
        //departDate是当天的0时刻
        dispatch(setDepartDate(h0(departDate - 86400 * 1000)))
    }
}
