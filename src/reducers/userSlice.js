import { createSlice } from "@reduxjs/toolkit";

const userInfo = JSON.parse(localStorage.getItem('user-info') ?? '{}')

export const authSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload
            localStorage.setItem('user-info', JSON.stringify(action.payload))
        },
    }
})

export const { setUserInfo } = authSlice.actions
export default authSlice.reducer