import { Button, Col, DatePicker, Modal, Row, Select, Typography } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { makeOptions } from '../utils'
import dayjs from 'dayjs'
import { billingCycleOptions, billingTypeOptions } from '../constants'
import CustomTable from '../components/custom-table'
import { createInvoiceColumns } from '../sources/columns/createInvoiceColumns'

const { RangePicker } = DatePicker
const { Text } = Typography

const InvoiceModal = (props) => {
    const { isOpenModal, setIsOpenModal, getInvoiceInfo } = props

    const [isLoading, setIsLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [data, setData] = useState([])
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useState(null)
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useState(null)
    const [searchCompanyText, setSearchCompanyText] = useState('')
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(null)
    const [billingCycle, setBillingCycle] = useState(null)
    const [billingType, setBillingType] = useState(null)

    const [isAllChecked, setIsAllChecked] = useState(false)
    const [selectedIDs, setSelectedIDs] = useState([])
    const [unselectedIDs, setUnselectedIDs] = useState([])
    const [reportDesignVersion, setReportDesignVersion] = useState('V2')

    const isChecked = (id) => {
        if (isAllChecked) {
            return !unselectedIDs.includes(id)
        } else {
            return selectedIDs.includes(id) || isAllChecked
        }
    }

    const idHandler = (row) => {
        const { id } = row
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

    const [dateStrings, setDateStrings] = useState([])
    const [dateRangeValue, setDateRangeValue] = useState([])
    const onChangeRange = (dates, dateStrings) => {
        setDateRangeValue(dates)

        if(dateStrings[0] === '' && dateStrings[1] === '') {
            setDateStrings([])
        }
        else {
            setDateStrings(dateStrings)
        }
    };

    const getOrganizations = async () => {
        try {
            const response = await http.get("Organizations")
            setOrganizations(response?.data)
        } catch (error) {
            console.log(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

    const getEFSAccounts = async () => {
        try {
            const response = await http.post("EfsAccounts/filter", {
                organizationId
            })
            setEfsAccounts(response?.data?.items)
        } catch (error) {
            console.log(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
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
            console.log(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

    const filters = useMemo(() => {
        return {
            pagination: {
                pageNumber,
                pageSize,
            },
            organizationId,
            efsAccountId,
            companyIds: companyId,
            billingCycle,
            billingType
        }
    },
        [pageNumber, pageSize, organizationId, efsAccountId, companyId, billingCycle, billingType]
    )

    const getInvoicingCompanyAccounts = async () => {
        setIsLoading(true)
        try {
            const response = await http.post('CompanyAccounts/invoicing/filter', filters)
            setTotalCount(response?.data?.totalCount)
            setData(response?.data?.items)
        } catch (error) {
            console.log(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setIsLoading(false)
        }
    }

    const createInvoice = async () => {
        setSubmitLoading(true)

        if(dateStrings.length === 0) {
            toast.error("Please select date range!")
            setSubmitLoading(false)
            return
        }
        try {
            const response = await http.post('Invoices/list/v2', {
                ...filters,
                startPeriod: dateStrings[0],
                endPeriod: dateStrings[1],
                selectAllByFilter: isAllChecked,
                excludedCompanyAccountIds: unselectedIDs,
                companyAccountIds: selectedIDs,
                reportDesignVersion
            })
            if (response?.success) {
                toast.success(`Invoices successfully generated!`)
                setIsOpenModal(false)
                getInvoiceInfo()
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
        getInvoicingCompanyAccounts()

        // eslint-disable-next-line
    }, [organizationId, efsAccountId, companyId, pageNumber, pageSize, billingCycle, billingType])

    useEffect(() => {
        setSelectedIDs([])
        setUnselectedIDs([])
        setIsAllChecked(false)
    }, [organizationId, efsAccountId, companyId, billingCycle, billingType])

    return (
        <Modal
            open={isOpenModal}
            width={1600}
            title={`Create Invoice`}
            footer={[]}
            closeIcon={null}
        >
            <Row
                gutter={12}
                className='mb-5'
            >
                <Col span={4}>
                    <RangePicker
                        onChange={onChangeRange}
                        value={dateRangeValue}
                    />
                </Col>
                <Col span={4}>
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
                <Col span={4}>
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
                <Col span={4}>
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
                        mode='multiple'
                    />
                </Col>
                <Col span={4}>
                    <Select
                        className='w-[100%]'
                        placeholder="Billing Cycle"
                        options={billingCycleOptions}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={billingCycle}
                        onChange={(e) => setBillingCycle(e)}
                    />
                </Col>
                <Col span={4}>
                    <Select
                        className='w-[100%]'
                        placeholder="Billing Type"
                        options={billingTypeOptions}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={billingType}
                        onChange={(e) => setBillingType(e)}
                    />
                </Col>
            </Row>

            <CustomTable
                name="create-invoice"
                columns={createInvoiceColumns(pageNumber, pageSize, setIsAllChecked, isAllChecked, setUnselectedIDs, setSelectedIDs, isChecked)}
                data={data}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                showFilter={false}
                isRowSelection={true}
                onRowSelection={idHandler}
            />

            <Row className='mt-5'>
                <Col>
                    <Text>Total Selected: {isAllChecked ? totalCount - unselectedIDs?.length : selectedIDs?.length}/{totalCount}</Text>
                </Col>
                <Col className='ml-auto'>
                    <Text className='mr-1 font-bold'>Report Design Version: </Text>
                    <Select
                      className='mr-10'
                      options={
                          [
                              { value: 'V1', label: 'V1 - Old Design' },
                              { value: 'V2', label: 'V2 - New Design' },
                          ]
                      }
                      value={reportDesignVersion}
                      onChange={(e) => setReportDesignVersion(e)}
                    />
                    <Button className='mr-3' onClick={() => setIsOpenModal(false)}>Cancel</Button>
                    <Button htmlType='submit' type='primary' loading={submitLoading} onClick={createInvoice}>
                        Create
                    </Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default InvoiceModal