import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Col, Input, Row } from 'antd'
import { toast } from 'react-toastify';
import { invoiceGroupsColumns } from '../../sources/columns/invoiceGroupsColumns';
import { useUserInfo } from '../../contexts/UserInfoContext';

const InvoiceGroups = () => {
    const [invoiceGroups, setInvoiceGroups] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const { permissions } = useUserInfo()

    const getInvoiceGroups = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Invoices/grouped", filters)
            setInvoiceGroups(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteInvoiceGroup = async (invoiceIds) => {
        setDeleteLoading(true)
        try {
            const response = await http.post(`Invoices/cancel-from-list`, {
                invoiceIds
            })
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getInvoiceGroups()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setDeleteLoading(false)
        }
    }

    const filters = useMemo(() => {
        return {
            pageNumber,
            pageSize,
            searchTerm
        }
    },
        [pageNumber, pageSize, searchTerm]
    )

    useEffect(() => {
        getInvoiceGroups()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    return (
        <div className='box'>
            <Row className='mb-5'>
                <Col className='ml-auto'>
                    <Input.Search
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder='Search'
                        allowClear
                    />
                </Col>
            </Row>

            <CustomTable
                name="invoice-groups-discounts"
                columns={invoiceGroupsColumns(pageNumber, pageSize, deleteInvoiceGroup, deleteLoading, permissions)}
                data={invoiceGroups}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="60vh"
            />
        </div>
    )
}

export default InvoiceGroups