import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { 
  Alert, 
  Button, 
  Card, 
  Col, 
  Drawer, 
  DatePicker, 
  Divider,
  Input, 
  Row, 
  Select, 
  Space, 
  Statistic, 
  Tabs, 
  Typography 
} from 'antd'
import { 
  FilterOutlined, 
  SearchOutlined, 
  CloseOutlined, 
  CheckOutlined 
} from '@ant-design/icons'
import { makeOptions, reFormat, setUTCTime } from '../../utils'
import { useLocalStorageState } from 'ahooks'
import {
  billingCycleOptions,
  billingTypeOptions,
  paymentStatusOptions,
  serviceTypeConditionOptions,
  serviceTypeOptions,
} from '../../constants'
import dayjs from 'dayjs'
import InvoiceDetailsModal from '../../modals/invoiceDetailsModal'
import InvoiceEditModal from '../../modals/invoiceEditModal'
import { invoicePaymentListColumns } from '../../sources/columns/invoicePaymentListColumns'
import MoveToDebtorsModal from '../../modals/moveToDebtorsModal'
import CompanyDetailsModal from '../../modals/companyDetailsModal'

const { RangePicker } = DatePicker
const { Title, Text } = Typography
const { TabPane } = Tabs

const PaymentList = () => {
    // State variables from original component
    const [paymentSummaryInfo, setPaymentSummaryInfo] = useState({})
    const [invoiceInfo, setInvoiceInfo] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenEditModal, setIsOpenEditModal] = useState(false)
    const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false)
    const [invoiceId, setInvoiceId] = useState(null)
    const [openedCompanyId, setOpenedCompanyId] = useState(null)
    const [initialBonus, setInitialBonus] = useState(null)
    const [isOpenMoveToDebtorsModal, setIsOpenMoveToDebtorsModal] = useState(false)
    const [isOpenCompanyDetailsModal, setIsOpenCompanyDetailsModal] = useState(false)
    const [openCompanyDetailsId, setOpenCompanyDetailsId] = useState(null)

    // New state variables for improved UX
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
    const [activeFiltersCount, setActiveFiltersCount] = useState(0)

    // Local storage states from original component
    const [dateStrings, setDateStrings] = useLocalStorageState('dateStrings', {
        defaultValue: [],
    })
    const [dateRangeValue, setDateRangeValue] = useState(
      dateStrings && dateStrings.length > 0 && dateStrings[0] ?
        [dayjs(dateStrings[0], 'YYYY-MM-DD'), dayjs(dateStrings[1], 'YYYY-MM-DD')] : []
    )
    const [organizationId, setOrganizationId] = useLocalStorageState("invoicing-organizationId", { defaultValue: undefined })
    const [efsAccountId, setEfsAccountId] = useLocalStorageState("invoicing-EfsAccountId", { defaultValue: undefined })
    const [companyId, setCompanyId] = useLocalStorageState("invoicing-CompanyId", { defaultValue: undefined })
    const [billingCycle, setBillingCycle] = useLocalStorageState("invoicing-billingCycle", { defaultValue: undefined })
    const [billingType, setBillingType] = useLocalStorageState("invoicing-billingType", { defaultValue: undefined })
    const [paymentStatus, setPaymentStatus] = useLocalStorageState("invoicing-paymentStatus", { defaultValue: undefined })
    const [hasBonus, setHasBonus] = useLocalStorageState("invoicing-hasBonus", { defaultValue: undefined })
    const [isTrusted, setIsTrusted] = useLocalStorageState("invoicing-isTrusted", { defaultValue: undefined })
    const [companyStatus, setCompanyStatus] = useLocalStorageState("invoicing-companyStatus", { defaultValue: undefined })
    const [discountEditedBy, setDiscountEditedBy] = useLocalStorageState("invoicing-discountEditedBy", { defaultValue: undefined })
    
    // Other state variables from original component
    const [organizations, setOrganizations] = useState([])
    const [efsAccounts, setEfsAccounts] = useState([])
    const [searchCompanyText, setSearchCompanyText] = useState('')
    const [companies, setCompanies] = useState([])
    const [companyDataById, setCompanyDataById] = useState({})
    const [serviceTypeFilter, setServiceTypeFilter] = useState()
    const [serviceTypeCondition, setServiceTypeCondition] = useState()

    // Handler functions
    const openCompanyDetailsModal = (companyId) => {
        setIsOpenCompanyDetailsModal(true)
        setOpenCompanyDetailsId(companyId)
    }

    const openInvoiceDetailsModal = async (row) => {
        setIsOpenDetailsModal(true)
        setInvoiceId(row?.id)
        setOpenedCompanyId(row?.companyAccount?.company?.id)
        setInitialBonus(row?.bonus)
    }

    const openMoveToDebtorsModal = async (row) => {
        setIsOpenMoveToDebtorsModal(true)
        setInvoiceId(row?.id)
    }

    const onChangeRange = (dates, dateStrings) => {
        setDateRangeValue(dates)

        if (dateStrings[0] === '' && dateStrings[1] === '') {
            setDateStrings([])
        } else {
            setDateStrings(dateStrings)
        }
    }

    const onServiceTypeChange = (e) => {
        let serviceType = null

        if (e.length > 0) {
            for (let i = 0; i < e.length; i++) {
                const item = e[i]

                if (item === 'Fuel')
                    serviceType += 1

                if (item === 'Maintenance')
                    serviceType += 2

                if (item === 'MoneyCode')
                    serviceType += 4
            }
        }

        setServiceTypeFilter(serviceType)
    }

    const onServiceTypeConditionChange = (e) => {
        setServiceTypeCondition(e)
    }

    // New function to reset all filters
    const resetAllFilters = () => {
        setDateStrings([])
        setDateRangeValue([])
        setOrganizationId(undefined)
        setEfsAccountId(undefined)
        setCompanyId(undefined)
        setBillingCycle(undefined)
        setBillingType(undefined)
        setPaymentStatus(undefined)
        setHasBonus(undefined)
        setIsTrusted(undefined)
        setCompanyStatus(undefined)
        setDiscountEditedBy(undefined)
        setServiceTypeFilter(undefined)
        setServiceTypeCondition(undefined)
    }

    // API calls from original component
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
        setIsLoading(true)
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
        } finally {
            setIsLoading(false)
        }
    }

    const getCompanyById = async () => {
        try {
            const response = await http.get(`Companies/${companyId}`)
            setCompanyDataById(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    // Filters memo from original component
    const filters = useMemo(() => {
        return {
            searchTerm,
            pagination: {
                pageNumber,
                pageSize,
            },
            invoicePeriod: dateStrings && dateStrings.length > 0 && dateStrings[0] ? {
                startDate: dateStrings[0],
                endDate: dateStrings[1]
            } : undefined,
            organizationId,
            efsAccountId,
            companyId,
            billingCycle,
            invoiceStatus: paymentStatus,
            hasBonus,
            companyStatus,
            discountEditedBy,
            billingType,
            isTrusted,
            serviceType: serviceTypeFilter,
            serviceTypeCondition: serviceTypeCondition,
            sorts: [
                {
                    field: 'endPeriod',
                    isDescending: true
                },
                {
                    field: 'totalAmount',
                    isDescending: true
                },
                {
                    field: 'id',
                    isDescending: true
                }
            ]
        }
    }, [
        pageNumber, pageSize, searchTerm, dateStrings, organizationId, 
        efsAccountId, companyId, billingCycle, billingType, paymentStatus, 
        hasBonus, companyStatus, discountEditedBy, isTrusted, 
        serviceTypeFilter, serviceTypeCondition
    ])

    const getInvoiceInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Invoices/filter", filters)
            setInvoiceInfo(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getPaymentSummary = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Invoices/payment-summary", filters)
            setPaymentSummaryInfo(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    // Effect to calculate active filters count
    useEffect(() => {
        let count = 0
        if (dateStrings && dateStrings.length > 0 && dateStrings[0]) count++
        if (organizationId) count++
        if (efsAccountId) count++
        if (companyId) count++
        if (billingCycle) count++
        if (billingType) count++
        if (paymentStatus) count++
        if (hasBonus !== undefined) count++
        if (isTrusted !== undefined) count++
        if (companyStatus) count++
        if (discountEditedBy) count++
        if (serviceTypeFilter) count++
        if (serviceTypeCondition) count++
        
        setActiveFiltersCount(count)
    }, [
        dateStrings, organizationId, efsAccountId, companyId, billingCycle, 
        billingType, paymentStatus, hasBonus, isTrusted, companyStatus, 
        discountEditedBy, serviceTypeFilter, serviceTypeCondition
    ])

    // Original effects
    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

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
        if (companyId) {
            getCompanyById()
        }
        // eslint-disable-next-line
    }, [companyId])

    useEffect(() => {
        getPaymentSummary()
        getInvoiceInfo()
        // eslint-disable-next-line
    }, [filters])

    const newOptions = [
        ...makeOptions(companies, 'name'),
        { label: companyDataById?.name, value: companyDataById?.id }
    ]

    const isExist = makeOptions(companies, 'name').some(c => c.value === companyDataById?.company?.id)

    // Rendering the improved component
    return (
        <div className="payment-list-container">
            {/* Summary Cards */}
            <Card className="summary-card" style={{ marginBottom: 16 }}>
                <Row gutter={[24, 16]}>
                    <Col xs={24} md={8}>
                        <Statistic
                            title="Total Amount"
                            value={paymentSummaryInfo?.totalAmount ? reFormat(paymentSummaryInfo?.totalAmount?.toFixed(2)) : 0}
                            valueStyle={{ color: '#333333' }}
                            suffix="$"
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Statistic
                            title="Total Paid"
                            value={paymentSummaryInfo?.totalPaid ? reFormat(paymentSummaryInfo?.totalPaid?.toFixed(2)) : 0}
                            valueStyle={{ color: '#52c41a' }}
                            suffix="$"
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Statistic
                            title="Remaining Amount"
                            value={paymentSummaryInfo?.remainingAmount ? reFormat(paymentSummaryInfo?.remainingAmount?.toFixed(2)) : 0}
                            valueStyle={{ color: '#ff4d4f' }}
                            suffix="$"
                        />
                    </Col>
                </Row>
            </Card>

            {/* Main Content Card */}
            <Card className="main-content-card">
                {/* Action Bar */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
                    <Col xs={24} sm={12}>
                        <Space>
                            <Button 
                                icon={<FilterOutlined />} 
                                onClick={() => setIsFilterDrawerOpen(true)}
                                type={activeFiltersCount > 0 ? "primary" : "default"}
                            >
                                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                            </Button>
                            
                            {activeFiltersCount > 0 && (
                                <Button icon={<CloseOutlined />} onClick={resetAllFilters}>
                                    Clear Filters
                                </Button>
                            )}
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                        <Input.Search
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: '100%', maxWidth: 300 }}
                            allowClear
                        />
                    </Col>
                </Row>

                {/* Data Table */}
                <CustomTable
                    name="invoicing"
                    columns={invoicePaymentListColumns(pageNumber, pageSize, openInvoiceDetailsModal, openMoveToDebtorsModal, openCompanyDetailsModal)}
                    data={invoiceInfo}
                    size="small"
                    setPageNumber={setPageNumber}
                    setPageSize={setPageSize}
                    isLoading={isLoading}
                    pageSize={pageSize}
                    pageNumber={pageNumber}
                    totalCount={totalCount}
                    scrollY={'60vh'}
                />
            </Card>

            {/* Filter Drawer */}
            <Drawer
                title="Filter Invoices"
                placement="right"
                width={400}
                open={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
                footer={
                    <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={resetAllFilters} icon={<CloseOutlined />}>
                            Reset All
                        </Button>
                        <Button type="primary" onClick={() => setIsFilterDrawerOpen(false)} icon={<CheckOutlined />}>
                            Apply
                        </Button>
                    </Space>
                }
            >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                        <Text strong>Invoice Period</Text>
                        <RangePicker
                            style={{ width: '100%', marginTop: 8 }}
                            onChange={onChangeRange}
                            value={dateRangeValue}
                        />
                    </div>
                    
                    <Divider orientation="left">Organization Info</Divider>
                    
                    <div>
                        <Text strong>Organization</Text>
                        <Select
                            className="w-full"
                            style={{ width: '100%', marginTop: 8 }}
                            placeholder="Select Organization"
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
                    </div>
                    
                    <div>
                        <Text strong>EFS Account</Text>
                        <Select
                            className="w-full"
                            style={{ width: '100%', marginTop: 8 }}
                            placeholder="Select EFS Account"
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
                    </div>
                    
                    <div>
                        <Text strong>Company</Text>
                        <Select
                            className="w-full"
                            style={{ width: '100%', marginTop: 8 }}
                            placeholder="Select Company"
                            options={!isExist ? newOptions : makeOptions(companies, 'name')}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={companyId}
                            onChange={(e) => setCompanyId(e)}
                            onSearch={e => setSearchCompanyText(e)}
                            loading={isLoading}
                        />
                    </div>
                    
                    <Divider orientation="left">Billing Info</Divider>
                    
                    <div>
                        <Text strong>Billing Cycle</Text>
                        <Select
                            className="w-full"
                            style={{ width: '100%', marginTop: 8 }}
                            placeholder="Select Billing Cycle"
                            options={billingCycleOptions}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={billingCycle}
                            onChange={(e) => setBillingCycle(e)}
                        />
                    </div>
                    
                    <div>
                        <Text strong>Billing Type</Text>
                        <Select
                            className="w-full"
                            style={{ width: '100%', marginTop: 8 }}
                            placeholder="Select Billing Type"
                            options={billingTypeOptions}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={billingType}
                            onChange={(e) => setBillingType(e)}
                        />
                    </div>
                    
                    <div>
                        <Text strong>Payment Status</Text>
                        <Select
                            className="w-full"
                            style={{ width: '100%', marginTop: 8 }}
                            placeholder="Select Payment Status"
                            options={paymentStatusOptions}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e)}
                        />
                    </div>
                    
                    <Divider orientation="left">Additional Filters</Divider>
                    
                    <div>
                        <Text strong>Has Bonus</Text>
                        <Select
                            className="w-full"
                            style={{ width: '100%', marginTop: 8 }}
                            placeholder="Select Bonus Status"
                            options={[
                                { value: true, label: "Yes" },
                                { value: false, label: "No" }
                            ]}
                            allowClear
                            value={hasBonus}
                            onChange={(e) => setHasBonus(e)}
                        />
                    </div>
                    
                    <div>
                        <Text strong>Company Status</Text>
                        <Select
                            className="w-full"
                            style={{ width: '100%', marginTop: 8 }}
                            placeholder="Select Company Status"
                            options={[
                                { value: "Active", label: "Active" },
                                { value: "Inactive", label: "Inactive" }
                            ]}
                            allowClear
                            value={companyStatus}
                            onChange={(e) => setCompanyStatus(e)}
                        />
                    </div>
                    
                    <div>
                        <Text strong>Service Type</Text>
                        <Select
                            className="w-full"
                            style={{ width: '100%', marginTop: 8 }}
                            placeholder="Select Service Type"
                            options={serviceTypeOptions}
                            allowClear
                            mode="multiple"
                            value={serviceTypeFilter}
                            onChange={(e) => onServiceTypeChange(e)}
                        />
                    </div>
                    
                    <div>
                        <Text strong>Service Type Condition</Text>
                        <Select
                            className="w-full"
                            style={{ width: '100%', marginTop: 8 }}
                            placeholder="Select Condition"
                            options={serviceTypeConditionOptions}
                            allowClear
                            value={serviceTypeCondition}
                            onChange={(e) => onServiceTypeConditionChange(e)}
                        />
                    </div>
                </Space>
            </Drawer>

            {/* Modals - keeping the original implementations */}
            {isOpenEditModal && (
                <InvoiceEditModal
                    isOpenEditModal={isOpenEditModal}
                    setIsOpenEditModal={setIsOpenEditModal}
                    getInvoiceInfo={getInvoiceInfo}
                    invoiceId={invoiceId}
                />
            )}

            {isOpenDetailsModal && invoiceId && (
                <InvoiceDetailsModal
                    isOpenDetailsModal={isOpenDetailsModal}
                    setIsOpenDetailsModal={setIsOpenDetailsModal}
                    invoiceId={invoiceId}
                    openedCompanyId={openedCompanyId}
                    initialBonus={initialBonus}
                    getInvoiceInfo={getInvoiceInfo}
                />
            )}

            {isOpenMoveToDebtorsModal && invoiceId && (
                <MoveToDebtorsModal
                    isOpenMoveToDebtorsModal={isOpenMoveToDebtorsModal}
                    setIsOpenMoveToDebtorsModal={setIsOpenMoveToDebtorsModal}
                    invoiceId={invoiceId}
                />
            )}

            {isOpenCompanyDetailsModal && (
                <CompanyDetailsModal
                    isOpenModal={isOpenCompanyDetailsModal}
                    setIsOpenModal={setIsOpenCompanyDetailsModal}
                    companyId={openCompanyDetailsId}
                />
            )}
        </div>
    )
}

export default PaymentList