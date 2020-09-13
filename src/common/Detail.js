import React, { memo, useMemo } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import './Detail.css'

//时间挫转日期
function format(d) {
    const date = dayjs(d)
    //星期几使用locale本地化实现
    return date.format('MM-DD') + ' ' + date.locale('zh-cn').format('ddd')
}

const Detail = memo((props) => {
    const {
        departDate,
        arriveDate,
        departTimeStr,
        arriveTimeStr,
        trainNumber,
        departStation,
        arriveStation,
        durationsStr,
    } = props

    const departDateStr = useMemo(() => format(departDate), [departDate])
    const arriveDateStr = useMemo(() => format(arriveDate), [arriveDate])

    return (
        <div className="detail">
            <div className="content">
                <div className="left">
                    <p className="city">{departStation}</p>
                    <p className="time">{departTimeStr}</p>
                    <p className="date">{departDateStr}</p>
                </div>
                <div className="middle">
                    <p className="train-name">{trainNumber}</p>
                    {/* 使用后代组件实现个性化 */}
                    <p className="train-mid">{props.children}</p>
                    <p className="train-time">耗时{durationsStr}</p>
                </div>
                <div className="right">
                    <p className="city">{arriveStation}</p>
                    <p className="time">{arriveTimeStr}</p>
                    <p className="date">{arriveDateStr}</p>
                </div>
            </div>
        </div>
    )
})

export default Detail
