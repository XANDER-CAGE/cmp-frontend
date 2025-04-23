import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { makeOptions } from '../utils'

const MerchantFeeModal = (props) => {
    const { isOpenModal, getMerchantFee, closeModal, editId } = props

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)
    const [organizations, setOrganizations] = useState([])

    const getOrganizations = async () => {
        try {
            const response = await http.get("Organizations")
            setOrganizations(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getMerchantFeeById = async () => {
        try {
            const response = await http.get(`OrganizationMerchantFees/${editId}`)
            form.setFieldValue('feePercentage', response?.data?.feePercentage)
            form.setFieldValue('organizationId', response?.data?.organizationId)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`OrganizationMerchantFees`, { ...values, id: editId }) : await http.post('OrganizationMerchantFees', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getMerchantFee()
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
            getMerchantFeeById()
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
            title={`${editId ? "Edit" : "Add"} Merchant Fee`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="merchant-fee-modal"
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
                            label="Fee Percentage"
                            name="feePercentage"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input fee percentage!',
                                },
                            ]}
                        >
                            <Input placeholder='Fee' type='number' />
                        </Form.Item>
                    </Col>
                    <Col lg={24} xs={24}>
                        <Form.Item
                            label="Organization"
                            name="organizationId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select an organization!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select an Organization"
                                options={makeOptions(organizations, 'name')}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                disabled={!!editId}
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

export default MerchantFeeModal