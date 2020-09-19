import React, { memo } from 'react'
import classNames from 'classnames'
import protoTypes from 'prop-types'
import './Menu.css'

// 菜单每一项子组件
const MenuItem = memo((props) => {
    const { onPress, title, value, active } = props
    return (
        <li className={classNames({ active })} onClick={() => onPress(value)}>
            {title}
        </li>
    )
})

const Menu = memo((props) => {
    // options来自actions的定义
    const { show, options, onPress, hideMenu } = props
    return (
        <div>
            {/* 点击关闭浮层 */}
            {show && (
                <div className="menu-mask" onClick={() => hideMenu()}></div>
            )}

            <div
                className={classNames('menu', {
                    show,
                })}
            >
                <div className="menu-title"></div>
                <ul>
                    {/* options才存在渲染 */}
                    {options &&
                        options.map((item) => {
                            return (
                                <MenuItem
                                    key={item.value}
                                    {...item}
                                    onPress={onPress}
                                />
                            )
                        })}
                </ul>
            </div>
        </div>
    )
})

Menu.protoTypes = {
    show: protoTypes.bool.isRequired,
    options: protoTypes.array.isRequired,
    onPress: protoTypes.func.isRequired,
    hideMenu: protoTypes.func.isRequired,
}

export default Menu
