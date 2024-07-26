import { configureStore } from "@reduxjs/toolkit";

import { useDispatch } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducer";


const persistConfig = {
    key: "root", // localStorage key 
    storage, // localStorage
    whitelist: ["userReducer"], // target (reducer name)
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware();
    }
});

export default store;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const persistor = persistStore(store); 