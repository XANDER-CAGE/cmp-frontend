import { Button, Checkbox, Col, DatePicker, Form, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { makeOptions } from '../utils'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'

const { RangePicker } = DatePicker

const TransactionReportModal = (props) => {
    const { isOpenTransactionsReportModal, setIsOpenTransactionsReportModal } = props

    const [form] = Form.useForm()

    const [companies, setCompanies] = useState([])
    const [companySearch, setCompanySearch] = useState('')
    const [companiesLoading, setCompaniesLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [discounted, setDiscounted] = useState(false)

    const [dateStrings, setDateStrings] = useState([])
    const [dateRangeValue, setDateRangeValue] = useState(undefined)
    const onChangeRange = (dates, dateStrings) => {
        setDateRangeValue(dates)

        if(dateStrings[0] === '' && dateStrings[1] === '') {
            setDateStrings([])
        }
        else {
            setDateStrings(dateStrings)
        }
    };

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

    const submitForm = async (values) => {
        setIsLoading(true)
        try {
            const response = await http.post('/TransactionsReport/generate', {
                ...values,
                discounted,
                period: {
                    startDate: dateStrings && dateStrings.length > 0 ? dateStrings[0] : null,
                    endDate: dateStrings && dateStrings.length > 0 ? dateStrings[1] : null
                }
            }, {
                responseType: 'arraybuffer',
            })
            const company = companies?.find((item) => item.id === values.companyId)
            const fileName = `${company?.name}${discounted ? '_discount' : ''}_report [${dateStrings[0]} ${dateStrings[1]}]`

            const url = window.URL.createObjectURL(
                new Blob([response], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                }),
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${fileName}.xlsx`)
            document.body.appendChild(link)
            link.click()
            return 1
        } catch (error) {
            console.log(error)
            toast.error('No transactions Found!')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [companySearch])

    return (
        <Modal
            open={isOpenTransactionsReportModal}
            width={600}
            title={`Transaction Report`}
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
                                options={makeOptions(companies, 'name')}
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
                            label="Period"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select period!',
                                },
                            ]}
                        >
                            <RangePicker
                                onChange={onChangeRange}
                                value={dateRangeValue}
                                className='w-[100%]'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Checkbox checked={discounted} onChange={(e) => setDiscounted(e.target.checked)}>Discount</Checkbox>
                    </Col>
                </Row>
                <Row>
                    <Col className='ml-auto'>
                        <Button className='mr-3' disabled={isLoading} onClick={() => setIsOpenTransactionsReportModal(false)}>Close</Button>
                        <Button type='primary' htmlType='submit' loading={isLoading} disabled={isLoading}>Generate</Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default TransactionReportModal