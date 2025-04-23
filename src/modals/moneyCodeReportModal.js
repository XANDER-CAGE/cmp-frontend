import { Button, Col, DatePicker, Form, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { makeOptions } from '../utils'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { feeTypeOptions } from '../constants'

const { RangePicker } = DatePicker

const MoneyCodeReportModal = (props) => {
    const { isOpenMoneyCodeReportModal, setIsOpenMoneyCodeReportModal } = props

    const [form] = Form.useForm()

    const [companies, setCompanies] = useState([])
    const [companySearch, setCompanySearch] = useState('')
    const [companiesLoading, setCompaniesLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

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
            const response = await http.post('/MoneyCodesReport/generate', {
                ...values,
                period: {
                    startDate: dateStrings[0],
                    endDate: dateStrings[1]
                }
            }, {
                responseType: 'arraybuffer',
            })
            const item = companies?.find((item) => item.id === values.companyId)
            const fileName = `${item?.name} INC_report [${dateStrings[0]} ${dateStrings[1]}]`

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
            toast.error('Money Codes Not Found!')
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
            open={isOpenMoneyCodeReportModal}
            width={600}
            title={`Money Code Report`}
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
                    {/*<Col span={24}>*/}
                    {/*    <Form.Item*/}
                    {/*        label="Fee Type"*/}
                    {/*        name="feeType"*/}
                    {/*        rules={[*/}
                    {/*            {*/}
                    {/*                required: true,*/}
                    {/*                message: 'Please select fee type!',*/}
                    {/*            },*/}
                    {/*        ]}*/}
                    {/*    >*/}
                    {/*        <Select*/}
                    {/*            placeholder="Select"*/}
                    {/*            defaultValue={"Fee"}*/}
                    {/*            options={feeTypeOptions}*/}
                    {/*        />*/}
                    {/*    </Form.Item>*/}
                    {/*</Col>*/}
                </Row>
                <Row>
                    <Col className='ml-auto'>
                        <Button className='mr-3' disabled={isLoading} onClick={() => setIsOpenMoneyCodeReportModal(false)}>Close</Button>
                        <Button type='primary' htmlType='submit' loading={isLoading} disabled={isLoading}>Generate</Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default MoneyCodeReportModal