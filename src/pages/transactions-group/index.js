import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/custom-table'
import http from '../../utils/axiosInterceptors'
import { transactionsGroupsColumns } from '../../sources/columns/transactionsGroupColumns'
import { v4 as uuidv4 } from 'uuid'

const TransactionsGroup = (props) => {
    const { invoiceId } = props

    const [data, setData] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isLoading, setIsLoading] = useState(false)

    const getTransactionsGroup = async () => {
        setIsLoading(true)
        try {
            const response = await http.get(`Invoices/${invoiceId}/transactions-group`)
            setData(response?.data?.transactionGroups?.map(item => ({ ...item, key: uuidv4() })))
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getTransactionsGroup()

        // eslint-disable-next-line
    }, [pageNumber, pageSize])

    return (
        <div>
            <CustomTable
                name="transactions-group"
                columns={transactionsGroupsColumns(pageNumber, pageSize)}
                data={data}
                size="small"
                isLoading={isLoading}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                pageSize={pageSize}
                scrollY="60vh"
            />
        </div>
    )
}

export default TransactionsGroup