export const ACTION_SET_TRAINNUMBER = 'ACTION_SET_TRAINNUMBER'
export const ACTION_SET_DEPARTSTATION = 'ACTION_SET_DEPARTSTATION'
export const ACTION_SET_ARRIVESTATION = 'ACTION_SET_ARRIVESTATION'
export const ACTION_SET_SEATTYPE = 'ACTION_SET_SEATTYPE'
export const ACTION_SET_DEPARTDATE = 'ACTION_SET_DEPARTDATE'
export const ACTION_SET_ARRIVEDATE = 'ACTION_SET_ARRIVEDATE'
export const ACTION_SET_DEPARTTIMESTR = 'ACTION_SET_DEPARTTIMESTR'
export const ACTION_SET_ARRIVETIMESTR = 'ACTION_SET_ARRIVETIMESTR'
export const ACTION_SET_DURATIONSTR = 'ACTION_SET_DURATIONSTR'
export const ACTION_SET_PRICE = 'ACTION_SET_PRICE'
export const ACTION_SET_PASSENGERS = 'ACTION_SET_PASSENGERS'
export const ACTION_SET_MENU = 'ACTION_SET_MENU'
export const ACTION_SET_ISMENUVISIBLE = 'ACTION_SET_ISMENUVISIBLE'
export const ACTION_SET_SEARCHPARSED = 'ACTION_SET_SEARCHPARSED'

export function setTrainNumber(trainNumber) {
    return {
        type: ACTION_SET_TRAINNUMBER,
        payload: trainNumber,
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
export function setSeatType(seatType) {
    return {
        type: ACTION_SET_SEATTYPE,
        payload: seatType,
    }
}
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
export function setDurationStr(durationStr) {
    return {
        type: ACTION_SET_DURATIONSTR,
        payload: durationStr,
    }
}
export function setPrice(price) {
    return {
        type: ACTION_SET_PRICE,
        payload: price,
    }
}
export function setPassengers(passengers) {
    return {
        type: ACTION_SET_PASSENGERS,
        payload: passengers,
    }
}
export function setMenu(menu) {
    return {
        type: ACTION_SET_MENU,
        payload: menu,
    }
}
export function setIsMenuVisible(isMenuVisible) {
    return {
        type: ACTION_SET_ISMENUVISIBLE,
        payload: isMenuVisible,
    }
}
export function setSearchParsed(searchParsed) {
    return {
        type: ACTION_SET_SEARCHPARSED,
        payload: searchParsed,
    }
}

//发送请求
export function fetchInitial(url) {
    return (dispatch, getState) => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                const {
                    arriveDate,
                    durationStr,
                    arriveTimeStr,
                    departTimeStr,
                    price,
                } = data

                dispatch(setDepartTimeStr(departTimeStr))
                dispatch(setArriveTimeStr(arriveTimeStr))
                dispatch(setDurationStr(durationStr))
                dispatch(setArriveDate(arriveDate))
                dispatch(setPrice(price))
            })
    }
}

let passengerID = 0

export function createAdult() {
    return (dispatch, getState) => {
        const { passengers } = getState()

        //如果成人某些字段为空，不允许添加成人
        for (let passenger of passengers) {
            const keys = Object.keys(passenger)
            for (let key of keys) {
                if (!passenger[key]) {
                    return
                }
            }
        }

        dispatch(
            setPassengers([
                ...passengers,
                {
                    id: ++passengerID,
                    name: '',
                    ticketType: 'adult',
                    licenceNumb: '',
                    seat: 'Z',
                },
            ])
        )
    }
}

export function createChild() {
    return (dispatch, getState) => {
        const { passengers } = getState()

        let adultFound = null

        for (let passenger of passengers) {
            const keys = Object.keys(passenger)
            for (let key of keys) {
                if (!passenger[key]) {
                    return
                }
            }

            if (passenger.ticketType === 'adult') {
                adultFound = passenger.id
            }
        }

        if (!adultFound) {
            alert('请输入成人信息')
            return
        }

        dispatch(
            setPassengers([
                ...passengers,
                {
                    id: ++passengerID,
                    name: '',
                    gender: 'none',
                    birthday: '',
                    followAdult: adultFound,
                    ticketType: 'child',
                    seat: 'Z',
                },
            ])
        )
    }
}

//删除乘客
export function removePassenger(id) {
    return (dispatch, getState) => {
        const { passengers } = getState()
        //删除：绑定孩子的成人被删除，孩子也要被删除
        const newPassengers = passengers.filter(
            (i) => i.id !== id && id.followAdult !== id
        )
        dispatch(setPassengers(newPassengers))
    }
}

//更新乘客信息
export function updatePassenger(id, data, keysToBeRemoved = []) {
    return (dispatch, getState) => {
        const { passengers } = getState()

        for (let i = 0; i < passengers.length; ++i) {
            if (passengers[i].id === id) {
                const newPassengers = [...passengers]
                newPassengers[i] = Object.assign({}, passengers[i], data)

                for (let key of keysToBeRemoved) {
                    delete newPassengers[i][key]
                }

                dispatch(setPassengers(newPassengers))
                break
            }
        }
    }
}

//显示菜单
export function showMenu(menu) {
    return (dispatch) => {
        dispatch(setMenu(menu))
        dispatch(setIsMenuVisible(true))
    }
}

//关闭菜单
export function hideMenu() {
    return setIsMenuVisible(false)
}

//展示gender菜单
export function showGenderMenu(id) {
    return (dispatch, getState) => {
        const { passengers } = getState()

        const passenger = passengers.find((passengers) => passengers.id === id)
        if (!passenger) {
            return
        } else {
            dispatch(
                showMenu({
                    onPress(gender) {
                        dispatch(updatePassenger(id, { gender }))
                        dispatch(hideMenu())
                    },
                    options: [
                        {
                            title: '男',
                            value: 'male',
                            active: 'male' === passenger.gender,
                        },
                        {
                            title: '女',
                            value: 'female',
                            active: 'female' === passenger.gender,
                        },
                    ],
                })
            )
        }
    }
}

//展示成人信息
export function showFollowAdultMenu(id) {
    return (dispatch, getState) => {
        const { passengers } = getState()

        const passenger = passengers.find((passengers) => passengers.id === id)
        if (!passenger) {
            return
        }
        dispatch(
            showMenu({
                onPress(followAdult) {
                    dispatch(updatePassenger(id, { followAdult }))
                    dispatch(hideMenu())
                },
                options: passengers
                    .filter((passenger) => passenger.ticketType === 'adult')
                    .map((adult) => {
                        return {
                            title: adult.name,
                            value: adult.id,
                            active: adult.id === passenger.followAdult,
                        }
                    }),
            })
        )
    }
}

export function showTicketTypeMenu(id) {
    return (dispatch, getState) => {
        const { passengers } = getState()
        const passenger = passengers.filter((passenger) => passenger.id === id)
        if (!passenger) {
            return
        }
        dispatch(
            showMenu({
                onPress(ticketType) {
                    if ('adult' === ticketType) {
                        dispatch(
                            updatePassenger(
                                id,
                                {
                                    ticketType,
                                    licenceNumb: '',
                                },
                                ['gender', 'followAdult', 'birthday']
                            )
                        )
                    } else {
                        const adult = passengers.find(
                            (passengers) =>
                                passengers.id !== id &&
                                passengers.ticketType === 'adult'
                        )
                        if (adult) {
                            dispatch(
                                updatePassenger(
                                    id,
                                    {
                                        ticketType,
                                        gender: '',
                                        followAdult: adult.id,
                                        birthday: '',
                                    },
                                    ['licenceNumb']
                                )
                            )
                        } else {
                            alert('没有其他成人乘客')
                        }
                    }

                    dispatch(hideMenu())
                },
                options: [
                    {
                        title: '成人票',
                        value: 'adult',
                        active: 'adult' === passenger.ticketType,
                    },
                    {
                        title: '儿童票',
                        value: 'child',
                        active: 'child' === passenger.ticketType,
                    },
                ],
            })
        )
    }
}
