import React, { useEffect, useState } from 'react'
import "./profile-settings.css"
import http from '../../utils/axiosInterceptors'
import { Tabs } from 'antd'
import UpdateProfile from './profile'
import UpdatePassword from './password'
import { useDispatch } from "react-redux";
import { useUserInfo } from '../../contexts/UserInfoContext';

const MyProfile = () => {
    const dispatch = useDispatch()
    const {setUserInfo} = useUserInfo();

    const items = [
        {
            key: 'profile',
            label: 'Update Profile',
        },
        {
            key: 'password',
            label: 'Change Password',
        },
    ]

    const [tabType, setTabType] = useState("profile")
    const [userData, setUserData] = useState([])

    const getUserData = async () => {
        try {
            const response = await http.get("Users/me")
            const user = response?.data;
            setUserData(user)
            setUserInfo(user)
            dispatch(setUserInfo(user))
        } catch (error) {
            console.log(error)
        } finally { }
    }

    useEffect(() => {
        getUserData()

        // eslint-disable-next-line
    }, [setUserInfo])

    return (
        <div className='profile-settings-container'>
            <div className='box left'>
                <h1>{userData?.name} {userData?.surname}</h1>
                <span>@{userData?.username}</span>
                <div className='user-bg'></div>
                <p>Member since: <b style={{ marginLeft: '10px' }}>29 September 2023</b></p>
            </div>
            <div className='box right'>
                <Tabs
                    items={items}
                    onChange={(e) => setTabType(e)}
                    defaultActiveKey={tabType}
                />

                {
                    tabType === "profile" ?
                        <UpdateProfile
                            userData={userData}
                            getUserData={getUserData}
                        /> : <UpdatePassword />
                }
            </div>
        </div>
    )
}

export default MyProfile