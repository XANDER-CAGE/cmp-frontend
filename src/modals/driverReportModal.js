import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Table, Typography } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { makeOptions } from '../utils'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

const { RangePicker } = DatePicker
const Text = Typography

const DriverReportModal = (props) => {
    const { isOpenDriverReportModal, setIsOpenDriverReportModal } = props

    const [form] = Form.useForm()

    const [companies, setCompanies] = useState([])
    const [companySearch, setCompanySearch] = useState('')
    const [companiesLoading, setCompaniesLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [discounted, setDiscounted] = useState(false)
    const [allInOne, setAllInOne] = useState(false)
    const [companyAccountId, setCompanyAccountId] = useState(null)
    const [exportType, setExportType] = useState(null)
    const [allDrivers, setAllDrivers] = useState([])
    const [allDriversView, setAllDriversView] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedRows, setSelectedRows] = useState([])

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

    const driversHandler = (item) => {
        item.isSelected = !item.isSelected
        setAllDrivers([...allDrivers])
    }

    const [isAllChecked, setIsAllChecked] = useState(false)
    const toggleCheckAll = () => {
        allDrivers.forEach((item) => (item.isSelected = !isAllChecked))
        setAllDrivers([...allDrivers])
        setIsAllChecked(!isAllChecked)
    }

    const columnsInvoice = useMemo(
        () => [
            {
                title: <Checkbox onChange={toggleCheckAll} checked={isAllChecked} />,
                render: (row) => {
                    return <Checkbox checked={row?.isSelected}></Checkbox>
                },
                width: 50,
            },
            {
                title: `Driver Name`,
                key: 'driverName',
                dataIndex: 'driverName',
                width: 200,
            },
            {
                title: `Unit Number`,
                key: 'unitNumber',
                dataIndex: 'unitNumber',
                width: 150,
            },
            {
                title: `Card Number`,
                key: 'cardNumber',
                dataIndex: 'cardNumber',
                width: 200,
            },
        ],

        // eslint-disable-next-line
        [allDrivers, isAllChecked],
    )

    const getCompanyAccounts = async () => {
        setCompaniesLoading(true)
        try {
            const response = await http.post("CompanyAccounts/invoicing/filter/", {
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

    const getDrivers = async () => {
        setAllDrivers([])
        try {
            const response = await http.post('/InvoiceSubReport/driver-names', {
                companyAccountId,
                period: dateRangeValue
                    ? { startDate: dateStrings[0], endDate: dateStrings[1] }
                    : undefined,
            })

            response?.data?.forEach((item) => {
                setAllDrivers((prev) => [...prev, { ...item, isSelected: false, key: `row-${uuidv4()}` }])
            })
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async () => {
        setIsLoading(true)

        const data = {
            companyAccountId: companyAccountId,
            drivers: selectedRows,
            discounted,
            allInOne,
            exportType,
            period: dateRangeValue
                ? { startDate: dateStrings[0], endDate: dateStrings[1] }
                : undefined,
        }
        try {
            const response = await http.post('/InvoiceSubReport/generate', data, {
                responseType: 'arraybuffer',
            })
            const item = companies?.find((item) => item.id === data.companyAccountId)
            const fileName = `${item?.organization?.name} (org), ${item?.efsAccount?.name} (efs), ${item?.company?.name} (com) [${data?.period?.startDate} ${data?.period?.endDate}]`

            const url = window.URL.createObjectURL(
                new Blob([response], {
                    type: 'application/zip',
                }),
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${fileName}.zip`)
            document.body.appendChild(link)
            link.click()
            return 1
        } catch (error) {
            console.log(error)
            toast.error('Error while generating transactions report!')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCompanyAccounts()

        // eslint-disable-next-line
    }, [companySearch])

    useEffect(() => {
        if (companyAccountId && dateRangeValue) {
            getDrivers()
        }

        // eslint-disable-next-line
    }, [companyAccountId, dateRangeValue])

    useEffect(() => {
        setSelectedRows([])
        allDrivers.forEach((d) => {
            if (d.isSelected) {
                setSelectedRows((prev) => [...prev, d])
            }
        })
    }, [allDrivers])

    useEffect(() => {
        setSelectedRows([])
        setIsAllChecked(false)
    }, [dateRangeValue])

    const searchFilter = () => {
        const filteredArr = allDrivers?.filter(
            (driver) =>
                driver?.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                driver?.cardNumber?.includes(searchTerm) ||
                driver?.unitNumber?.includes(searchTerm),
        )
        setAllDriversView(filteredArr)
    }

    useEffect(() => {
        searchFilter()

        // eslint-disable-next-line
    }, [searchTerm])

    useEffect(() => {
        setAllDriversView(
            allDrivers.sort((a, b) => {
                const selectedA = a.isSelected ? 1 : 0
                const selectedB = b.isSelected ? 1 : 0
                return selectedB - selectedA
            }),
        )
    }, [allDrivers])

    return (
        <Modal
            open={isOpenDriverReportModal}
            width={800}
            title={`Driver Report`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="driver-modal"
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
                                    message: 'Please select a company account!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Company Account"
                                options={makeOptions(
                                    companies,
                                    (item) =>
                                        `${item?.organization?.name} (org), ${item?.efsAccount?.name} (efs), ${item?.company?.name} (com)`
                                )}
                                loading={companiesLoading}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                onSearch={e => setCompanySearch(e)}
                                value={companyAccountId}
                                onChange={e => setCompanyAccountId(e)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Period"
                            name={'period'}
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
                        <Form.Item
                            label="Export Type"
                            name="exportType"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select an export type!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Export Type"
                                options={[
                                    { label: 'PDF', value: 'Pdf' },
                                    { label: 'Excel', value: 'Excel' },
                                    { label: 'All', value: 'All' },
                                ]}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                value={exportType}
                                onChange={e => setExportType(e)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Checkbox checked={discounted} onChange={(e) => setDiscounted(e.target.checked)}>Discount</Checkbox>
                    </Col>
                    <Col span={24} className='my-5'>
                        <Checkbox checked={allInOne} onChange={(e) => setAllInOne(e.target.checked)}>All In One</Checkbox>
                    </Col>
                </Row>

                <Row>
                    <Col span={8} className="ml-auto mb-3">
                        <Input.Search
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Table
                        dataSource={allDriversView}
                        rowKey={`id`}
                        columns={columnsInvoice}
                        size="small"
                        scroll={{ y: '200px' }}
                        pagination={{
                            total: allDriversView?.length,
                            showSizeChanger: false,
                            pageSizeOptions: ['10'],
                        }}
                        onRow={(row) => {
                            return {
                                onClick: () => {
                                    driversHandler(row)
                                },
                            }
                        }}
                    />
                </Row>

                <Row className='mt-5'>
                    <Text>Total: {selectedRows?.length}/{allDriversView?.length}</Text>
                    <Col className='ml-auto'>
                        <Button className='mr-3' disabled={isLoading} onClick={() => setIsOpenDriverReportModal(false)}>Close</Button>
                        <Button type='primary' htmlType='submit' loading={isLoading} disabled={isLoading}>Generate</Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default DriverReportModal