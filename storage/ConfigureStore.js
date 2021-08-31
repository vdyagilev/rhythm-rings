import { applyMiddleware, compose, createStore } from "redux"
import thunk from 'redux-thunk';
import rootReducer from "./Reducers"
import Reactotron from '../ReactotronConfig'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import AsyncStorage from  '@react-native-async-storage/async-storage'
import JSOG from 'jsog'

// work with cyclic structures
// fixes a bug https://github.com/rt2zz/redux-persist/issues/644
export const JSOGTransform = createTransform(
    (inboundState, key) => JSOG.encode(inboundState),
    (outboundState, key) => JSOG.decode(outboundState),
)

// init redux-persist to save redux store to local storage automatically
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    transforms: [JSOGTransform]
  }
const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {  
    // initialize Redux store with redux-persist
    const middleware = applyMiddleware(thunk)
    const store = createStore(persistedReducer, compose(middleware, Reactotron.createEnhancer())) // redux-thunk allows for async actions
    const persistor = persistStore(store)
    return { store, persistor }
}