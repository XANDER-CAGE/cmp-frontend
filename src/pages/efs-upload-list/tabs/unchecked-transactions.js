import { Col, Input, Row } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import { uncheckedTransactionsColumns } from '../../../sources/columns/uncheckedTransactionsColumnsColumns'

const UncheckedTransactions = () => {
    const [uncheckedTransactions, setUncheckedTransactions] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const getUncheckedTransactions = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/EfsTransactions/get-unchecked-transactions", filters)
            setUncheckedTransactions(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const filters = useMemo(() => {
        return {
            searchTerm,
            pageNumber,
            pageSize,
        }
    },
        [pageNumber, pageSize, searchTerm]
    )

    useEffect(() => {
        getUncheckedTransactions()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    return (
        <div>
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
                name="unchecked-transactions"
                columns={uncheckedTransactionsColumns(pageNumber, pageSize)}
                data={uncheckedTransactions}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="55vh"
            />
        </div>
    )
}

export default UncheckedTransactions