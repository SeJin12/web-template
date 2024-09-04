import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: '',
    name: '',
    accessToken: '',
    refreshToken: '',
    accessKey: '',
    secretKey: ''
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserLogin(state, action) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.accessKey = action.payload.accessKey;
            state.secretKey = action.payload.secretKey;
        },
        setUserLogout(state) {
            state.id = "";
            state.name = "";
            state.accessToken = "";
            state.refreshToken = "";
            state.accessKey = "";
            state.secretKey = "";
        }
    },
});

export default userSlice;