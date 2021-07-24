import { createStore } from "redux"

import rootReducer from "./Reducers"


// initialize Redux store
const Store = createStore(rootReducer)

export default Store