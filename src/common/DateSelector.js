import React, { memo } from 'react'
import './DateSelector.css'
import classnames from 'classnames'
import Header from './Header'
import { h0 } from './../utils/fp'

const Day = memo((props) => {
    const { day, onSelect } = props

    //当月的前后补齐，如果是为空的日期，显示特殊的td
    if (!day) {
        return <td className="null"></td>
    }
    //存储类名，当天的日期所使用
    const classes = []

    const now = h0()
    //如果是过去的时间，不可选
    if (day < now) {
        classes.push('disabled')
    }

    //如果是周6周日
    if ([6, 0].includes(new Date(day).getDay())) {
        classes.push('weekend')
    }

    //判断是否是今天
    const dateString = now === day ? '今天' : new Date(day).getDate()

    return (
        <td className={classnames(classes)} onClick={() => onSelect(day)}>
            {dateString}
        </td>
    )
})

const Week = memo((props) => {
    const { week, onSelect } = props
    return (
        <tr className="date-table-days">
            {week.map((day, index) => {
                return <Day key={index} day={day} onSelect={onSelect} />
            })}
        </tr>
    )
})

const Month = memo((props) => {
    const { startingTimeInMonth, onSelect } = props
    const startDay = new Date(startingTimeInMonth)
    const currentDay = new Date(startingTimeInMonth)
    let days = []
    //只要是本月，天数是一样的，就一直加，直到设置的时间+1天后不再是本月，就停止循环
    while (currentDay.getMonth() === startDay.getMonth()) {
        //获取到的时间是当月的第一天时间
        days.push(currentDay.getTime())
        //设置时间 + 1 天
        currentDay.setDate(currentDay.getDate() + 1)
    }

    //月前的补齐操作：
    //规律与逻辑：判断是否是星期天？不是为true， 星期几 - 1 = 补齐数, 星期天补齐6个
    days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
        .fill(null) //填充null
        .concat(days) //合并

    //月尾的补齐操作
    //获取最后一天
    const lastDay = new Date(days[days.length - 1])
    //规律与逻辑： 判断是否是星期天？不是为true，7 - 星期几 = 补齐数
    days = days.concat(
        new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0).fill(null)
    )

    //获取周
    const weeks = []
    for (let row = 0; row < days.length / 7; ++row) {
        //截取操作
        const week = days.slice(row * 7, (row + 1) * 7)
        weeks.push(week)
    }

    return (
        <table className="date-table">
            <thead>
                <tr>
                    <td colSpan="7">
                        <h5>
                            {startDay.getFullYear()}年{startDay.getMonth() + 1}
                            月
                        </h5>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr className="data-table-weeks">
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th className="weekend">周六</th>
                    <th className="weekend">周日</th>
                </tr>
                {weeks.map((week, index) => {
                    return <Week key={index} week={week} onSelect={onSelect} />
                })}
            </tbody>
        </table>
    )
})

const DateSelector = memo((props) => {
    const { show, onSelect, onBack } = props

    const now = new Date()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    now.setMilliseconds(0)
    now.setDate(1) //把日期重置为当月的1号0时刻，这样才比较好渲染

    //三个月时间的数组
    const monthSequence = [now.getTime()]

    now.setMonth(now.getMonth() + 1) //获取下一个月
    monthSequence.push(now.getTime()) //获取下一个月的时间

    now.setMonth(now.getMonth() + 1) //获取下下一个月
    monthSequence.push(now.getTime()) //获取下下一个月的时间

    return (
        <div className={classnames('date-selector', { hidden: !show })}>
            <Header title="日期选择" onBack={onBack} />
            <div className="date-selector-tables">
                {monthSequence.map((mouth) => {
                    return (
                        <Month
                            key={mouth}
                            startingTimeInMonth={mouth}
                            onSelect={onSelect}
                        ></Month>
                    )
                })}
            </div>
        </div>
    )
})

export default DateSelector
