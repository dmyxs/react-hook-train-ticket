import React from 'react'
import './DateSelector.css'
import classnames from 'classnames'
import Header from './Header'
import { h0 } from './../utils/fp'

function Day(props) {
    const { day, onSelect } = props

    //当月的前后如果是为空的日期，显示特殊的td
    if (!day) {
        return <td className="null"></td>
    }

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

    const dateString = now === day ? '今天' : new Date(day).getDate()

    return (
        <td className={classnames(classes)} onClick={() => onSelect(day)}>
            {dateString}
        </td>
    )
}

function Week(props) {
    const { days, onSelect } = props
    return (
        <tr className="date-table-days">
            {days.map((day, index) => {
                return <Day key={index} day={day} onSelect={onSelect} />
            })}
        </tr>
    )
}

function Month(props) {
    const { startingTimeInMonth, onSelect } = props
    const startDay = new Date(startingTimeInMonth)
    const currentDay = new Date(startingTimeInMonth)

    let days = []
    while (currentDay.getMonth() === startDay.getMonth()) {
        days.push(currentDay.getTime())
        currentDay.setDate(currentDay.getDate() + 1)
    }

    //月前的补齐操作
    days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
        .fill(null)
        .concat(days)

    //月尾的补齐操作
    const lastDay = new Date(days[days.length - 1])

    days = days.concat(
        new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0).fill(null)
    )

    const weeks = []
    for (let row = 0; row < days.length / 7; ++row) {
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
                    return <Week key={index} days={week} onSelect={onSelect} />
                })}
            </tbody>
        </table>
    )
}

export default function DateSelector(props) {
    const { show, onSelect, onBack } = props

    const now = new Date()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    now.setMilliseconds(0)
    now.setDate(1) //把日期重置为当月的1号

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
}
