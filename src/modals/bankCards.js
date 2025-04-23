import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { makeOptions } from '../utils';

const BankCardsModal = (props) => {
    const { isOpenModal, getBankCards, closeModal, editId } = props

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

    const getBankCardsById = async () => {
        try {
            const response = await http.get(`CompanyBankCards/${editId}`)
            setDataById(response?.data)
            form.setFieldValue('companyId', response?.data?.companyId)
            form.setFieldValue('cardholderName', response?.data?.cardholderName)
            form.setFieldValue('cardNumber', response?.data?.cardNumber)
            form.setFieldValue('expirationDate', response?.data?.expirationDate)
            form.setFieldValue('cvv', response?.data?.cvv)
            form.setFieldValue('notes', response?.data?.notes)
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async (values) => {
        setSubmitLoading(true)
        try {
            const response = editId ? await http.put(`CompanyBankCards/${editId}/`, { ...values, id: editId }) : await http.post('CompanyBankCards', values)
            if (response?.success) {
                toast.success(`Succesfully ${editId ? 'updated' : 'added'}!`)
                closeModal()
                getBankCards()
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
            getBankCardsById()
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
            title={`${editId ? "Edit" : "Add"} Bank Card`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="bankCard-modal"
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
                            label="Cardholder Name"
                            name="cardholderName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Cardholder Name!',
                                },
                            ]}
                        >
                            <Input placeholder='Cardholder Name' />
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
                            <Input placeholder='Bank Card Number' />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Expiration Date"
                            name="expirationDate"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Expiration Date!',
                                },
                            ]}
                        >
                            <Input placeholder='__/__' />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="CVV"
                            name="cvv"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input CVV!',
                                },
                            ]}
                        >
                            <Input placeholder='CVV' />
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

export default BankCardsModal