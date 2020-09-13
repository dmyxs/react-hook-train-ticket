import React, { memo, useState, useCallback, useMemo, useContext } from 'react'
import URI from 'urijs'
import dayjs from 'dayjs'
import { TrainContext } from './context'
import './Candidate.css'

//选票及跳转
const Channel = memo((props) => {
    const { name, desc, type } = props

    //使用useContext获取数据
    const {
        trainNumber,
        departStation,
        arriveStation,
        departDate,
    } = useContext(TrainContext)

    const src = useMemo(() => {
        return new URI('order.html')
            .setSearch('trainNumber', trainNumber)
            .setSearch('dStation', departStation)
            .setSearch('aStation', arriveStation)
            .setSearch('type', type)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .toString()
    }, [type, trainNumber, departStation, arriveStation, departDate])

    return (
        <div className="channel">
            <div className="middle">
                <div className="name">{name}</div>
                <div className="desc">{desc}</div>
            </div>
            <a href={src} className="buy-wrapper">
                <div className="buy">买票</div>
            </a>
        </div>
    )
})

//坐席选择
const Seat = memo((props) => {
    const {
        type,
        priceMsg,
        ticketLeft,
        channels,
        expanded,
        onToggle,
        index,
    } = props
    return (
        <li>
            <div className="bar" onClick={() => onToggle(index)}>
                <span className="seat">{type}</span>
                <span className="price">
                    <i>￥</i>
                    {priceMsg}
                </span>
                <button className="btn">{expanded ? '收起' : '预定'}</button>
                <span className="num">{ticketLeft}</span>
            </div>
            <div
                className="channels"
                style={{ height: expanded ? channels.length * 55 + 'px' : 0 }}
            >
                {channels.map((channel) => {
                    return (
                        <Channel key={channel.name} {...channel} type={type} />
                    )
                })}
            </div>
        </li>
    )
})

const Candidate = memo((props) => {
    const { tickets } = props

    //动画效果依赖
    const [expandedIndex, setExpandedIndex] = useState(-1)

    const onToggle = useCallback(
        (index) => {
            setExpandedIndex(index === expandedIndex ? -1 : index)
        },
        [expandedIndex]
    )

    return (
        <div className="candidate">
            <ul>
                {tickets.map((ticket, index) => {
                    return (
                        <Seat
                            index={index}
                            onToggle={onToggle}
                            //序号相等才是true，才做展开
                            expanded={expandedIndex === index}
                            {...ticket}
                            key={ticket.type}
                        />
                    )
                })}
            </ul>
        </div>
    )
})

export default Candidate
