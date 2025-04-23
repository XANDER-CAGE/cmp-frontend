import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import http from "../../utils/axiosInterceptors";
import { useDispatch } from "react-redux";
import { userLogin } from "../../reducers/authSlice";
import { toast } from "react-toastify";
import logoImg from '../../assets/images/bg-logo.png'
import './login.css'

// import ReCAPTCHA from "react-google-recaptcha"
import { APP_SERIAL } from "../../constants";

const Login = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  // const [captcha, setCaptcha] = useState('')

  const onFinish = async (values) => {
    setIsLoading(true)
    try {
      const response = await http.post("Auth/login", { ...values}, {
        headers: {
          'X-APP-SERIAL': APP_SERIAL
        }
      })
      if (response?.success) {
        dispatch(userLogin(response?.data))
        toast.success('Succesfully login')
      } else {
        toast.error(response?.error)
      }
    } catch (error) {
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
    } finally {
      setIsLoading(false)
    }
  }

  // const onFinish = async (values) => {
  //   setIsLoading(true)
  //   try {
  //     const response = await http.post("Auth/login-v2", { ...values, captcha })
  //     if (response?.success) {
  //       dispatch(userLogin(response?.data))
  //       toast.success('Succesfully login')
  //     } else {
  //       toast.error(response?.error)
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.error ?? error?.response?.statusText ? error?.response?.data?.error ??? 'Server Error!')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div
      className="w-[100%] h-[100vh] flex justify-center items-center login-page"
    >
      <Form
        className="box"
        name="login"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        style={{
          width: 500,
          textAlign: 'center',
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <img src={logoImg} alt="" className="w-[250px] mb-[20px]" />
        <Form.Item
          label="Username"
          name="login"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        {/*<ReCAPTCHA*/}
        {/*  sitekey={captchaSiteKey}*/}
        {/*  className="text-center"*/}
        {/*  onChange={(e) => setCaptcha(e)}*/}
        {/*  hl="en"*/}
        {/*/>*/}

        <Button
          loading={isLoading}
          disabled={isLoading}
          type="primary"
          className="w-[100%] mt-3"
          htmlType="submit"
        >
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;
