import React, { memo, useState, useCallback } from 'react'
import './Bottom.css'
import { ORDER_DEPART } from './constant'
import classnames from 'classnames'
import Slider from './Slider'

const Filter = memo(function Filter(props) {
    const { name, checked, toggle, value } = props
    return (
        //点击时，把value传递给useState的更新函数
        <li className={classnames({ checked })} onClick={() => toggle(value)}>
            {name}
        </li>
    )
})

const Option = memo(function Option(props) {
    const { title, options, checkedMap, update } = props
    console.log(checkedMap)

    //中间函数
    const toggle = useCallback(
        (value) => {
            //精华，选中还是取消的判断，先复制，再判断
            const newCheckedMap = { ...checkedMap }
            if (value in checkedMap) {
                delete newCheckedMap[value]
            } else {
                newCheckedMap[value] = true
            }
            update(newCheckedMap)
        },
        [checkedMap, update]
    )

    return (
        <div className="options">
            <h3>{title}</h3>
            <ul>
                {options.map((option) => {
                    return (
                        <Filter
                            key={option.value}
                            toggle={toggle}
                            {...option}
                            checked={option.value in checkedMap}
                        />
                    )
                })}
            </ul>
        </div>
    )
})

const BottomModal = memo(function BottomModal(props) {
    const {
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
        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setCheckedDepartStations,
        setCheckedArriveStations,
        setDepartTimeEnd,
        setDepartTimeStart,
        setArriveTimeStart,
        setArriveTimeEnd,
        toggleIsFilterVisible,
    } = props

    //本地缓冲区
    const [localCheckedTicketTypes, setLocalCheckedTicketTypes] = useState(
        //延迟初始化，只有在第一次才渲染，避免浪费性能
        () => {
            return {
                ...checkedTicketTypes,
            }
        }
    )
    const [localCheckedTrainTypes, setLocalCheckedTrainTypes] = useState(() => {
        return {
            ...checkedTrainTypes,
        }
    })
    const [
        localCheckedDepartStations,
        setLocalCheckedDepartStations,
    ] = useState(() => {
        return {
            ...checkedDepartStations,
        }
    })
    const [
        localCheckedArriveStations,
        setLocalCheckedArriveStations,
    ] = useState(() => {
        return {
            ...checkedArriveStations,
        }
    })
    const [localDepartTimeStart, setLocalDepartTimeStart] = useState(
        departTimeStart
    )
    const [localDepartTimeEnd, setLocalDepartTimeEnd] = useState(departTimeEnd)
    const [localArriveTimeStart, setLocalArriveTimeStart] = useState(
        arriveTimeStart
    )
    const [localArriveTimeEnd, setLocalArriveTimeEnd] = useState(arriveTimeEnd)

    //渲染内容
    const optionGroup = [
        {
            title: '坐席类型',
            options: ticketTypes, //数据数组
            checkedMap: localCheckedTicketTypes, //使用本地版本，是空对象
            update: setLocalCheckedTicketTypes, //更新函数放在该对象中，动态渲染，不用每个都传
        },
        {
            title: '车次类型',
            options: trainTypes,
            checkedMap: localCheckedTrainTypes,
            update: setLocalCheckedTrainTypes,
        },
        {
            title: '出发车站',
            options: departStations,
            checkedMap: localCheckedDepartStations,
            update: setLocalCheckedDepartStations,
        },
        {
            title: '到达车站',
            options: arriveStations,
            checkedMap: localCheckedArriveStations,
            update: setLocalCheckedArriveStations,
        },
    ]

    return (
        <div className="bottom-modal">
            <div className="bottom-dialog">
                <div className="bottom-dialog-content">
                    <div className="title">
                        <span className="reset">重置</span>
                        <span className="ok">确定</span>
                    </div>
                    <div className="option">
                        {optionGroup.map((item) => (
                            <Option key={item.title} {...item} />
                        ))}
                    </div>
                    <Slider
                        title="出发时间"
                        currentStartHours={localDepartTimeStart}
                        currentEndHours={localDepartTimeEnd}
                        onStartChanged={setLocalDepartTimeStart}
                        onEndChanged={setLocalDepartTimeEnd}
                    />
                    <Slider
                        title="到达时间"
                        currentStartHours={localArriveTimeStart}
                        currentEndHours={localArriveTimeEnd}
                        onStartChanged={setLocalArriveTimeStart}
                        onEndChanged={setLocalArriveTimeEnd}
                    />
                </div>
            </div>
        </div>
    )
})

const Bottom = memo(function Bottom(props) {
    const {
        highSpeed,
        orderType,
        onlyTickets,
        isFilterVisible,
        toggleOrderType,
        toggleHighSpeed,
        toggleOnlyTickets,
        toggleIsFilterVisible,

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

        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setCheckedDepartStations,
        setCheckedArriveStations,
        setDepartTimeEnd,
        setDepartTimeStart,
        setArriveTimeStart,
        setArriveTimeEnd,
    } = props
    return (
        <div className="bottom">
            <div className="bottom-filters">
                <span className="item" onClick={toggleOrderType}>
                    <i className="icon">&#xf065;</i>
                    {orderType === ORDER_DEPART ? '出发 早→晚' : '耗时 短→长'}
                </span>
                <span
                    className={highSpeed ? 'item item-on' : 'item'}
                    onClick={toggleHighSpeed}
                >
                    <i className="icon">{highSpeed ? '\uf43f' : '\uf43e'}</i>
                    只看高铁动车
                </span>
                <span
                    className={onlyTickets ? 'item item-on' : 'item'}
                    onClick={toggleOnlyTickets}
                >
                    <i className="icon">{onlyTickets ? '\uf43d' : '\uf43c'}</i>
                    只看有票
                </span>
                <span
                    className={isFilterVisible ? 'item item-on' : 'item'}
                    onClick={toggleIsFilterVisible}
                >
                    <i className="icon">{'\uf0f7'}</i>
                    综合筛选
                </span>
            </div>
            {isFilterVisible && (
                <BottomModal
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
                    setCheckedTicketTypes={setCheckedTicketTypes}
                    setCheckedTrainTypes={setCheckedTrainTypes}
                    setCheckedDepartStations={setCheckedDepartStations}
                    setCheckedArriveStations={setCheckedArriveStations}
                    setDepartTimeEnd={setDepartTimeEnd}
                    setDepartTimeStart={setDepartTimeStart}
                    setArriveTimeStart={setArriveTimeStart}
                    setArriveTimeEnd={setArriveTimeEnd}
                    toggleIsFilterVisible={toggleIsFilterVisible}
                />
            )}
        </div>
    )
})

export default Bottom
