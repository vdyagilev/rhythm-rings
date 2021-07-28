import { applyMiddleware, compose, createStore } from "redux"
import thunk from 'redux-thunk';
import rootReducer from "./Reducers"
import Reactotron from '../ReactotronConfig'

// initialize Redux store
const middleware = applyMiddleware(thunk)
const Store = createStore(rootReducer, compose(middleware, Reactotron.createEnhancer())) // redux-thunk allows for async actions

export default Store