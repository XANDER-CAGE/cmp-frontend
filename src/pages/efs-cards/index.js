import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Input, Row, Select } from 'antd';
import { cardStatusOptions } from '../../constants';
import { efsCardsColumns } from '../../sources/columns/efsCardsColumns';
import { toast } from 'react-toastify';

const EfsCards = () => {
    const [efsCards, setEfsCards] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [isLoading, setIsLoading] = useState(false)
    const [cardStatus, setCardStatus] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoadingExportTable, setIsLoadingExportTable] = useState(false)

    const filters = useMemo(() => {
        return {
            pageNumber,
            pageSize,
            searchTerm,
            cardStatus
        }
    },
        [pageNumber, pageSize, searchTerm, cardStatus]
    )

    const getEfsCards = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("EfsCards/filter", filters)
            setEfsCards(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const exportTable = async () => {
        setIsLoadingExportTable(true)
        try {
            const response = await http.post('/EfsCards/export', filters, {
                responseType: 'arraybuffer',
            })
            const url = window.URL.createObjectURL(
                new Blob([response], {
                    type: 'application/zip',
                }),
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `table.xlsx`)
            document.body.appendChild(link)
            link.click()
            return 1
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setIsLoadingExportTable(false)
        }
    }

    useEffect(() => {
        getEfsCards()

        //eslint-disable-next-line
    }, [filters])

    return (
        <div className='box'>
            <Row className='mb-5' gutter={[16, 16]}>
                <Col className='ml-auto' span={4}>
                    <Select
                        className='w-[100%]'
                        placeholder="Card Status"
                        options={cardStatusOptions}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={cardStatus}
                        onChange={(e) => setCardStatus(e)}
                    />
                </Col>
                <Col span={4}>
                    <Input.Search
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder='Search'
                        allowClear
                    />
                </Col>
                <Button
                    type='primary'
                    onClick={exportTable}
                    disabled={isLoadingExportTable}
                    loading={isLoadingExportTable}
                >
                    Export Table
                </Button>
            </Row>

            <CustomTable
                name="efsCards"
                columns={efsCardsColumns(pageNumber, pageSize)}
                data={efsCards}
                size="small"
                totalCount={totalCount}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                scrollY="60vh"
            />
        </div>
    )
}

export default EfsCards