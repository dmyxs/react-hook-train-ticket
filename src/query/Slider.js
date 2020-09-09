import React, { memo, useState, useMemo, useRef, useEffect } from 'react'
import leftPad from 'left-pad'
import './Slider.css'

const Slider = memo((props) => {
    const {
        title,
        currentStartHours,
        currentEndHours,
        onStartChanged,
        onEndChanged,
    } = props

    const startHandle = useRef()
    const endHandle = useRef()

    //使用ref，可以跨越组件渲染周期保存数据，并且不会触发重渲染
    //记录上一次滑动
    const lastStartX = useRef()
    const lastEndX = useRef()

    //用于测量屏幕宽度
    const range = useRef()
    const rangeWidth = useRef()

    //二级缓冲区
    const [start, setStart] = useState(() => (currentStartHours / 24) * 100)
    const [end, setEnd] = useState(() => (currentEndHours / 24) * 100)

    //判断处理边界问题，防止溢出
    const startPercent = useMemo(() => {
        if (start > 100) {
            return 100
        }
        if (start < 0) {
            return 0
        }
        return start
    }, [start])

    const EndPercent = useMemo(() => {
        if (end > 100) {
            return 100
        }
        if (end < 0) {
            return 0
        }
        return end
    }, [end])

    //把时间转成24小时
    const startHours = useMemo(() => {
        return Math.round((startPercent * 24) / 100)
    }, [startPercent])

    const EndHours = useMemo(() => {
        return Math.round((EndPercent * 24) / 100)
    }, [EndPercent])

    ////转成文字
    const startText = useMemo(() => {
        //补0操作，使用leftPad这个库
        return leftPad(startHours, 2, '0') + ':00'
    }, [startHours])

    const endText = useMemo(() => {
        return leftPad(EndHours, 2, '0') + ':00'
    }, [EndHours])

    //测量宽度
    useEffect(() => {
        rangeWidth.current = parseFloat(
            window.getComputedStyle(range.current).width
        )
    }, [])

    //使用定义滑动事件
    useEffect(() => {
        //左边滑块事件
        startHandle.current.addEventListener('touchstart', onStartTouchBegin)
        startHandle.current.addEventListener('touchmove', onStartTouchMove)

        //右边滑块事件
        endHandle.current.addEventListener('touchstart', onEndTouchBegin)
        endHandle.current.addEventListener('touchmove', onEndTouchMove)

        //解绑
        return () => {
            startHandle.current.removeEventListener(
                'touchstart',
                onStartTouchBegin
            )
            startHandle.current.removeEventListener(
                'touchmove',
                onStartTouchMove
            )
            endHandle.current.removeEventListener('touchstart', onEndTouchBegin)
            endHandle.current.removeEventListener('touchmove', onEndTouchMove)
        }
    })

    function onStartTouchBegin(e) {
        const touch = e.targetTouches[0]
        //返回的是ref对象，所有是使用current
        lastStartX.current = touch.pageX
    }
    function onEndTouchBegin(e) {
        const touch = e.targetTouches[0]
        lastEndX.current = touch.pageX
    }
    function onStartTouchMove(e) {
        const touch = e.targetTouches[0]
        //计算滑动的距离，这次的横坐标 - 上一次的横坐标
        const distance = touch.pageX - lastStartX.current
        //更新上一次横坐标
        lastStartX.current = touch.pageX

        setStart((start) => start + (distance / rangeWidth.current) * 100)
    }

    function onEndTouchMove(e) {
        const touch = e.targetTouches[0]
        const distance = touch.pageX - lastEndX.current
        lastEndX.current = touch.pageX

        setEnd((end) => end + (distance / rangeWidth.current) * 100)
    }

    return (
        <div className="option">
            <h3>{title}</h3>
            <div className="range-slider">
                {/* 亮线 */}
                <div className="slider" ref={range}>
                    {/* 蓝线 */}
                    <div
                        className="slider-range"
                        style={{
                            left: startPercent + '%',
                            width: EndPercent - startPercent + '%',
                        }}
                    ></div>
                    {/* 左滑块 */}
                    <i
                        ref={startHandle}
                        className="slider-handle"
                        style={{
                            left: startPercent + '%',
                        }}
                    >
                        <span>{startText}</span>
                    </i>
                    {/* 右滑块 */}
                    <i
                        ref={endHandle}
                        className="slider-handle"
                        style={{
                            left: EndPercent + '%',
                        }}
                    >
                        <span>{endText}</span>
                    </i>
                </div>
            </div>
        </div>
    )
})

export default Slider
