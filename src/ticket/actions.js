import { h0 } from '../utils/fp'

export const ACTION_SET_DEPARTDATE = 'ACTION_SET_DEPARTDATE'
export const ACTION_SET_ARRIVEDATE = 'ACTION_SET_ARRIVEDATE'
export const ACTION_SET_DEPARTTIMESTR = 'ACTION_SET_DEPARTTIMESTR'
export const ACTION_SET_ARRIVETIMESTR = 'ACTION_SET_ARRIVETIMESTR'
export const ACTION_SET_DEPARTSTATION = 'ACTION_SET_DEPARTSTATION'
export const ACTION_SET_ARRIVESTATION = 'ACTION_SET_ARRIVESTATION'
export const ACTION_SET_TRAINNUMBER = 'ACTION_SET_TRAINNUMBER'
export const ACTION_SET_DURATIONSSTR = 'ACTION_SET_DURATIONSSTR'
export const ACTION_SET_TICKETS = 'ACTION_SET_TICKETS'
export const ACTION_SET_ISSCHEDULEVISIBLE = 'ACTION_SET_ISSCHEDULEVISIBLE'
export const ACTION_SET_SEARCHPARSED = 'ACTION_SET_SEARCHPARSED'

export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPARTDATE,
        payload: departDate,
    }
}
export function setArriveDate(arriveDate) {
    return {
        type: ACTION_SET_ARRIVEDATE,
        payload: arriveDate,
    }
}
export function setDepartTimeStr(departTimeStr) {
    return {
        type: ACTION_SET_DEPARTTIMESTR,
        payload: departTimeStr,
    }
}
export function setArriveTimeStr(arriveTimeStr) {
    return {
        type: ACTION_SET_ARRIVETIMESTR,
        payload: arriveTimeStr,
    }
}
export function setDepartStation(departStation) {
    return {
        type: ACTION_SET_DEPARTSTATION,
        payload: departStation,
    }
}
export function setArriveStation(arriveStation) {
    return {
        type: ACTION_SET_ARRIVESTATION,
        payload: arriveStation,
    }
}
export function setTrainNumber(trainNumber) {
    return {
        type: ACTION_SET_TRAINNUMBER,
        payload: trainNumber,
    }
}
export function setDurationStr(durationsStr) {
    return {
        type: ACTION_SET_DURATIONSSTR,
        payload: durationsStr,
    }
}
export function setTickets(tickets) {
    return {
        type: ACTION_SET_TICKETS,
        payload: tickets,
    }
}
export function setIsScheduleVisible(isScheduleVisible) {
    return {
        type: ACTION_SET_ISSCHEDULEVISIBLE,
        payload: isScheduleVisible,
    }
}

export function toggleIsScheduleVisible() {
    return (dispatch, getState) => {
        const { isScheduleVisible } = getState()
        dispatch(setIsScheduleVisible(!isScheduleVisible))
    }
}

export function setSearchParsed(searchParsed) {
    return {
        type: ACTION_SET_SEARCHPARSED,
        payload: searchParsed,
    }
}

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
