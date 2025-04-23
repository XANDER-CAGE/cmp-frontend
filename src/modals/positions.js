import { Button, Col, Form, Input, Modal, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'

const PositionsModal = (props) => {
    const { isOpenModal, getPositions, closeModal, editId } = props

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)

    const getPositionById = async () => {
        try {
            const response = await http.get(`CustomerPositions/${editId}`)
            form.setFieldValue('name', response?.data?.name)
            form.setFieldValue('description', response?.data?.description)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`CustomerPositions/${editId}/`, { ...values, id: editId }) : await http.post('CustomerPositions', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getPositions()
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
            getPositionById()
        }

        // eslint-disable-next-line
    }, [editId])

    return (
        <Modal
            open={isOpenModal}
            centered
            width={600}
            title={`${editId ? "Edit" : "Add"} Position`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="positions-modal"
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
                    <Col lg={24} xs={24}>
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
                    <Col lg={24} xs={24}>
                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <Input.TextArea placeholder='Description' />
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

export default PositionsModal