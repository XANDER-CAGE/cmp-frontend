import React, { useEffect, useMemo, useState } from 'react'
import http from '../../../utils/axiosInterceptors'
import CustomTable from '../../../components/custom-table'
import { Button, Col, Input, Row } from 'antd'
import { toast } from 'react-toastify';
import StationDiscountsModal from '../../../modals/stationDiscounts';
import { stationDiscountsColumns } from '../../../sources/columns/stationDiscountsColumn';
import { stationChainDiscountsColumns } from '../../../sources/columns/stationChainDiscountsColumn';
import StationChainDiscountsModal from '../../../modals/stationChainDiscountsModal';

const StationChainDiscounts = () => {
    const [stationChainDiscounts, setStationChainDiscounts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [editData, setEditData] = useState(null)

    const openModal = (data) => {
        setIsOpenModal(true)
        setEditData(data)
    }

    const closeModal = () => {
        setIsOpenModal(false)
        setEditData(null)
    }

    const getStationChainDiscounts = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("StationChainDiscounts/grouped", filters)
            setStationChainDiscounts(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteStationChainDiscount = async (data) => {
        setDeleteLoading(true)
        try {
            const response = await http.post(`StationChainDiscounts/delete/list`, {
                from: data?.fromDate,
                to: data?.toDate,
                modifiedDate: data?.modifiedAt,
                modifiedUserId: data?.user?.id,
                discount: data?.discount
            })
            if (response?.success) {
                toast.success('Successfully deleted!')
                getStationChainDiscounts()
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
        getStationChainDiscounts()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    return (
        <div>
            <Row className='mb-5'>
                <Col className='ml-auto mr-3'>
                    <Input.Search
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder='Search'
                        allowClear
                    />
                </Col>
                <Col>
                    <Button
                        type='primary'
                        onClick={() => openModal(null)}
                    >
                        + Add
                    </Button>
                </Col>
            </Row>

            <CustomTable
                name="station-chain-discounts"
                columns={stationChainDiscountsColumns(pageNumber, pageSize, deleteStationChainDiscount, deleteLoading, openModal)}
                data={stationChainDiscounts}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="55vh"
            />

            {/* STATION DISCOUNTS MODAL */}
            {
                isOpenModal ? (
                    <StationChainDiscountsModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getStationChainDiscounts={getStationChainDiscounts}
                        editData={editData}
                    />
                ) : null
            }
        </div>
    )
}

export default StationChainDiscounts