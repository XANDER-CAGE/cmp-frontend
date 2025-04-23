import { Button, Col, Form, Input, Modal, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { css } from '@emotion/react';

const AgentsModal = (props) => {
    const { isOpenModal, getAgents, closeModal, editId } = props

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)

    const getAgentById = async () => {
        try {
            const response = await http.get(`Agents/${editId}`)
            form.setFieldValue('name', response?.data?.name)
            form.setFieldValue('phones', response?.data?.phones)
            form.setFieldValue('emails', response?.data?.emails)
            form.setFieldValue('address', response?.data?.address)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`Agents/${editId}/`, { ...values, id: editId }) : await http.post('Agents', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getAgents()
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
            getAgentById()
        }

        // eslint-disable-next-line
    }, [editId])

    return (
        <Modal
            open={isOpenModal}
            centered
            width={1000}
            title={`${editId ? "Edit" : "Add"} Agent`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="agents-modal"
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
                            label="Address"
                            name="address"
                        >
                            <Input placeholder='Address' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <label className={'mt-2 mb-2 block'}>Phones</label>
                        <Form.List key="phones" name="phones">
                            {(listFields, { add, remove }, { errors }) => (
                                <>
                                    {listFields.map((listField, index) => (
                                        <Form.Item
                                            required={true}
                                            key={listField.key}
                                            css={css`
                                                .ant-form-item-control-input-content {
                                                    display: flex;
                                                }
                                                margin-bottom: 1rem !important;
                                            `}
                                        >
                                            <Form.Item validateTrigger={['onChange', 'onBlur']} {...listField} noStyle>
                                                <Input
                                                    type='text'
                                                    className="my-0 mr-2"
                                                    placeholder="Phone number"
                                                    style={{ width: 'calc(100% - 30px)' }}
                                                />
                                            </Form.Item>
                                            {listFields.length >= 1 ? (
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(listField.name)}
                                                />
                                            ) : null}
                                        </Form.Item>
                                    ))}

                                    <Form.Item className={'mb-2'}>
                                        <Button type="dashed" onClick={() => add()} style={{ width: '150px' }} icon={<PlusOutlined />}>
                                            Add phone
                                        </Button>

                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Col>

                    <Col lg={12} xs={24} className='mb-5'>
                        <label className={'mt-2 mb-2 block'}>Emails</label>
                        <Form.List key="emails" name="emails">
                            {(listFields, { add, remove }, { errors }) => (
                                <>
                                    {listFields.map((listField, index) => (
                                        <Form.Item
                                            required={true}
                                            key={listField.key}
                                            css={css`
                                                .ant-form-item-control-input-content {
                                                    display: flex;
                                                }
                                                margin-bottom: 1rem !important;
                                            `}
                                        >
                                            <Form.Item validateTrigger={['onChange', 'onBlur']} {...listField} noStyle>
                                                <Input
                                                    type='text'
                                                    className="my-0 mr-2"
                                                    placeholder="Email"
                                                    style={{ width: 'calc(100% - 30px)' }}
                                                />
                                            </Form.Item>
                                            {listFields.length >= 1 ? (
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(listField.name)}
                                                />
                                            ) : null}
                                        </Form.Item>
                                    ))}

                                    <Form.Item className={'mb-2'}>
                                        <Button type="dashed" onClick={() => add()} style={{ width: '150px' }} icon={<PlusOutlined />}>
                                            Add email
                                        </Button>

                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
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

export default AgentsModal