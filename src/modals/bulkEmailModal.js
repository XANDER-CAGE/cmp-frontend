import { Button, Checkbox, Col, DatePicker, Input, Modal, Row, Select, Table, Typography } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { makeOptions, setTashkentTime } from '../utils'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { billingCycleOptions, paymentStatusOptions } from '../constants'
import dayjs from 'dayjs'
import { get } from 'lodash'

const Text = Typography
const { RangePicker } = DatePicker

const BulkEmailModal = (props) => {
    const { isOpenBulkEmailModal, setIsOpenBulkEmailModal } = props

    const [isLoading, setIsLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useState(null)
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useState(null)
    const [searchCompanyText, setSearchCompanyText] = useState('')
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [data, setData] = useState([])

    const [isAllChecked, setIsAllChecked] = useState(false)
    const [selectedIDs, setSelectedIDs] = useState([])
    const [unselectedIDs, setUnselectedIDs] = useState([])

    const [billingCycle, setBillingCycle] = useState(undefined)
    const [invoiceStatus, setInvoiceStatus] = useState(undefined)
    const [hasSent, setHasSent] = useState(undefined)
    const [searchTerm, setSearchTerm] = useState(undefined)

    const defaultDates = useMemo(() => {
        const startOfWeek = dayjs().startOf('week')
        const endOfWeek = dayjs().endOf('week')
        return [startOfWeek, endOfWeek];
    }, []);
    const setDefaultDate = true
    const [dateStrings, setDateStrings] = useState(
        setDefaultDate ? (defaultDates.map((date) => date.format('YYYY-MM-DD'))) : [],
    )
    const [dateRangeValue, setDateRangeValue] = useState(
        setDefaultDate ? defaultDates : undefined,
    )
    const onChangeRange = (dates, dateStrings) => {
        setDateRangeValue(dates)

        if(dateStrings[0] === '' && dateStrings[1] === '') {
            setDateStrings([])
        }
        else {
            setDateStrings(dateStrings)
        }
    };

    const filters = useMemo(() => {
        return {
            organizationId: organizationId,
            efsAccountId: efsAccountId,
            companyId: companyId,
            billingCycle,
            invoicePeriod: get(dateStrings, '[0]', '')
                ? {
                    startDate: get(dateStrings, '[0]', ''),
                    endDate: get(dateStrings, '[1]', ''),
                }
                : undefined,
            pagination: {
                pageNumber,
                pageSize,
            },
            hasSentEmail: hasSent,
        }
    }, [organizationId, efsAccountId, companyId, pageSize, pageNumber, billingCycle, hasSent, dateStrings])

    const isChecked = (id) => {
        if (isAllChecked) {
            return !unselectedIDs.includes(id)
        } else {
            return selectedIDs.includes(id) || isAllChecked
        }
    }

    const idHandler = (id) => {
        if (isAllChecked) {
            if (unselectedIDs.includes(id)) {
                setUnselectedIDs(unselectedIDs.filter((item) => item !== id))
            } else {
                setUnselectedIDs((prev) => [...prev, id])
            }
        } else {
            if (selectedIDs.includes(id)) {
                setSelectedIDs(selectedIDs.filter((item) => item !== id))
            } else {
                setSelectedIDs((prev) => [...prev, id])
            }
        }
    }

    const columnsInvoice = useMemo(
        () => [
            {
                title: (
                    <Checkbox
                        onClick={() => {
                            setIsAllChecked(!isAllChecked)
                            setUnselectedIDs([])
                            setSelectedIDs([])
                        }}
                        checked={isAllChecked}
                    />
                ),
                dataIndex: 'id',
                key: 'id',
                render: (id) => {
                    return <Checkbox checked={isChecked(id)}></Checkbox>
                },
                width: 50,
                align: 'center'
            },
            {
                title: `Organization`,
                dataIndex: 'organizationName',
                key: 'organizationName',
                type: 'string',
                width: 250,
                align: 'center'
            },
            {
                title: `EFS Account`,
                dataIndex: 'efsAccountName',
                key: 'efsAccountName',
                type: 'string',
                width: 250,
                align: 'center'
            },
            {
                title: `Company`,
                dataIndex: 'companyName',
                key: 'companyName',
                type: 'string',
                width: 300,
                align: 'center'
            },
            {
                title: `Has sent?`,
                dataIndex: 'isSentToEmail',
                key: 'isSentToEmail',
                width: 100,
                render: (isSentToEmail) => {
                    return <>{isSentToEmail ? <p style={{ color: 'green' }}>Yes</p> : <p style={{ color: 'red' }}>No</p>}</>
                },
                align: 'center'
            },
            {
                title: `Status`,
                dataIndex: 'status',
                key: 'status',
                type: 'string',
                width: 120,
                align: 'center'
            },
            {
                title: `Billing Cycle`,
                dataIndex: 'billingCycle',
                key: 'billingCycle',
                type: 'string',
                width: 120,
                align: 'center'
            },
            {
                title: `Period`,
                type: 'string',
                width: 200,
                render: (data) => (
                    <div>
                        {setTashkentTime(data?.startPeriod, 'YYYY-MM-DD')} {' '}
                        {setTashkentTime(data?.endPeriod, 'YYYY-MM-DD')}
                    </div>
                ),
                align: 'center'
            },
        ],

        // eslint-disable-next-line
        [selectedIDs, unselectedIDs, isAllChecked],
    )

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
            const response = await http.post("EfsAccounts/filter", {
                organizationId
            })
            setEfsAccounts(response?.data?.items)
        } catch (error) {
            console.log(error)
        }
    }

    const getCompanies = async () => {
        try {
            const response = await http.post("Companies/discounting/filter/v2", {
                organizationId,
                efsAccountId,
                pagination: {
                    pageNumber: 1,
                    pageSize: 20
                },
                searchTerm: searchCompanyText
            })
            setCompanies(response?.data?.items)
        } catch (error) {
            console.log(error)
        }
    }

    const getBulkEmails = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`/Invoices/filter/bulk-email/v2`, filters)
            setData(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const submitForm = async () => {
        setSubmitLoading(true)
        const data = {
            ...filters,
            selectAllByFilter: isAllChecked,
            excludedInvoiceIds: unselectedIDs,
            selectedInvoiceIds: selectedIDs,
        }
        try {
            const response = await http.post('/Invoices/send/bulk-email/v2', data)

            if (response?.code === 500) {
                toast.error(response?.error)
            }

            if (response?.success) {
                toast.success(`Successfully sent ${response?.data?.successCount} email(s)`)
                toast.info(`Unsuccessfully was ${response?.data?.failedCount} email(s)`)
            }

            getBulkEmails()

        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setSubmitLoading(false)
        }
    }

    useEffect(() => {
        getOrganizations()
    }, [])

    useEffect(() => {
        getEFSAccounts()

        // eslint-disable-next-line
    }, [organizationId])

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [organizationId, efsAccountId, searchCompanyText])

    useEffect(() => {
        getBulkEmails()

        // eslint-disable-next-line
    }, [organizationId, efsAccountId, companyId, pageNumber, pageSize, dateStrings, billingCycle, searchTerm, hasSent, billingCycle, invoiceStatus])

    return (
        <Modal
            open={isOpenBulkEmailModal}
            width={1800}
            title={`Sending Bulk Email(s)`}
            footer={[]}
            closeIcon={null}
        >
            <Row
                gutter={12}
            >
                <Col span={4}>
                    <RangePicker
                        onChange={onChangeRange}
                        value={dateRangeValue}
                    />
                </Col>
                <Col span={3}>
                    <Select
                        className='w-[100%]'
                        placeholder="Organization"
                        options={makeOptions(organizations, 'name')}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={organizationId}
                        onChange={(e) => {
                            setOrganizationId(e)
                            setEfsAccountId(null)
                            setCompanyId(null)
                        }}
                    />
                </Col>
                <Col span={3}>
                    <Select
                        className='w-[100%]'
                        placeholder="EFS Account"
                        options={makeOptions(efsAccounts, 'name')}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={efsAccountId}
                        onChange={(e) => {
                            setEfsAccountId(e)
                            setCompanyId(null)
                        }}
                    />
                </Col>
                <Col span={3}>
                    <Select
                        className='w-[100%]'
                        placeholder="Company"
                        options={makeOptions(companies, 'name')}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={companyId}
                        onChange={(e) => setCompanyId(e)}
                        onSearch={e => setSearchCompanyText(e)}
                    />
                </Col>
                <Col span={3}>
                    <Select
                        value={billingCycle}
                        className='w-[100%]'
                        placeholder="Billing Cycle"
                        allowClear
                        options={billingCycleOptions}
                        onChange={(value) => setBillingCycle(value)}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Col>
                <Col span={3}>
                    <Select
                        value={invoiceStatus}
                        placeholder="Payment Status"
                        allowClear
                        options={paymentStatusOptions}
                        onChange={(value) => setInvoiceStatus(value)}
                        className='w-[100%]'
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Col>
                <Col span={3}>
                    <Select
                        value={hasSent}
                        placeholder="Has Sent?"
                        allowClear
                        options={[
                            { value: null, label: 'All' },
                            { value: true, label: 'Yes' },
                            { value: false, label: 'No' },
                        ]}
                        onChange={(value) => setHasSent(value)}
                        className='w-[100%]'
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Col>
                <Col span={2}>
                    <Input.Search
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        className='w-[100%]'
                    />
                </Col>
            </Row>

            <Row className='mt-5'>
                <Table
                    dataSource={data}
                    rowKey={`id`}
                    columns={columnsInvoice}
                    size="small"
                    loading={isLoading}
                    pagination={{
                        total: totalCount,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    onChange={(pagination) => {
                        setPageSize(pagination.pageSize)
                        setPageNumber(pagination.current)
                    }}
                    scroll={{
                        y: '50vh',
                    }}
                    onRow={(row) => {
                        return {
                            onClick: () => {
                                idHandler(row?.id)
                            },
                        }
                    }} />
            </Row>

            <Row className='mt-5'>
                <Text>Total: {isAllChecked ? totalCount - unselectedIDs?.length : selectedIDs?.length}/{totalCount}</Text>
                <Col className='ml-auto'>
                    <Button className='mr-3' disabled={submitLoading} onClick={() => setIsOpenBulkEmailModal(false)}>Close</Button>
                    <Button type='primary' loading={submitLoading} disabled={submitLoading} onClick={submitForm}>Send</Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default BulkEmailModal