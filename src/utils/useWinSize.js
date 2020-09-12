//计算浏览器宽度的自定义hook函数

import { useState, useEffect } from 'react'

export default function useWinSize() {
    const [width, setWidth] = useState(document.documentElement.clientWidth)
    const [height, setHeight] = useState(document.documentElement.clientHeight)

    useEffect(() => {
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    function onResize() {
        setWidth(document.documentElement.clientWidth)
        setHeight(document.documentElement.clientHeight)
    }

    return { width, height }
}
