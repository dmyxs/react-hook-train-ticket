import React, { memo, useMemo } from 'react'
import './List.css'
import URI from 'urijs'

const ListItem = memo(function ListItem(props) {
    const {
        dTime, //出发时间
        aTime, //到达时间
        dStation, //出发车站
        aStation, //达到车站
        trainNumber, //车次
        date, //出发时间
        time, //运行时间
        priceMsg, //价格
        dayAfter, //是否跨越时间
    } = props

    //设置请求参数
    const url = useMemo(() => {
        return new URI('ticket.html')
            .setSearch('dStation', dStation)
            .setSearch('aStation', aStation)
            .setSearch('trainNumber', trainNumber)
            .setSearch('date', date)
            .toString()
    }, [dStation, aStation, trainNumber, date])

    return (
        <li className="list-item">
            <a href={url}>
                <span className="item-time">
                    <em>{dTime}</em>
                    <br />
                    <em className="em-light">
                        {aTime} <i className="time-after">{dayAfter}</i>
                    </em>
                </span>
                <span className="item-stations">
                    <em>
                        <i className="train-station train-start">始</i>
                        {dStation}
                    </em>
                    <br />
                    <em className="em-light">
                        <i className="train-station train-end">终</i>
                        {aStation}
                    </em>
                </span>
                <span className="item-train">
                    <em>{trainNumber}</em>
                    <br />
                    <em className="em-light">{time}</em>
                </span>
                <span className="item-ticket">
                    <em>{priceMsg}</em>
                    <br />
                    <em className="em-light-orange">可抢票</em>
                </span>
            </a>
        </li>
    )
})

const List = memo(function List(props) {
    const { list } = props
    return (
        <ul className="list">
            {list.map((item) => (
                <ListItem {...item} key={item.trainNumber} />
            ))}
        </ul>
    )
})

export default List
