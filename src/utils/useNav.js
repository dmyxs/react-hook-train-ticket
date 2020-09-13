import { useCallback } from 'react'
import { h0 } from './fp'

//自定义hook
export default function useNav(departDate, dispatch, prevDate, nextDate) {
    //往后1天：目标日期 小于 今天  不可点
    const isPrevDisabled = h0(departDate) <= h0()
    // window.console.log(h0(departDate), h0());
    //往后20天：火车票只卖20天内的:目标日期 - 今天日期 大于20
    const isNextDisabled = h0(departDate) - h0() > 20 * 86400 * 1000

    const prev = useCallback(() => {
        //如果前一天不可点：true
        if (isPrevDisabled) {
            return
        }
        dispatch(prevDate())
    }, [dispatch, isPrevDisabled, prevDate])

    const next = useCallback(() => {
        if (isNextDisabled) {
            return
        }
        dispatch(nextDate())
    }, [dispatch, isNextDisabled, nextDate])

    return {
        isPrevDisabled,
        isNextDisabled,
        prev,
        next,
    }
}
