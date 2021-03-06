import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from '../serviceWorker'
import { Provider } from 'react-redux'
import store from './store/store'
import './index.css'
import 'normalize.css/normalize.css'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

serviceWorker.unregister()
