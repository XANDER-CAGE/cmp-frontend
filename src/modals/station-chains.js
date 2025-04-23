import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { makeOptions } from '../utils';

const StationChainsModal = (props) => {
    const { isOpenModal, getStationChains, closeModal, editId } = props

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)
    const [organizations, setOrganizations] = useState('')

    const getStationChainsById = async () => {
        try {
            const response = await http.get(`StationChains/${editId}`)
            form.setFieldValue('name', response?.data?.name)
            form.setFieldValue('aliasName', response?.data?.aliasName)
            form.setFieldValue('description', response?.data?.description)
            form.setFieldValue('additionalGallons', response?.data?.additionalGallons)
            form.setFieldValue('organizationIds', response?.data?.organizationIds)
        } catch (error) {
            console.log(error)
        }
    }

    const getOrganizations = async () => {
        try {
            const response = await http.get('Organizations')
            setOrganizations(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`StationChains/${editId}/`, { ...values, id: editId }) : await http.post('StationChains', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getStationChains()
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
            getStationChainsById()
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
            width={600}
            title={`${editId ? "Edit" : "Add"} Station Chains`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="station-chains-modal"
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
                            label="Alias Name"
                            name="aliasName"
                        >
                            <Input placeholder='Alias Name' />
                        </Form.Item>
                    </Col>
                    <Col lg={24} xs={24}>
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
                          label="Additional Gallons"
                          name="additionalGallons"
                        >
                            <InputNumber min={0} placeholder='Additional Gallons' />
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

export default StationChainsModal