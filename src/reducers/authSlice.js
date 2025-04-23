import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie"
import { writeHeaders } from "../utils/axiosInterceptors";

const accessToken = Cookies.get("access_token") ?? null

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken,
        isAuth: !!accessToken,
    },
    reducers: {
        userLogin: (state, action) => {
            state.accessToken = action.payload.accessToken
            state.isAuth = true

            Cookies.set("access_token", action.payload.accessToken, { expires: 1 })
            writeHeaders(action.payload.accessToken)
        },
        userLogout: (state) => {
            state.accessToken = null
            state.isAuth = false
            Cookies.remove("access_token")
            localStorage.removeItem('user-info')
            window.location.reload()
        }
    }
})

export const { userLogin, userLogout } = authSlice.actions
export default authSlice.reducer