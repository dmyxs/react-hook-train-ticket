import {
    ACTION_SET_DEPARTDATE,
    ACTION_SET_ARRIVEDATE,
    ACTION_SET_DEPARTTIMESTR,
    ACTION_SET_ARRIVETIMESTR,
    ACTION_SET_DEPARTSTATION,
    ACTION_SET_ARRIVESTATION,
    ACTION_SET_TRAINNUMBER,
    ACTION_SET_DURATIONSSTR,
    ACTION_SET_TICKETS,
    ACTION_SET_ISSCHEDULEVISIBLE,
    ACTION_SET_SEARCHPARSED,
} from './actions'

export default {
    departDate(state = Date.now(), action) {
        const { type, payload } = action
        switch (type) {
            case ACTION_SET_DEPARTDATE:
                return payload
            default:
        }
        return state
    },
    arriveDate(state = Date.now(), action) {
        const { type, payload } = action
        switch (type) {
            case ACTION_SET_ARRIVEDATE:
                return payload
            default:
        }
        return state
    },
    departTimeStr(state = null, action) {
        const { type, payload } = action
        switch (type) {
            case ACTION_SET_DEPARTTIMESTR:
                return payload
            default:
        }
        return state
    },
    arriveTimeStr(state = null, action) {
        const { type, payload } = action
        switch (type) {
            case ACTION_SET_ARRIVETIMESTR:
                return payload
            default:
        }
        return state
    },
    departStation(state = null, action) {
        const { type, payload } = action
        switch (type) {
            case ACTION_SET_DEPARTSTATION:
                return payload
            default:
        }
        return state
    },
    arriveStation(state = null, action) {
        const { type, payload } = action
        switch (type) {
            case ACTION_SET_ARRIVESTATION:
                return payload
            default:
        }
        return state
    },
    trainNumber(state = null, action) {
        const { type, payload } = action
        switch (type) {
            case ACTION_SET_TRAINNUMBER:
                return payload
            default:
        }
        return state
    },
    durationsStr(state = null, action) {
        const { type, payload } = action
        switch (type) {
            case ACTION_SET_DURATIONSSTR:
                return payload
            default:
        }
        return state
    },
    tickets(state = [], action) {
        const { type, payload } = action
        switch (type) {
            case ACTION_SET_TICKETS:
                return payload
            default:
        }
        return state
    },
    isScheduleVisible(state = false, action) {
        const { type, payload } = action
        switch (type) {
            case ACTION_SET_ISSCHEDULEVISIBLE:
                return payload
            default:
        }
        return state
    },
    searchParsed(state = false, action) {
        const { type, payload } = action
        switch (type) {
            case ACTION_SET_SEARCHPARSED:
                return payload
            default:
        }
        return state
    },
}
