import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { makeOptions } from '../utils';

const BankAccountsModal = (props) => {
    const { isOpenModal, getBankAccounts, closeModal, editId } = props

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)

    const [companiesLoading, setCompaniesLoading] = useState(false)
    const [companies, setCompanies] = useState([])
    const [companySearch, setCompanySearch] = useState(null)
    const [dataById, setDataById] = useState({})

    const getCompanies = async () => {
        setCompaniesLoading(true)
        try {
            const response = await http.post("Companies/discounting/filter/v2", {
                pagination: {
                    pageNumber: 1,
                    pageSize: 20
                },
                searchTerm: companySearch
            })
            setCompanies(response?.data?.items)
        } catch (error) {
            console.log(error)
        } finally {
            setCompaniesLoading(false)
        }
    }

    const getBankAccountById = async () => {
        try {
            const response = await http.get(`CompanyBankAccounts/${editId}`)
            setDataById(response?.data)
            form.setFieldValue('companyId', response?.data?.companyId)
            form.setFieldValue('bankAccountName', response?.data?.bankAccountName)
            form.setFieldValue('bankAccountNumber', response?.data?.bankAccountNumber)
            form.setFieldValue('routingNumber', response?.data?.routingNumber)
            form.setFieldValue('taxId', response?.data?.taxId)
            form.setFieldValue('notes', response?.data?.notes)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`CompanyBankAccounts/${editId}/`, { ...values, id: editId }) : await http.post('CompanyBankAccounts', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getBankAccounts()
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
            getBankAccountById()
        }

        // eslint-disable-next-line
    }, [editId])

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [companySearch])


    const newOptions = [
        ...makeOptions(companies, 'name'),
        { label: dataById?.company?.name, value: dataById?.company?.id }

    ]

    const isExist = makeOptions(companies, 'name').some(c => c.value === dataById?.company?.id)

    return (
        <Modal
            open={isOpenModal}
            centered
            width={800}
            title={`${editId ? "Edit" : "Add"} Bank Account`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="bankAccount-modal"
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
                    <Col span={24}>
                        <Form.Item
                            label="Company"
                            name="companyId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a company!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select a Company"
                                options={editId && !isExist ? newOptions : makeOptions(companies, 'name')}
                                loading={companiesLoading}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                onSearch={e => setCompanySearch(e)}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Bank Account Name"
                            name="bankAccountName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Bank Account Name!',
                                },
                            ]}
                        >
                            <Input placeholder='Bank Account Name' />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Bank Account Number"
                            name="bankAccountNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Bank Account Number!',
                                },
                            ]}
                        >
                            <Input placeholder='Bank Account Number' />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Routing Number"
                            name="routingNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Routing Number!',
                                },
                            ]}
                        >
                            <Input placeholder='Routing Number' />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Tax Id"
                            name="taxId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Tax Id!',
                                },
                            ]}
                        >
                            <Input placeholder='Tax Id' />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Notes"
                            name="notes"
                        >
                            <Input.TextArea placeholder='Notes' />
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

export default BankAccountsModal