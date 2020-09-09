import { createStore, combineReducers, applyMiddleware } from 'redux'

import reducers from './reducers'
import thunk from 'redux-thunk'
import { h0 } from '../utils/fp'

export default createStore(
    combineReducers(reducers),
    {
        from: null,
        to: null,
        departDate: h0(Date.now()),
        highSpeed: false,
        trainList: [],
    },
    applyMiddleware(thunk)
)
