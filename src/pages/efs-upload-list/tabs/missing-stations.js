import { Col, Input, Row } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import { useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { v4 as uuidv4 } from 'uuid'
import { missingStationsColumns } from '../../../sources/columns/missingStationsColumns'
import StationsModal from '../../../modals/stations'

const MissingStations = () => {
    const navigate = useNavigate()

    const [missingStations, setMissingStations] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)

    const openModal = (stationName, state, city) => {
        setIsOpenModal(true)
        navigate(`?${queryString.stringify({ stationName, state, city })}`)
    }

    const closeModal = () => {
        setIsOpenModal(false)
        navigate(`?${queryString.stringify({ stationName: undefined, state: undefined, city: undefined })}`)
    }

    const getMissingStations = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/EfsTransactions/missing-stations", filters)
            setMissingStations(response?.data?.items)
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
        getMissingStations()

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
                name="missing-cards"
                columns={missingStationsColumns(pageNumber, pageSize, openModal)}
                data={missingStations?.map((item) => {
                    return { ...item, key: uuidv4() }
                })}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="55vh"
            />

            {
                isOpenModal ? (
                    <StationsModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getStations={getMissingStations}
                    />
                ) : null
            }
        </div>
    )
}

export default MissingStations