import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./01-userSlice"
import uiReducer from "./02-authUISlice"


const rootReducer = combineReducers({
    user: userReducer,
    ui:uiReducer,
});



export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
})