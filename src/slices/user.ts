import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    id: '',
    name: '',
    accessToken: '',
    refreshToken: '',
};

const userSlice = createSlice({
    name: "count",
    initialState,
    reducers: {
        setUserLogin(state, action) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        setUserLogout(state) {
            state.id = "";
            state.name = "";
            state.accessToken = "";
            state.refreshToken = "";
        }
    },
});

export default userSlice;