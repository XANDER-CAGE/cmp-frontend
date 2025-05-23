import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Collapse, DatePicker, Input, Row, Select, Statistic, Typography } from 'antd';
import { makeOptions, reFormat } from '../../utils'
import { FaFilter } from 'react-icons/fa'
import { useLocalStorageState } from 'ahooks'
import { billingCycleOptions, billingTypeOptions, debtorTypeOptions, paymentStatusOptions } from '../../constants'
import dayjs from 'dayjs'
import { get } from 'lodash'
import InvoiceDetailsModal from '../../modals/invoiceDetailsModal'
import { debtorsColumns } from '../../sources/columns/debtorsColumns'
import { toast } from 'react-toastify'
import { useUserInfo } from '../../contexts/UserInfoContext';
import CompanyDetailsModal from '../../modals/companyDetailsModal';

const { RangePicker } = DatePicker
const Text = Typography

const Debtors = () => {
    const {permissions} = useUserInfo();

    const [paymentSummaryInfo, setPaymentSummaryInfo] = useState({})
    const [invoiceInfo, setInvoiceInfo] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false)
    const [invoiceId, setInvoiceId] = useState(null)
    const [openedCompanyId, setOpenedCompanyId] = useState(null)
    const [initialBonus, setInitialBonus] = useState(null)


    const openCompanyDetailsModal = (companyId) => {
        setIsOpenCompanyDetailsModal(true);
        setOpenCompanyDetailsId(companyId);
        console.log(companyId)
    }
    const [isOpenCompanyDetailsModal, setIsOpenCompanyDetailsModal] = useState(false);
    const [openCompanyDetailsId, setOpenCompanyDetailsId] = useState(null);

    const [dateStrings, setDateStrings] = useLocalStorageState('dateStrings', {
        defaultValue: []
    })
    const [dateRangeValue, setDateRangeValue] = useState(
      dateStrings && dateStrings.length > 0 && dateStrings[0] ?
        [dayjs(dateStrings[0], 'YYYY-MM-DD'), dayjs(dateStrings[1], 'YYYY-MM-DD')] :
        []);

    const onChangeRange = (dates, dateStrings) => {
        setDateRangeValue(dates)

        if(dateStrings[0] === '' && dateStrings[1] === '') {
            setDateStrings([])
        }
        else {
            setDateStrings(dateStrings)
        }
    };

    const openInvoiceDetailsModal = async (row) => {
        setIsOpenDetailsModal(true)
        setInvoiceId(row?.id)
        setOpenedCompanyId(row?.companyAccount?.company?.id)
        setInitialBonus(row?.bonus)
    }

    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("invoicingFilter", { defaultValue: false })
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useLocalStorageState("invoicing-organizationId", { defaultValue: undefined })
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useLocalStorageState("invoicing-EfsAccountId", { defaultValue: undefined })
    const [searchCompanyText, setSearchCompanyText] = useState('')
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useLocalStorageState("invoicing-CompanyId", { defaultValue: undefined })
    const [billingCycle, setBillingCycle] = useLocalStorageState("invoicing-billingCycle", { defaultValue: undefined })
    const [billingType, setBillingType] = useLocalStorageState("invoicing-billingType", { defaultValue: undefined })
    const [paymentStatus, setPaymentStatus] = useLocalStorageState("invoicing-paymentStatus", { defaultValue: undefined })
    const [hasBonus, setHasBonus] = useLocalStorageState("invoicing-hasBonus", { defaultValue: undefined })
    const [companyStatus, setCompanyStatus] = useLocalStorageState("invoicing-companyStatus", { defaultValue: undefined })
    const [discountEditedBy, setDiscountEditedBy] = useLocalStorageState("invoicing-discountEditedBy", { defaultValue: undefined })
    const [debtorType, setDebtorType] = useLocalStorageState("invoicing-debtorType", { defaultValue: null })
    const [companyDataById, setCompanyDataById] = useState({})
    const [isLoadingExportTable, setIsLoadingExportTable] = useState(false);

    const filters = useMemo(() => {
        return {
            searchTerm,
            pagination: {
                pageNumber,
                pageSize,
            },
            invoicePeriod: dateStrings && dateStrings.length > 0 ? {
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
            debtorType
        }
    },
        [pageNumber, pageSize, searchTerm, dateStrings, organizationId, efsAccountId, companyId, billingCycle, billingType, paymentStatus, hasBonus, companyStatus, discountEditedBy, debtorType]
    )

    const newOptions = [
        ...makeOptions(companies, 'name'),
        { label: companyDataById?.name, value: companyDataById?.id }

    ]

    const isExist = makeOptions(companies, 'name').some(c => c.value === companyDataById?.company?.id)

    const filterItems = [
        {
            key: '1',
            label: 'Tap to Filter',
            children:
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <RangePicker
                            onChange={onChangeRange}
                            value={dateRangeValue}
                        />
                    </Col>
                    <Col span={6}>
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
                    <Col span={6}>
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
                    <Col span={6}>
                        <Select
                            className='w-[100%]'
                            placeholder="Company"
                            options={!isExist ? newOptions : makeOptions(companies, 'name')}
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
                    <Col span={6}>
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
                    <Col span={6}>
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
                    <Col span={6}>
                        <Select
                            className='w-[100%]'
                            placeholder="Payment Status"
                            options={paymentStatusOptions}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={paymentStatus}
                            onChange={(e) => setPaymentStatus(e)}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            className='w-[100%]'
                            placeholder="Has Bonus"
                            options={[
                                { value: true, label: "Yes" },
                                { value: false, label: "No" }
                            ]}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={hasBonus}
                            onChange={(e) => setHasBonus(e)}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            className='w-[100%]'
                            placeholder="Company Status"
                            options={[
                                { value: "Active", label: "Active" },
                                { value: "Inactive", label: "Inactive" }
                            ]}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={companyStatus}
                            onChange={(e) => setCompanyStatus(e)}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            className='w-[100%]'
                            placeholder="Discount Edited By"
                            options={[
                                { value: "ByDiscount", label: "ByDiscount" },
                                { value: "ByPercentage", label: "ByPercentage" }
                            ]}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={discountEditedBy}
                            onChange={(e) => setDiscountEditedBy(e)}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            className='w-[100%]'
                            placeholder="Debtor Type"
                            options={debtorTypeOptions}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={debtorType}
                            onChange={(e) => setDebtorType(e)}
                        />
                    </Col>
                </Row>
        }
    ]

    const downloadInvoice = async (row, type) => {
        try {
            const response = await http.get(`Invoices/${row?.id}/download?invoiceReportFormat=${type}`, {
                responseType: 'arraybuffer'
            })

            const href = window.URL.createObjectURL(
                new Blob([response], {
                    type: 'application/zip',
                }),
            )

            const link = document.createElement('a')
            link.href = href
            link.setAttribute(
                'download',
                `Invoice` +
                `${row?.companyAccount?.company?.name} (com), ` +
                `${row?.companyAccount?.organization?.name} (org), ` +
                `${row?.companyAccount?.efsAccount?.name} (efs), ` +
                `${row.companyAccount?.accountName}. Number ${row.invoiceNumber}. ` +
                `Date ${row.invoiceDate.slice(0, 10)}.${type === 'EXCEL' ? 'xlsx' : 'pdf'}`,
            )
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(href)
        } catch (error) {
            if (!error?.response?.data)
                return 1

            const decoder = new TextDecoder()
            const errorMessage = decoder.decode(error?.response?.data)
            toast.error(errorMessage)
        }
    }

    const exportTable = async () => {
        setIsLoadingExportTable(true);

        try {
            const response = await http.post('Invoices/Debtors/export', filters, {
                responseType: 'arraybuffer',
            });
            const url = window.URL.createObjectURL(
              new Blob([response], {
                  type: 'application/zip',
              }),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `table.xlsx`);
            document.body.appendChild(link);
            link.click();
            return 1;
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
        } finally {
            setIsLoadingExportTable(false);
        }
    };

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

    const getInvoiceInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Invoices/Debtors/filter", filters)
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
            const response = await http.post("Invoices/debtor-summary", filters)
            setPaymentSummaryInfo(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

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
        getInvoiceInfo()
        getPaymentSummary()

        // eslint-disable-next-line
    }, [filters])

    return (
        <div className='box'>
            <div className='mb-5'>
                <Row gutter={[16, 16]}>
                    <Col span={4}>
                        <Statistic
                          title="Total Amount:"
                          value={paymentSummaryInfo?.totalAmount ? reFormat(paymentSummaryInfo?.totalAmount?.toFixed(2)) : 0}
                          valueStyle={{
                              color: '#333333',
                          }}
                          suffix="$"
                        />
                    </Col>
                    <Col span={4}>
                        <Statistic
                          title="Total Paid:"
                          value={paymentSummaryInfo?.totalPaid ? reFormat(paymentSummaryInfo?.totalPaid?.toFixed(2)) : 0}
                          valueStyle={{
                              color: '#52c41a',
                          }}
                          suffix="$"
                        />
                    </Col>
                    <Col span={4}>
                        <Statistic
                          title="Remaining Amount:"
                          value={paymentSummaryInfo?.remainingAmount ? reFormat(paymentSummaryInfo?.remainingAmount?.toFixed(2)) : 0}
                          valueStyle={{
                              color: '#ff4d4f',
                          }}
                          suffix="$"
                        />
                    </Col>
                </Row>
                {/*<Text><b>Total Amount:</b> {reFormat(paymentSummaryInfo.totalAmount)}$</Text>*/}
                {/*<Text className='mx-[50px]'><b>Total Paid:</b> <span className='text-[green]'>{reFormat(paymentSummaryInfo.totalPaid)}$</span></Text>*/}
                {/*<Text><b>Remaining Amount:</b> <span className='text-[red]'>{reFormat(paymentSummaryInfo.remainingAmount)}$</span></Text>*/}
            </div>

            <Row className='mb-5'>
                <Col span={18}>
                    <Collapse
                        style={{ width: '100%' }}
                        items={filterItems}
                        bordered={false}
                        activeKey={isOpenFilter ? ['1'] : null}
                        size='small'
                        expandIconPosition='end'
                        expandIcon={() => <FaFilter />}
                        onChange={() => setIsOpenFilter(!isOpenFilter)}
                    />
                </Col>
                <Col
                  span={6}
                >
                    <Row className='mb-3'>
                        <Col className='flex ml-auto'>
                            <Button
                              type="primary"
                              className="ml-3"
                              onClick={exportTable}
                              disabled={isLoadingExportTable}
                              loading={isLoadingExportTable}
                            >
                                Export Table
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='flex ml-auto'>
                            <Input.Search
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              placeholder="Search"
                              allowClear
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <CustomTable
                name="debtors"
                columns={debtorsColumns(pageNumber, pageSize, openInvoiceDetailsModal, downloadInvoice, permissions, openCompanyDetailsModal)}
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

            {/* INVOICE DETAILS MODAL */}
            {
                isOpenDetailsModal && invoiceId ? (
                    <InvoiceDetailsModal
                        isOpenDetailsModal={isOpenDetailsModal}
                        setIsOpenDetailsModal={setIsOpenDetailsModal}
                        invoiceId={invoiceId}
                        openedCompanyId={openedCompanyId}
                        initialBonus={initialBonus}
                        getInvoiceInfo={getInvoiceInfo}
                    />
                ) : null
            }

            {/* COMPANY DETAILS MODAL */}
            {
                isOpenCompanyDetailsModal ? (
                  <CompanyDetailsModal
                    isOpenModal={isOpenCompanyDetailsModal}
                    setIsOpenModal={setIsOpenCompanyDetailsModal}
                    companyId={openCompanyDetailsId}
                  />
                ) : null
            }
        </div>
    )
}

export default Debtors