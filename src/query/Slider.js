import React, { memo, useState, useMemo, useRef, useEffect } from 'react'
import leftPad from 'left-pad'
import useWinSize from './../utils/useWinSize'
import './Slider.css'

//时间滑块
const Slider = memo((props) => {
    const {
        title,
        currentStartHours,
        currentEndHours,
        onStartChanged,
        onEndChanged,
    } = props

    //监听窗口宽度
    const winSize = useWinSize()

    //操作DOM元素，响应touch事件
    const startHandle = useRef()
    const endHandle = useRef()

    //使用ref，可以跨越组件渲染周期保存数据，并且不会触发重渲染,ref可以存储任何数据
    //记录上一次滑动
    const lastStartX = useRef()
    const lastEndX = useRef()

    //用于测量屏幕宽度
    const range = useRef()
    const rangeWidth = useRef()

    const prevCurrentStartHours = useRef(currentStartHours)
    const prevCurrentEndHours = useRef(currentEndHours)

    //二级缓冲区，转换成百分比，这里只有初次渲染才更新数据
    const [start, setStart] = useState(() => (currentStartHours / 24) * 100)
    const [end, setEnd] = useState(() => (currentEndHours / 24) * 100)

    //判断是否更新，如果记录的值不等于上次的值，就更新
    if (prevCurrentStartHours.current !== currentStartHours) {
        setStart((currentStartHours / 24) * 100)
        prevCurrentStartHours.current = currentStartHours
    }
    if (prevCurrentEndHours.current !== currentEndHours) {
        setEnd((currentStartHours / 24) * 100)
        prevCurrentEndHours.current = currentEndHours
    }

    //判断处理边界问题，防止溢出(到头还可以拖动)
    const startPercent = useMemo(() => {
        if (start > 100) {
            return 100
        }
        if (start < 0) {
            return 0
        }
        return start
    }, [start])
    // console.log(startPercent)

    const EndPercent = useMemo(() => {
        if (end > 100) {
            return 100
        }
        if (end < 0) {
            return 0
        }
        return end
    }, [end])

    //把百分比转成24小时时间
    const startHours = useMemo(() => {
        return Math.round((startPercent * 24) / 100)
    }, [startPercent])
    // console.log(startHours)

    const EndHours = useMemo(() => {
        return Math.round((EndPercent * 24) / 100)
    }, [EndPercent])

    //转换后的24小时时间文案 + 00的操作，如：2:00
    const startText = useMemo(() => {
        //补0操作，使用leftPad这个库
        return leftPad(startHours, 2, '0') + ':00'
    }, [startHours])

    const endText = useMemo(() => {
        return leftPad(EndHours, 2, '0') + ':00'
    }, [EndHours])

    //测量宽度，依赖宽度，一旦浏览器的宽度发生变化，就会重新计算
    useEffect(() => {
        rangeWidth.current = parseFloat(
            window.getComputedStyle(range.current).width
        )
    }, [winSize.width])

    //定义触摸事件
    function onStartTouchBegin(e) {
        const touch = e.targetTouches[0]
        //记录最后的节点，返回的是ref对象，所有是使用current
        lastStartX.current = touch.pageX
    }
    function onEndTouchBegin(e) {
        const touch = e.targetTouches[0]
        lastEndX.current = touch.pageX
    }

    //定义触摸移动事件
    function onStartTouchMove(e) {
        const touch = e.targetTouches[0]
        //计算滑动的距离，这次的横坐标 - 上一次的横坐标
        const distance = touch.pageX - lastStartX.current
        //更新上一次横坐标
        lastStartX.current = touch.pageX

        //更新滑块的位置：滑动的位置 / 宽度 * 100
        setStart((start) => start + (distance / rangeWidth.current) * 100)
    }
    function onEndTouchMove(e) {
        const touch = e.targetTouches[0]
        const distance = touch.pageX - lastEndX.current
        lastEndX.current = touch.pageX

        setEnd((end) => end + (distance / rangeWidth.current) * 100)
    }

    //绑定滑动事件
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
    }) //不提供参数，所以在每个渲染周期都会提供渲染一次

    //上传数据给bottom
    useEffect(() => {
        onStartChanged(startHours)
    }, [onStartChanged, startHours])
    useEffect(() => {
        onEndChanged(EndHours)
    }, [EndHours, onEndChanged])

    return (
        <div className="option">
            <h3>{title}</h3>
            <div className="range-slider">
                {/* 横线 */}
                <div className="slider" ref={range}>
                    {/* 亮线 */}
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
