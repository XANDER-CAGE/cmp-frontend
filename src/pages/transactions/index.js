import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/custom-table'
import { transactionsColumns } from '../../sources/columns/transactionsColumns'
import http from '../../utils/axiosInterceptors'

const Transactions = (props) => {
    const { invoiceId } = props

    const [data, setData] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const getTransactions = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`Invoices/${invoiceId}/invoice-lines`, {
                pagination: {
                    pageNumber,
                    pageSize
                }
            })
            setData(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getTransactions()

        // eslint-disable-next-line
    }, [pageNumber, pageSize])

    return (
        <div>
            <CustomTable
                name="transactions"
                columns={transactionsColumns(pageNumber, pageSize)}
                data={data}
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

export default Transactions