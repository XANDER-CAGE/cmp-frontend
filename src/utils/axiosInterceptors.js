import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../constants";
import { toast } from "react-toastify";

const token = Cookies.get("access_token")

const http = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": 1
    }
})

http.interceptors.request.use(
    config => {
        if (token) {
            config.headers = {
                'Authorization': `Bearer ${token}`
            }
            return config
        } else {
            return config
        }
    }
)

http.interceptors.response.use(
    response => response.data,
    error => {
        if (error?.response?.status === 401) {
            toast.warning('Token has expired, Please login!')
            Cookies.remove("access_token")
            localStorage.removeItem('user-info')
            window.location.reload()
        }
        return Promise.reject(error)
    }
)

export function writeHeaders(t) {
    http.defaults.headers.common['Authorization'] = `Bearer ${t}`
}

export default http