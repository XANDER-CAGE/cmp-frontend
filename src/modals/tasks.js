import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { makeOptions } from '../utils'
import { toast } from 'react-toastify'
import { taskPriorityOptions, taskStatusOptions } from '../constants'
import dayjs from 'dayjs'

const TasksModal = (props) => {
    const { isOpenModal, getTasks, closeModal, editId } = props

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)
    const [searchUserInput, setSearchUserInput] = useState('')
    const [usersLoading, setUsersLoading] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const [dateString, setDateString] = useState('')

    const onChangeRange = (dates, dateString) => {
        setDateString(dateString)
    }

    const getUsers = async () => {
        setUsersLoading(true)
        try {
            const response = await http.post(`/Users/filter`, {
                pageSize: 100,
                searchTerm: searchUserInput,
            })
            setAllUsers(response?.data?.items)
        } catch (error) {
            console.log(error)
        } finally {
            setUsersLoading(false)
        }
    }

    const getTaskById = async () => {
        try {
            const response = await http.get(`Tasks/${editId}`)
            form.setFieldValue('title', response?.data?.title)
            form.setFieldValue('priority', response?.data?.priority)
            form.setFieldValue('assignedUserId', response?.data?.assignedUserId)
            form.setFieldValue('description', response?.data?.description)
            form.setFieldValue('status', response?.data?.status)
            form.setFieldValue('dueDate', dayjs(response?.data?.dueDate))
            form.setFieldValue('watchers', response?.data?.watchers?.map((item) => item?.userId))
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`Tasks/${editId}/`, { ...values, id: editId }) : await http.post('Tasks', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getTasks()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setSubmitLoading(false)
        }
    }

    useEffect(() => {
        if (editId) {
            getTaskById()
        }

        // eslint-disable-next-line
    }, [editId])

    useEffect(() => {
        getUsers()

        // eslint-disable-next-line
    }, [searchUserInput])

    return (
        <Modal
            open={isOpenModal}
            centered
            width={1000}
            title={`${editId ? "Edit" : "Add"} Task`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="tasks-modal"
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
                            label="Title"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input title!',
                                },
                            ]}
                        >
                            <Input placeholder='Title' />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a status!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Status"
                                options={taskStatusOptions}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Priority"
                            name="priority"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a priority!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Priority"
                                options={taskPriorityOptions}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Assign to"
                            name="assignedUserId"
                        >
                            <Select
                                showSearch
                                placeholder="Select a person"
                                optionFilterProp="children"
                                onSearch={(value) => setSearchUserInput(value)}
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={makeOptions(allUsers, 'username')}
                                onClear={() => setSearchUserInput('')}
                                loading={usersLoading}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Due Date"
                            name="dueDate"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select date!',
                                },
                            ]}
                        >
                            <DatePicker
                                onChange={onChangeRange}
                                value={dateString}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={12} xs={24}>
                        <Form.Item label="Watchers" name="watchers">
                            <Select
                                showSearch
                                placeholder="Select a person"
                                optionFilterProp="children"
                                onSearch={(value) => setSearchUserInput(value)}
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={() => {
                                    setSearchUserInput('')
                                }}
                                options={makeOptions(allUsers, 'username')}
                                onClear={() => setSearchUserInput('')}
                                loading={usersLoading}
                                allowClear
                                mode="multiple"
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={24} xs={24}>
                        <Form.Item label="Description" name="description">
                            <Input.TextArea placeholder="Description" />
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

export default TasksModal