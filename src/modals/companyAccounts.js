import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { makeOptions } from '../utils';
import { billingCycleOptions, billingTypeOptions, feesTypesOptions, pricingModelOptions } from '../constants';

const CompanyAccountsModal = (props) => {
    const { isOpenModal, getCompanyAccounts, closeModal, editId } = props

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)

    const [companiesLoading, setCompaniesLoading] = useState(false)
    const [companies, setCompanies] = useState([])
    const [organizations, setOrganizations] = useState([])
    const [efsAccounts, setEfsAccounts] = useState([])
    const [companySearch, setCompanySearch] = useState('')
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

    const getOrganizations = async () => {
        try {
            const response = await http.get("Organizations")
            setOrganizations(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getEFSAccounts = async () => {
        try {
            const response = await http.get("EfsAccounts")
            setEfsAccounts(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getCompanyAccountById = async () => {
        try {
            const response = await http.get(`CompanyAccounts/${editId}`)
            setDataById(response?.data)
            form.setFieldValue('companyId', response?.data?.companyId)
            form.setFieldValue('organizationId', response?.data?.organizationId)
            form.setFieldValue('efsAccountId', response?.data?.efsAccountId)
            form.setFieldValue('billingCycle', response?.data?.billingCycle)
            form.setFieldValue('feesType', response?.data?.feesType)
            form.setFieldValue('discount', response?.data?.discount)
            form.setFieldValue('pricingModel', response?.data?.pricingModel)
            form.setFieldValue('billingType', response?.data?.billingType)
            form.setFieldValue('notes', response?.data?.notes)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`CompanyAccounts/${editId}/`, { ...values, id: editId }) : await http.post('CompanyAccounts', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getCompanyAccounts()
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
            getCompanyAccountById()
        }

        // eslint-disable-next-line
    }, [editId])

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [companySearch])

    useEffect(() => {
        getOrganizations()
        getEFSAccounts()
    }, [])

    const newOptions = [
        ...makeOptions(companies, 'name'),
        { label: dataById?.company?.name, value: dataById?.company?.id }

    ]

    const isExist = makeOptions(companies, 'name').some(c => c.value === dataById?.company?.id)

    return (
        <Modal
            open={isOpenModal}
            centered
            width={1000}
            title={`${editId ? "Edit" : "Add"} Company Account`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="companyAccounts-modal"
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

                    <Col lg={12} xs={24}>
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
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="EFS Account"
                            name="efsAccountId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select an EFS Account!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select an EFS Account"
                                options={makeOptions(efsAccounts, 'name')}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Billing Cycle"
                            name="billingCycle"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select Billing Cycle!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select"
                                options={billingCycleOptions}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Fees Type"
                            name="feesType"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select Fees Type!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select"
                                options={feesTypesOptions}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input discount!',
                                },
                            ]}
                        >
                            <Input placeholder='0' type='number' />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Pricing Model"
                            name="pricingModel"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select Pricing Model!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select"
                                options={pricingModelOptions}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
                        <Form.Item
                            label="Billing Type"
                            name="billingType"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select Billing Type!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select"
                                options={billingTypeOptions}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col lg={12} xs={24}>
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

export default CompanyAccountsModal