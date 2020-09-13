import React, { memo, useMemo } from 'react'
import './Passengers.css'

const Passenger = memo((props) => {
    const {
        id,
        name,
        // followAdult,
        ticketType,
        licenceNumb,
        gender,
        birthday,
        onRemove,
        onUpdate,
        showGenderMenu,
        showFollowAdultMenu,
        showTicketTypeMenu,
        followAdultName,
    } = props

    const isAdult = ticketType === 'adult'

    return (
        <li className="passenger">
            <i className="delete" onClick={() => onRemove(id)}>
                -
            </i>

            <ol className="items">
                <li className="item">
                    <label className="label name">姓名</label>
                    <input
                        type="text"
                        className="input name"
                        placeholder="乘客姓名"
                        value={name}
                        onChange={(e) => onUpdate(id, { name: e.target.value })}
                    />
                    <label
                        className="ticket-type"
                        onClick={() => showTicketTypeMenu(id)}
                    >
                        {isAdult ? '成人票' : '儿童票'}
                    </label>
                </li>
                {isAdult && (
                    <li className="item">
                        <label className="label licenceNo">身份证</label>
                        <input
                            type="text"
                            className="input licenceNo"
                            placeholder="证件号码"
                            value={licenceNumb}
                            onChange={(e) =>
                                onUpdate(id, { licenceNumb: e.target.value })
                            }
                        />
                    </li>
                )}
                {!isAdult && (
                    <li className="item arrow">
                        <label className="label gender">性别</label>
                        <input
                            type="text"
                            className="input licenceNo"
                            placeholder="请选择"
                            onClick={() => showGenderMenu(id)}
                            value={
                                gender === 'male'
                                    ? '男'
                                    : gender === 'female'
                                    ? '女'
                                    : ''
                            }
                            readOnly
                        />
                    </li>
                )}
                {!isAdult && (
                    <li className="item">
                        <label className="label birthday">出生日期</label>
                        <input
                            type="text"
                            className="input birthday"
                            placeholder="如 19950808"
                            value={birthday}
                            onChange={(e) =>
                                onUpdate(id, { birthday: e.target.value })
                            }
                        />
                    </li>
                )}
                {!isAdult && (
                    <li className="item arrow">
                        <label className="label followAdult">同行成人</label>
                        <input
                            type="text"
                            className="input followAdult"
                            placeholder="请选择"
                            value={followAdultName}
                            onClick={() => {
                                showFollowAdultMenu(id)
                            }}
                            readOnly
                        />
                    </li>
                )}
            </ol>
        </li>
    )
})

const Passengers = memo((props) => {
    const {
        passengers,
        createAdult,
        createChild,
        removePassenger,
        updatePassenger,
        showGenderMenu,
        showFollowAdultMenu,
        showTicketTypeMenu,
    } = props

    //成人名字隐射
    const nameMap = useMemo(() => {
        const ret = {}
        for (let p of passengers) {
            ret[p.id] = p.name
        }
        return ret
    }, [passengers])

    return (
        <div className="passengers">
            <ul>
                {passengers.map((passenger) => {
                    return (
                        <Passenger
                            {...passenger}
                            followAdultName={nameMap[passenger.followAdult]}
                            showGenderMenu={showGenderMenu}
                            showTicketTypeMenu={showTicketTypeMenu}
                            showFollowAdultMenu={showFollowAdultMenu}
                            key={passenger.id}
                            onUpdate={updatePassenger}
                            onRemove={removePassenger}
                        />
                    )
                })}
            </ul>
            <section className="add">
                <div className="adult" onClick={() => createAdult()}>
                    添加成人
                </div>
                <div className="child" onClick={() => createChild()}>
                    添加儿童
                </div>
            </section>
        </div>
    )
})

export default Passengers
