import React, { memo } from 'react'
import switchImg from '../../imgs/switch.svg'
import './Joumey.css'

const Journey = memo((props) => {
    const { from, to, exchangeFromTo, showCitySelector } = props
    return (
        <div className="journey">
            <div
                className="journey-station"
                onClick={() => showCitySelector(true)}
            >
                <input
                    type="text"
                    readOnly
                    name="from" //发送请求依赖
                    value={from}
                    className="journey-input journey-from"
                />
            </div>
            {/* 切换按钮 */}
            <div className="journey-switch" onClick={() => exchangeFromTo()}>
                <img
                    className="journey-switch-reverse"
                    src={switchImg}
                    width="70"
                    height="40"
                    alt="switch"
                />
            </div>
            <div
                className="journey-station"
                onClick={() => showCitySelector(false)}
            >
                <input
                    type="text"
                    readOnly
                    name="to"
                    value={to}
                    className="journey-input journey-to"
                />
            </div>
        </div>
    )
})

export default Journey
