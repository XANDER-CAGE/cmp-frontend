import React, { useEffect, useMemo, useState } from 'react'
import http from '../../../utils/axiosInterceptors'
import CustomTable from '../../../components/custom-table'
import { Button, Col, Input, Row } from 'antd'
import { toast } from 'react-toastify';
import { dailyDiscountsColumns } from '../../../sources/columns/dailyDiscountsColumns';
import DailyDiscountsModal from '../../../modals/dailyDiscounts';

const DailyDiscounts = () => {
    const [dailyDiscounts, setDailyDiscounts] = useState([])
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

    const getDailyDiscounts = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("DailyUpToDiscounts/grouped", filters)
            setDailyDiscounts(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteDailyDiscount = async (data) => {
        setDeleteLoading(true)
        try {
            const response = await http.post(`DailyUpToDiscounts/delete/list`, {
                from: data?.fromDate,
                to: data?.toDate
            })
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getDailyDiscounts()
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
        getDailyDiscounts()

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
                name="daily-discounts"
                columns={dailyDiscountsColumns(pageNumber, pageSize, deleteDailyDiscount, deleteLoading, openModal)}
                data={dailyDiscounts}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="55vh"
            />

            {/* DAILY DISCOUNTS MODAL */}
            {
                isOpenModal ? (
                    <DailyDiscountsModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getDailyDiscounts={getDailyDiscounts}
                        editData={editData}
                    />
                ) : null
            }
        </div>
    )
}

export default DailyDiscounts