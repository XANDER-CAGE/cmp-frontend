import { Button, Col, Form, Input, Modal, Row, Select, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { makeOptions } from '../utils'
import { toast } from 'react-toastify'

const { Text } = Typography

const UsersModal = (props) => {
    const { isOpenModal, getUsers, closeModal, editId } = props

    const [form] = Form.useForm()

    const [roles, setRoles] = useState([])
    const [departments, setDepartments] = useState([])
    const [positions, setPositions] = useState([])
    const [submitLoading, setSubmitLoading] = useState(false)
    const [rolesLoading, setRolesLoading] = useState(false)
    const [departmentsLoading, setDepartmentsLoading] = useState(false)
    const [positionsLoading, setPositionsLoading] = useState(false)

    const getUserById = async () => {
        try {
            const response = await http.get(`Users/${editId}`)
            form.setFieldValue('name', response?.data?.name)
            form.setFieldValue('surname', response?.data?.surname)
            form.setFieldValue('username', response?.data?.username)
            form.setFieldValue('email', response?.data?.email)
            form.setFieldValue('phoneNumber', response?.data?.phoneNumber)
            form.setFieldValue('roles', response?.data?.roles?.map(role => role?.id))
            form.setFieldValue('departmentId', response?.data?.departmentId)
            form.setFieldValue('positionId', response?.data?.positionId)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`Users/${editId}/`, { ...values, id: editId }) : await http.post('Users', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getUsers()
            } else {
                toast.error(
                    <div className={'flex flex-col gap-3 box'}>
                        {
                            Object.values(response?.data)?.map((item, index) => {
                                return (
                                    <Text className={'font-bold text-[12px]'} key={index}>{index + 1}) {item[0]}</Text>
                                )
                            })
                        }
                    </div>,
                    {
                        closeButton: false,
                        icon: false,
                        autoClose: false,
                    },
                )
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setSubmitLoading(false)
        }
    }

    const getRoles = async () => {
        setRolesLoading(true)
        try {
            const response = await http.get('Roles')
            setRoles(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setRolesLoading(false)
        }
    }

    const getDepartments = async () => {
        setDepartmentsLoading(true)
        try {
            const response = await http.get('Departments')
            setDepartments(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setDepartmentsLoading(false)
        }
    }

    const getPositions = async () => {
        setPositionsLoading(true)
        try {
            const response = await http.get('CustomerPositions')
            setPositions(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setPositionsLoading(false)
        }
    }

    useEffect(() => {
        if (editId) {
            getUserById()
        }

        // eslint-disable-next-line
    }, [editId])

    useEffect(() => {
        getRoles()
        getDepartments()
        getPositions()
    }, [])

    return (
        <Modal
            open={isOpenModal}
            centered
            width={1000}
            title={`${editId ? "Edit" : "Add"} User`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="users-modal"
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
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input name!',
                                },
                            ]}
                        >
                            <Input placeholder='Name' />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Lastname"
                            name="surname"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input lastname!',
                                },
                            ]}
                        >
                            <Input placeholder='Lastname' />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input username!',
                                },
                            ]}
                        >
                            <Input disabled={editId} placeholder='Username' />
                        </Form.Item>
                    </Col>
                    {
                        editId ? null : (
                            <Col lg={12} xs={24}>
                                <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input password!',
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder='*****' />
                                </Form.Item>
                            </Col>
                        )
                    }
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input email!',
                                },
                            ]}
                        >
                            <Input placeholder='Email' />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Phone"
                            name="phoneNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input phone!',
                                },
                            ]}
                        >
                            <Input placeholder='Phone' />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Roles"
                            name="roles"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select roles!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select roles"
                                options={makeOptions(roles, 'name')}
                                mode='multiple'
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                loading={rolesLoading}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Department"
                            name="departmentId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a department!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select a department"
                                options={makeOptions(departments, 'name')}
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                loading={departmentsLoading}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Position"
                            name="positionId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a position!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select a position"
                                options={makeOptions(positions, 'name')}
                                allowClear
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                loading={positionsLoading}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col className='ml-auto'>
                        <Button className='mr-3' onClick={closeModal}>Cancel</Button>
                        <Button htmlType='submit' type='primary' loading={submitLoading}>
                            {editId ? "Update" : "Add"}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default UsersModal