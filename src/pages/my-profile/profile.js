import { Button, Col, Form, Input, Row } from 'antd'
import React, { useEffect } from 'react'
import http from '../../utils/axiosInterceptors'
import { toast } from 'react-toastify'

const UpdateProfile = (props) => {
    const { userData, getUserData } = props

    const [form] = Form.useForm()

    const submitForm = async (values) => {
        try {
            const response = await http.put('/Cabinet/profile', values)
            if (response?.success) {
                toast.success('Succesfully Updated')
                getUserData()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

    useEffect(() => {
        form.setFieldValue('name', userData?.name)
        form.setFieldValue('surname', userData?.surname)
        form.setFieldValue('email', userData?.email)
        form.setFieldValue('phoneNumber', userData?.phoneNumber)
    }, [userData, form])

    return (
        <Form
            name="profile-update-modal"
            form={form}
            layout='vertical'
            labelCol={{
                span: 24,
            }}
            wrapperCol={{
                span: 24,
            }}
            style={{ maxWidth: 'none' }}
            initialValues={{
                remember: true,
            }}
            onFinish={submitForm}
            autoComplete="off"
        >
            <Row
                gutter={{
                    xs: 8,
                    sm: 16,
                    md: 24,
                    lg: 32,
                }}
            >
                <Col lg={12} xs={24}>
                    <Form.Item
                        label="Firstname"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input firstname!',
                            },
                        ]}
                    >
                        <Input placeholder='Firstname' size='large' />
                    </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                    <Form.Item
                        label="Lastname"
                        name="surname"
                    >
                        <Input placeholder='Lastname' size='large' />
                    </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input disabled type='email' placeholder='Email' size='large' />
                    </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                    <Form.Item
                        label="Phone"
                        name="phoneNumber"
                    >
                        <Input type='text' placeholder='Phone' size='large' />
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col className='ml-auto'>
                    <Button htmlType='submit' className='px-5' type='primary' size='large'>Save</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default UpdateProfile