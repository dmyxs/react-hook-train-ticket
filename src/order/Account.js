import React, { memo, useState } from 'react'
import classnames from 'classnames'
import './Account.css'

const Account = memo((props) => {
    const { price, passengers } = props

    const [expanded, setExpanded] = useState(false)
    return (
        <div className="account">
            <div
                className={classnames('price', {
                    expanded,
                })}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="money">{passengers.length * price}</div>
                <div className="amount">支付金额</div>
            </div>
            <div className="button">提交订单</div>
            <div
                className={classnames('layer', {
                    hidden: !expanded,
                })}
                onClick={() => setExpanded(false)}
            ></div>
            <div
                className={classnames('detail', {
                    hidden: !expanded,
                })}
                onClick={() => setExpanded(false)}
            >
                <div className="title">金额详情</div>
                <ul>
                    <li>
                        <span>火车票</span>
                        <span>￥{price}</span>
                        <span>&#xD7; {passengers.length}</span>
                    </li>
                </ul>
            </div>
        </div>
    )
})

export default Account
