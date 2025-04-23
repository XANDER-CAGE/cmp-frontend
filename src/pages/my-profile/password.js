import { Button, Col, Form, Input, Row } from 'antd'
import React from 'react'
import { toast } from 'react-toastify'
import http from '../../utils/axiosInterceptors'

const UpdatePassword = () => {
    const [form] = Form.useForm()

    const submitForm = async (values) => {
        try {
            const response = await http.post('/Cabinet/change-password', values)
            if (response?.code === 400) {
                toast.error(`
                ${response?.data['PasswordRequiresLower'] ? response?.data['PasswordRequiresLower'][0] : ''}
                ${response?.data['PasswordRequiresNonAlphanumeric']
                        ? response?.data['PasswordRequiresNonAlphanumeric'][0]
                        : ''
                    }
                ${response?.data['PasswordRequiresUpper'] ? response?.data['PasswordRequiresUpper'][0] : ''}
                ${response?.data['PasswordTooShort'] ? response?.data['PasswordTooShort'][0] : ''}
              `)
            } else if (response?.code === 500) {
                toast.error(response?.error)
            } else {
                toast.success('Successfully updated password')
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

    return (
        <Form
            name="password-update-modal"
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
                        label="Old Password"
                        name="oldPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please input Old Password!',
                            },
                        ]}
                    >
                        <Input.Password placeholder='*****' size='large' />
                    </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please input New Password!',
                            },
                        ]}
                    >
                        <Input.Password placeholder='*****' size='large' />
                    </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please Confirm New Password!',
                            },
                        ]}
                    >
                        <Input.Password placeholder='*****' size='large' />
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

export default UpdatePassword