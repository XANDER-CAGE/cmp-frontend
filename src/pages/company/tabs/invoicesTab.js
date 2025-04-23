import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import { invoicingColumns } from '../../../sources/columns/invoicingColumns'
import http from '../../../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { useLocalStorageState } from 'ahooks'
import { Col, DatePicker, Input, Row } from 'antd'
import { get } from 'lodash'
import InvoiceEditModal from '../../../modals/invoiceEditModal'
import InvoiceDetailsModal from '../../../modals/invoiceDetailsModal'
import { useUserInfo } from '../../../contexts/UserInfoContext';

const { RangePicker } = DatePicker

const InvoicesTab = (props) => {
    const { companyId } = props
    const {permissions} = useUserInfo()

    const [invoiceInfo, setInvoiceInfo] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenDetailsModal, setIsOpenDetailsModal] = useState(false)
    const [isOpenEditModal, setIsOpenEditModal] = useState(false)
    const [openedCompanyId, setOpenedCompanyId] = useState(null)
    const [invoiceId, setInvoiceId] = useState(null)
    const [initialBonus, setInitialBonus] = useState(null)

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
    }

    const filters = useMemo(() => {
        return {
            searchTerm,
            invoicePeriod: dateStrings && dateStrings.length > 0 ? {
                startDate: dateStrings[0],
                endDate: dateStrings[1]
            } : undefined,
            pagination: {
                pageNumber,
                pageSize,
            },
            companyId,
        }
    },
        [pageNumber, pageSize, searchTerm, dateStrings, companyId]
    )

    const openInvoiceDetailsModal = async (row) => {
        setIsOpenDetailsModal(true)
        setInvoiceId(row?.id)
        setOpenedCompanyId(row?.companyAccount?.company?.id)
        setInitialBonus(row?.bonus)
    }

    const openEditInvoiceModal = (row) => {
        setIsOpenEditModal(true)
        setInvoiceId(row?.id)
    }

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

    const deleteInvoice = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.put(`Invoices/${id}/update-status`, {
                status: 'Cancelled'
            })
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getInvoiceInfo()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setDeleteLoading(false)
        }
    }

    const downloadInvoice = async (row, type) => {
        try {
            const response = await http.get(`Invoices/${row?.id}/download?invoiceReportFormat=${type}`, {
                responseType: 'blob'
            })
            const href = URL.createObjectURL(response)
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
            console.log(error)
        }
    }

    useEffect(() => {
        getInvoiceInfo()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm, dateStrings, companyId])

    return (
        <div>
            <Row className='mb-5'>
                <Col span={5}>
                    <RangePicker
                        onChange={onChangeRange}
                        value={dateRangeValue}
                        className='w-[100%]'
                    />
                </Col>
                <Col span={15}></Col>
                <Col span={4}>
                    <Input.Search
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder='Search'
                        allowClear
                    />
                </Col>
            </Row>
            <CustomTable
                name="invoicing"
                columns={invoicingColumns(pageNumber, pageSize, deleteInvoice, deleteLoading, downloadInvoice, openInvoiceDetailsModal, openEditInvoiceModal, permissions,false, false)}
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

            {/* INVOICE EDIT MODAL */}
            {
                isOpenEditModal ? (
                    <InvoiceEditModal
                        isOpenEditModal={isOpenEditModal}
                        setIsOpenEditModal={setIsOpenEditModal}
                        getInvoiceInfo={getInvoiceInfo}
                        invoiceId={invoiceId}
                    />
                ) : null
            }

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
        </div>
    )
}

export default InvoicesTab