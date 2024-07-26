import { combineReducers } from "redux";
import userSlice from "../slices/user";


const rootReducer = combineReducers({
    userReducer: userSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;