import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { taskStatusOptions } from '../constants'
import { toast } from 'react-toastify'
import http from '../utils/axiosInterceptors'

const TaskStatusModal = (props) => {
    const { isOpenStatusModal, setIsOpenStatusModal, initialStatus, taskId, getTasks } = props

    const [form] = Form.useForm()

    const [updateLoading, setUpdateLoading] = useState(false)

    const onFinish = async (values) => {
        setUpdateLoading(true)
        try {
            await http.put(`/Tasks/status/${taskId}`, { ...values, taskId })
            toast.success('Status changed succesfully')
            setIsOpenStatusModal(false)
            getTasks()
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setUpdateLoading(false)
        }
    }

    useEffect(() => {
        form.setFieldValue('status', initialStatus)
    }, [initialStatus, form])

    return (
        <Modal
            title={`Change Status`}
            open={isOpenStatusModal}
            onCancel={() => setIsOpenStatusModal(false)}
            footer={null}
            width={'400px'}
        >
            <Form
                name="Change Status"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
                labelCol={{ span: 24 }}
                form={form}
            >
                <Row
                    gutter={{
                        xs: 8,
                        sm: 16,
                        md: 24,
                        lg: 32,
                    }}
                >
                    <Col span={24}>
                        <Form.Item label="Status" name="status">
                            <Select showSearch placeholder="Select status" options={taskStatusOptions} />
                        </Form.Item>
                    </Col>
                    <Col lg={24} xs={24}>
                        <Form.Item label="Reason" name="reason">
                            <Input.TextArea placeholder="Reason" />
                        </Form.Item>
                    </Col>
                    <Col lg={24} xs={24}>
                        <Button type="primary" htmlType="submit" loading={updateLoading}>
                            Update
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default TaskStatusModal