//获取指定时间的0时刻时间撮，不传值，默认是今天
export function h0(timestamp = Date.now()) {
    const target = new Date(timestamp)

    //获取当天的0时刻：设置时，分，秒，毫秒为0：1598803200000
    target.setHours(0)
    target.setMinutes(0)
    target.setSeconds(0)
    target.setMilliseconds(0)
    return target.getTime()
}
