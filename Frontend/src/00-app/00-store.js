import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./01-userSlice";
import uiReducer from "./02-authUISlice";
import generatedQuestions from "./03-questionsSlice";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage

// 🔐 Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["generatedQuestions"], // ✅ ONLY this will persist
};

// 🧠 Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
  generatedQuestions: generatedQuestions,
});

// 🔄 Wrap with persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🏪 Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 💾 Persistor
export const persistor = persistStore(store);