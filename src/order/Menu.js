import React, { memo } from 'react'
import classNames from 'classnames'
import './Menu.css'

const MenuItem = memo((props) => {
    const { onPress, title, value, active } = props
    return (
        <li className={classNames({ active })} onClick={() => onPress(value)}>
            {title}
        </li>
    )
})

const Menu = memo((props) => {
    const { show, options, onPress, hideMenu } = props
    return (
        <div>
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

export default Menu
