import React, { useState, useMemo, useEffect, memo, useCallback } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import './CitySelector.css'

//每个城市的组件
const CityItem = memo(function CityItem(props) {
    const { name, onSelect } = props
    return (
        <li className="city-li" onClick={() => onSelect(name)}>
            {name}
        </li>
    )
})

//以字母为集合的城市组件
const CitySection = memo(function CitySection(props) {
    const { title, cities = [], onSelect } = props
    return (
        <ul className="city-ul">
            {/* data-cate={title} 是用于标记，让scrollIntoView命中*/}
            <li className="city-li" key="title" data-cate={title}>
                {title}
            </li>
            {cities.map((c) => {
                return (
                    <CityItem key={c.name} name={c.name} onSelect={onSelect} />
                )
            })}
        </ul>
    )
})

//字母列表
const AlphaIndex = memo(function AlphaIndex(props) {
    const { alpha, toAlpha } = props
    return (
        <i className="city-index-item" onClick={() => toAlpha(alpha)}>
            {alpha}
        </i>
    )
})

//获取26个字母
let alphabet = Array.from(new Array(26), (ele, index) => {
    //a从65开始
    return String.fromCharCode(65 + index)
})

alphabet.splice(alphabet.indexOf('I'), 1)
alphabet.splice(alphabet.indexOf('O'), 1)
alphabet.splice(alphabet.indexOf('U'), 1)
alphabet.splice(alphabet.indexOf('V'), 1)

//城市列表
const CityList = memo(function CityList(props) {
    const { sections, onSelect, toAlpha } = props
    const newSections = sections.filter((c) => c.citys)
    return (
        <div className="city-list">
            <div className="city-cate">
                {newSections.map((c) => {
                    return (
                        <CitySection
                            key={c.title}
                            title={c.title}
                            cities={c.citys}
                            onSelect={onSelect}
                        />
                    )
                })}
            </div>

            {/* 字母索引 */}
            <div className="city-index">
                {alphabet.map((alpha) => {
                    return (
                        <AlphaIndex
                            key={alpha}
                            alpha={alpha}
                            toAlpha={toAlpha}
                        />
                    )
                })}
            </div>
        </div>
    )
})

// 搜索推荐组件的子项
const SuggestItem = memo((props) => {
    const { name, onSelect } = props
    return (
        <li className="city-suggest-li" onClick={() => onSelect(name)}>
            {name}
        </li>
    )
})

// 搜索推荐组件
const Suggest = memo((props) => {
    const { searchKey, onSelect } = props
    const [result, setResult] = useState([])

    useEffect(() => {
        fetch('/rest/search?key=' + encodeURIComponent(searchKey))
            .then((res) => res.json())
            .then((data) => {
                const { result, searchKey: sKey } = data
                if (sKey === searchKey) {
                    setResult(result)
                }
            })
    }, [searchKey])

    //如果没有搜索结果，就显示搜索关键词
    // const fallBackResult = result.length ? result : [{ display: searchKey }]
    const fallBackResult = useMemo(() => {
        if (!result.length) {
            return [
                {
                    display: searchKey,
                },
            ]
        }
        return result
    }, [result, searchKey])

    return (
        <div className="city-suggest">
            <ul className="city-suggest-ul">
                {fallBackResult.map((c) => {
                    return (
                        <SuggestItem
                            key={c.display}
                            name={c.display}
                            onSelect={onSelect}
                        />
                    )
                })}
            </ul>
        </div>
    )
})

//页面
const CitySelector = memo(function CitySelector(props) {
    const { show, cityData, isLoading, onBack, fetchCityData, onSelect } = props

    const [searchKey, setSearchKey] = useState('')

    //当渲染时，即使searchKey没有变化也会渲染，useMemo解决了这个问题，变成依赖渲染
    const key = useMemo(() => searchKey.trim(), [searchKey])

    //中间函数：处理回退函数和清空search
    const handle = () => {
        onBack()
        setSearchKey('')
    }

    //使用副作用发送请求，只有show为真，没有数据，不是loading的时候才发生请求
    useEffect(() => {
        if (!show || cityData || isLoading) {
            return
        }
        fetchCityData()
    }, [show, cityData, isLoading, fetchCityData])

    //处理单击字母跳转：通过标记属性，然后通过属性选择器命中，再scrollIntoView即可
    const toAlpha = useCallback((alpha) => {
        document.querySelector(`[data-cate='${alpha}']`).scrollIntoView()
    }, [])

    //中间渲染函数：cityData有可能不存在，所以需要过渡判读
    const outputCitySections = () => {
        if (isLoading) {
            return <div>loading</div>
        }
        if (cityData) {
            // console.log(cityData)
            return (
                <CityList
                    sections={cityData.cityList}
                    onSelect={onSelect}
                    toAlpha={toAlpha}
                />
            )
        }
        //如果出现错误
        return <div>error</div>
    }

    //classnames: value等于假时，将hidden加入类名
    return (
        <div
            className={classnames('city-selector', {
                hidden: !show,
            })}
        >
            <div className="city-search">
                <div className="search-back" onClick={() => handle()}>
                    <svg width="42" height="42">
                        <polyline
                            points="25,13 16,21 25,29"
                            stroke="#fff"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </div>
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={searchKey}
                        className="search-input"
                        placeholder="城市，车站的中文"
                        onChange={(e) => setSearchKey(e.target.value)}
                    />
                    <i
                        className={classnames('search-clean', {
                            // searchKey等于0时加入类名
                            hidden: key.length === 0,
                        })}
                        onClick={() => {
                            setSearchKey('')
                        }}
                    >
                        &#xf063;
                    </i>
                </div>
            </div>
            {/* 如果可以存着且合法，才显示搜索结果 */}
            {Boolean(key) && (
                <Suggest searchKey={key} onSelect={(key) => onSelect(key)} />
            )}
            {/* 渲染城市组件 */}
            {outputCitySections()}
        </div>
    )
})

CitySelector.propTypes = {
    show: PropTypes.bool.isRequired,
    cityData: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    fetchCityData: PropTypes.func.isRequired,
}

export default CitySelector
