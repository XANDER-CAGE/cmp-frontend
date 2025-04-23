import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Switch } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { makeOptions } from '../utils'
import CustomEditor from '../components/custom-editor';
import dayjs from 'dayjs'

const EmailTemplatesModal = (props) => {
    const { isOpenModal, getEmailTemplates, closeModal, editId } = props

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)
    const [isActive, setIsActive] = useState(true);
    const [dateString, setDateString] = useState('');
    const [ckEditorValue, setCkEditorValue] = useState('');
    const [organizations, setOrganizations] = useState('')

    const onChangeRange = (dates, dateString) => {
        setDateString(dateString);
    }

    const getOrganizations = async () => {
        try {
            const response = await http.get('Organizations')
            setOrganizations(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getEmailTemplateById = async () => {
        try {
            const response = await http.get(`InvoiceEmailTemplate/${editId}`)

            const scheduleDate = response?.data?.scheduleDate
                ? dayjs(`${response?.data?.scheduleDate}T00:00:00`)
                : null

            form.setFieldsValue({
                name: response?.data?.name,
                subject: response?.data?.subject,
                scheduleDate: scheduleDate,
                html: response?.data?.html,
                organizationIds: response?.data?.organizations?.map((org) => org.id),
            });

            setCkEditorValue(response?.data?.html);
            setIsActive(response?.data?.isActive);
            setDateString(response?.data?.scheduleDate)

            setDateString(response?.data?.scheduleDate);
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        const formData = {
            ...values,
            isActive,
            html: ckEditorValue,
            scheduleDate: dateString === '' ? null : dateString,
        }

        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`InvoiceEmailTemplate/`, { ...formData, id: editId }) : await http.post('InvoiceEmailTemplate', formData)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getEmailTemplates()
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
            getEmailTemplateById()
        }

        // eslint-disable-next-line
    }, [editId])

    useEffect(() => {
        getOrganizations()
    }, [])

    return (
        <Modal
            open={isOpenModal}
            centered
            width={1000}
            title={`${editId ? "Edit" : "Add"} Invoice Email Template`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="email-template-modal"
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
                            label="Subject"
                            name="subject"
                        >
                            <Input placeholder='Subject' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Schedule Date"
                            name="scheduleDate"
                        >
                            <DatePicker onChange={onChangeRange} value={dateString} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Organizations"
                            name="organizationIds"
                        >
                            <Select
                                placeholder="Select"
                                allowClear
                                options={makeOptions(organizations, 'name')}
                                style={{ width: '100%' }}
                                showSearch
                                filterOption={(input, option) =>
                                    ((option?.label || '')).toLowerCase().includes(input.toLowerCase())
                                }
                                mode="multiple"
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={24} xs={24}>
                        <Form.Item
                            label="HTML"
                            name="html"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input html!',
                                },
                            ]}
                        >
                            <CustomEditor
                                onChange={(e) => {
                                    setCkEditorValue(e?.data);
                                }}
                                data={ckEditorValue}
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Is Active"
                        >
                            <Switch checked={isActive} onChange={(e) => setIsActive(e)} />
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

export default EmailTemplatesModal