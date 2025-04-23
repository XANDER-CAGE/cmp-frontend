import { Col, Input, Row } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import { missingCardsColumns } from '../../../sources/columns/missingCardsColumns'
import { useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { v4 as uuidv4 } from 'uuid'
import CompanyAccountCardModal from '../../../modals/companyAccountCards'

const MissingCards = () => {
    const navigate = useNavigate()

    const [missingCards, setMissingCards] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)

    const openModal = (cardNumber, driverName, unitNumber) => {
        setIsOpenModal(true)
        navigate(`?${queryString.stringify({ cardNumber, driverName, unitNumber })}`)
    }

    const closeModal = () => {
        setIsOpenModal(false)
        navigate(`?${queryString.stringify({ cardNumber: undefined, driverName: undefined, unitNumber: undefined })}`)
    }

    const getMissingCards = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/EfsTransactions/missing-cards", filters)
            setMissingCards(response?.data?.items)
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
        getMissingCards()

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
                columns={missingCardsColumns(pageNumber, pageSize, openModal)}
                data={missingCards?.map((item) => {
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
                    <CompanyAccountCardModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getCompanyAccountCards={getMissingCards}
                    />
                ) : null
            }
        </div>
    )
}

export default MissingCards