import React, { memo, useState, useMemo, useRef, useEffect } from 'react'
import leftPad from 'left-pad'
import useWinSize from './../utils/useWinSize'
import './Slider.css'

//时间滑块
//拖动原理：响应DOM元素的touch事件，计算touch事件的当前位置和上一次事件的距离，再来移动滑块
const Slider = memo((props) => {
    const {
        title,
        currentStartHours, //0
        currentEndHours, //24
        onStartChanged,
        onEndChanged,
    } = props

    //获取窗口宽度，做兼容性处理
    const winSize = useWinSize()

    //用于测量可滑动区域的容器宽度
    const range = useRef()
    //用于保存测量后的屏幕宽度数据，因为屏幕不是经常变化
    const rangeWidth = useRef()

    //用于绑定滑块，获取DOM节点，绑定事件
    const startHandle = useRef()
    const endHandle = useRef()

    //ref可以存储数据：可以跨越组件渲染周期保存数据，并且不会触发重渲染，ref可以存储任何数据
    //记录上一次滑动
    const lastStartX = useRef()
    const lastEndX = useRef()

    //使用Ref记录上一次的值，用于是否更新数据，因为useState使用的是延迟初始化，只用到了一次
    const prevCurrentStartHours = useRef(currentStartHours)
    const prevCurrentEndHours = useRef(currentEndHours)

    //二级缓冲区，转换成百分比，这里只有初次渲染才更新数据，过后即使currentStartHours发生变化，也不会改变
    //如：1 / 24 * 100 = 4.166
    const [start, setStart] = useState(() => (currentStartHours / 24) * 100)
    const [end, setEnd] = useState(() => (currentEndHours / 24) * 100)

    //判断处理边界问题，防止溢出(到头还可以拖动)
    const startPercent = useMemo(() => {
        if (start > 90) {
            return 90
        }
        if (start < 0) {
            return 0
        }
        return start
    }, [start])

    const endPercent = useMemo(() => {
        if (end > 100) {
            return 100
        }
        if (end < 10) {
            return 10
        }
        return end
    }, [end])

    //因为因为useState使用的是延迟初始化，如果要重置要更新数据的话，还需要再判断一次，如果记录的值不等于上次的值，就更新
    //等于shouldComponentUpdate
    if (prevCurrentStartHours.current !== currentStartHours) {
        setStart((currentStartHours / 24) * 100)
        //更新过后再保存最新的值
        prevCurrentStartHours.current = currentStartHours
    }
    if (prevCurrentEndHours.current !== currentEndHours) {
        setEnd((currentStartHours / 24) * 100)
        prevCurrentEndHours.current = currentEndHours
    }

    //把百分比转成24小时时间：5.5844 * 24 / 100 = 1.340256
    const startHours = useMemo(() => {
        return Math.round((startPercent * 24) / 100)
    }, [startPercent])

    const endHours = useMemo(() => {
        return Math.round((endPercent * 24) / 100)
    }, [endPercent])

    //24小时时间展示文案 + 00的操作，如：2:00
    const startText = useMemo(() => {
        //前面补0操作，使用leftPad这个库
        return leftPad(startHours, 2, '0') + ':00'
    }, [startHours])

    const endText = useMemo(() => {
        return leftPad(endHours, 2, '0') + ':00'
    }, [endHours])

    //获取可滑动区域的宽度，依赖宽度，一旦浏览器的宽度发生变化，就会重新计算
    useEffect(() => {
        //console.log(parseFloat(window.getComputedStyle(range.current).width)) //225.113px  转数字->  225.113
        //rangeWidth.current = 225.113
        rangeWidth.current = parseFloat(
            // 计算元素的宽度
            window.getComputedStyle(range.current).width
        )
    }, [winSize.width])

    //定义触摸事件
    function onStartTouchBegin(e) {
        //获取触摸的第一个点
        const touch = e.targetTouches[0]
        //记录最后的节点，返回的是ref对象，使用current
        lastStartX.current = touch.pageX //76.xxx
    }
    function onEndTouchBegin(e) {
        const touch = e.targetTouches[0]
        lastEndX.current = touch.pageX
    }

    //定义移动事件
    function onStartTouchMove(e) {
        //事件触摸对象
        const touch = e.targetTouches[0]
        //计算滑动的距离，这次的横坐标（划过后的值，浏览器会计算出来） - 上一次的横坐标
        const distance = touch.pageX - lastStartX.current
        //更新上一次横坐标
        lastStartX.current = touch.pageX

        //更新滑块的位置：原来的位置 + (滑动的距离 / 总宽度 * 100)
        setStart((start) => start + (distance / rangeWidth.current) * 100)
    }
    function onEndTouchMove(e) {
        const touch = e.targetTouches[0]
        const distance = touch.pageX - lastEndX.current
        lastEndX.current = touch.pageX

        setEnd((end) => end + (distance / rangeWidth.current) * 100)
    }

    //绑定滑动事件
    // startHandle.current才可以获取Ref对象
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

    //上传数据给一级缓冲区：监控startHours，一旦发生变化，调用一级缓存区的onStartChanged函数
    useEffect(() => {
        onStartChanged(startHours)
    }, [onStartChanged, startHours])
    useEffect(() => {
        onEndChanged(endHours)
    }, [endHours, onEndChanged])

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
                            width: endPercent - startPercent + '%',
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
                            left: endPercent + '%',
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
