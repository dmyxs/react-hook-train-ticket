import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { h0 } from '../../../utils/fp'
import dayjs from 'dayjs'
import './DepartDate.css'

//该组件可以不建议使用memo优化，因为输入不只来源于props，还有h0()
const DepartDate = function DepartDate(props) {
    const { time, showDate } = props

    //h0OfDepart是没有时分秒的时间，不去掉的时间会时刻变动，使用useMemo就没有意义了
    const h0OfDepart = h0(time)
    const departDate = new Date(h0OfDepart)

    //dayjs将时间戳转换成时间字符串
    const departDateString = useMemo(() => {
        return dayjs(h0OfDepart).format('YYYY-MM-DD')
    }, [h0OfDepart])

    //判断一下是否是今天：传入值的时间和  h0(不传是当天)  相比
    const isToday = h0OfDepart === h0()
    // console.log(isToday)
    // console.log(h0OfDepart + '------' + h0())

    //显示周：字符串拼接，departDate.getDay()是获取当前星期几
    const weekString =
        '周' +
        ['日', '一', '二', '三', '四', '五', '六'][departDate.getDay()] +
        (isToday ? ' (今天)' : '')

    return (
        <div className="depart-date" onClick={() => showDate()}>
            <input type="hidden" name="date" value={departDateString} />
            {departDateString} <span className="depart-week">{weekString}</span>
        </div>
    )
}

DepartDate.propTypes = {
    time: PropTypes.number.isRequired,
    showDate: PropTypes.func.isRequired,
}

export default DepartDate
