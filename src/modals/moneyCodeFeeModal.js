import { Button, Col, Form, InputNumber, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { makeOptions } from '../utils'

const MoneyCodeFeeModal = (props) => {
    const { isOpenModal, getMoneyCodeFee, closeModal, editId } = props

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)
    const [companiesLoading, setCompaniesLoading] = useState(false)
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(null)
    const [companySearch, setCompanySearch] = useState(null)
    const [organizations, setOrganizations] = useState([])
    const [selectType, setSelectType] = useState("Default")
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

    const getMoneyCodeFeeById = async () => {
        try {
            const response = await http.get(`MoneyCodeFeeConditions/${editId}`)
            setDataById(response?.data)
            setSelectType(response?.data?.type)
            form.setFieldValue('times', response?.data?.times)
            form.setFieldValue('organizationId', response?.data?.organizationId)
            form.setFieldValue('companyId', response?.data?.companyId)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        const data = {
            ...values,
            organizationId: selectType === "Organization" ? values?.organizationId : null,
            companyId: selectType === "Company" ? values?.companyId : null,
            type: selectType
        }

        try {
            const response = editId ?
                await http.put(`MoneyCodeFeeConditions/${editId}`, { ...data, id: editId })
                : await http.post('MoneyCodeFeeConditions', data)

            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getMoneyCodeFee()
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
            getMoneyCodeFeeById()
        }

        // eslint-disable-next-line
    }, [editId])

    useEffect(() => {
        getOrganizations()
    }, [])

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [companySearch])

    useEffect(() => {
        form.setFieldValue('times', 0)
    }, [form])

    const newOptions = [
        ...makeOptions(companies, 'name'),
        { label: dataById?.companyName, value: dataById?.companyId }
    ]

    const isExist = makeOptions(companies, 'name').some(c => c.value === dataById?.companyId)

    return (
        <Modal
            open={isOpenModal}
            centered
            width={600}
            title={`${editId ? "Edit" : "Add"} Money Code Fee`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="money-code-fee-modal"
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
                        <Select
                            options={[
                                { value: "Default", label: "Default" },
                                { value: "Organization", label: "Organization" },
                                { value: "Company", label: "Company" }
                            ]}
                            value={selectType}
                            onChange={e => setSelectType(e)}
                            className='w-[100%] mb-5'
                            disabled={!!editId}
                        />
                    </Col>

                    {
                        selectType === "Company" ? (
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
                                        placeholder="Company"
                                        options={editId && !isExist ? newOptions : makeOptions(companies, 'name')}
                                        loading={companiesLoading}
                                        value={companyId}
                                        onChange={e => setCompanyId(e)}
                                        showSearch
                                        allowClear
                                        filterOption={(input, option) =>
                                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        onSearch={e => setCompanySearch(e)}
                                        disabled={!!editId}
                                    />
                                </Form.Item>
                            </Col>
                        ) : null
                    }

                    {
                        selectType === "Organization" ? (
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
                        ) : null
                    }

                    <Col lg={24} xs={24}>
                        <Form.Item
                            label="Times"
                            name="times"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input times!',
                                },
                            ]}
                        >
                            <InputNumber precision={2} min={0} />
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

export default MoneyCodeFeeModal