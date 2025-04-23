import { Col, Input, Row } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import { uncheckedMoneyCodesColumns } from '../../../sources/columns/uncheckedMoneyCodesColumns'

const UncheckedMoneyCodes = () => {
    const [uncheckedMoneyCodes, setUncheckedMoneyCodes] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const getUncheckedMoneyCodes = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/EfsMoneyCodes/get-unchecked-money-codes", filters)
            setUncheckedMoneyCodes(response?.data?.items)
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
        getUncheckedMoneyCodes()

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
                name="unchecked-money-codes"
                columns={uncheckedMoneyCodesColumns(pageNumber, pageSize)}
                data={uncheckedMoneyCodes}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                scrollY={'55vh'}
                totalCount={totalCount}
            />
        </div>
    )
}

export default UncheckedMoneyCodes