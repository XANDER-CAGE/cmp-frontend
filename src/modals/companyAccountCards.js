import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { makeOptions } from '../utils';
import queryString from 'query-string';

const CompanyAccountCardModal = (props) => {
    const { isOpenModal, getCompanyAccountCards, closeModal, editId } = props

    const { cardNumber, driverName, unitNumber } = queryString.parse(window.location.search)

    const [form] = Form.useForm()

    const [submitLoading, setSubmitLoading] = useState(false)

    const [companyAccountsLoading, setCompanyAccountsLoading] = useState(false)
    const [companyAccounts, setCompanyAccounts] = useState([])
    const [companyAccountSearch, setCompanyAccountSearch] = useState('')
    const [dataById, setDataById] = useState({})

    const getCompanyAccountsInvoicing = async () => {
        setCompanyAccountsLoading(true)
        try {
            const response = await http.post("CompanyAccounts/invoicing/filter/", {
                pagination: {
                    pageNumber: 1,
                    pageSize: 20
                },
                searchTerm: companyAccountSearch
            })
            setCompanyAccounts(response?.data?.items)
        } catch (error) {
            console.log(error)
        } finally {
            setCompanyAccountsLoading(false)
        }
    }

    const getCompanyAccountById = async () => {
        try {
            const response = await http.get(`CompanyAccountCards/${editId}`)
            setDataById(response?.data)
            form.setFieldValue('companyAccountId', response?.data?.companyAccountId)
            form.setFieldValue('cardNumber', response?.data?.cardNumber)
            form.setFieldValue('driverName', response?.data?.driverName)
            form.setFieldValue('unitNumber', response?.data?.unitNumber)
            form.setFieldValue('cardStatus', response?.data?.cardStatus)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`CompanyAccountCards/${editId}`, { ...values, id: editId }) : await http.post('CompanyAccountCards', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getCompanyAccountCards()
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
        getCompanyAccountsInvoicing()

        // eslint-disable-next-line
    }, [companyAccountSearch])

    useEffect(() => {
        form.setFieldValue('cardNumber', cardNumber)
        form.setFieldValue('driverName', driverName)
        form.setFieldValue('unitNumber', unitNumber)

    }, [cardNumber, driverName, unitNumber, form])

    const newOptions = [
        ...makeOptions(
            companyAccounts,
            (item) =>
                `${item?.organization?.name} (org), ${item?.efsAccount?.name} (efs), ${item?.company?.name} (com)`
        ),
        {
            label: `${dataById?.companyAccount?.organization?.name} (org), ${dataById?.companyAccount?.efsAccount?.name} (efs), ${dataById?.companyAccount?.company?.name}`,
            value: dataById?.companyAccount?.id
        }

    ]

    const isExist = makeOptions(
        companyAccounts,
        (item) =>
            `${item?.organization?.name} (org), ${item?.efsAccount?.name} (efs), ${item?.company?.name} (com)`
    ).some(c => c.value === dataById?.companyAccount?.id)

    return (
        <Modal
            open={isOpenModal}
            centered
            width={800}
            title={`${editId ? "Edit" : "Add"} EFS Account Card`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="companyAccountCard-modal"
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
                            label="Company Account"
                            name="companyAccountId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a company!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select a Company Account"
                                options={editId && !isExist ? newOptions : makeOptions(
                                    companyAccounts,
                                    (item) =>
                                        `${item?.organization?.name} (org), ${item?.efsAccount?.name} (efs), ${item?.company?.name} (com)`
                                )}
                                loading={companyAccountsLoading}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                onSearch={e => setCompanyAccountSearch(e)}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Card Number"
                            name="cardNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Card Number!',
                                },
                            ]}
                        >
                            <Input placeholder='Card Number' disabled={!!cardNumber} />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Driver Name"
                            name="driverName"
                        >
                            <Input placeholder='Driver Name' disabled={!!driverName} />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Unit Number"
                            name="unitNumber"
                        >
                            <Input placeholder='Unit Number' disabled={!!unitNumber} />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Card Status"
                            name="cardStatus"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select Card Status!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select"
                                options={[
                                    { value: "Active", label: "Active" },
                                    { value: "Inactive", label: "Inactive" }
                                ]}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
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

export default CompanyAccountCardModal