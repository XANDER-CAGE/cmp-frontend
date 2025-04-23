import React, { useEffect, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Row } from 'antd'
import { toast } from 'react-toastify'
import { merchantFeeColumns } from '../../sources/columns/merchantFeeColumns'
import MerchantFeeModal from '../../modals/merchant-fee'

const MerchantFee = () => {
    const [merchantFee, setMerchantFee] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [editId, setEditId] = useState(null)

    const openModal = (id) => {
        setIsOpenModal(true)
        setEditId(id)
    }

    const closeModal = () => {
        setIsOpenModal(false)
        setEditId(null)
    }

    const getMerchantFee = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("OrganizationMerchantFees/filter", {
                pagination: {
                    pageNumber,
                    pageSize
                }
            })
            setMerchantFee(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteMerchantFee = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`OrganizationMerchantFees/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getMerchantFee()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        getMerchantFee()

        // eslint-disable-next-line
    }, [pageNumber, pageSize])

    return (
        <div className='box'>
            <Row className='mb-5'>
                <Col
                    className='ml-auto'
                >
                    <Button
                        type='primary'
                        onClick={() => openModal(null)}
                    >
                        + Add
                    </Button>
                </Col>
            </Row>

            <CustomTable
                name="merchant-fee"
                columns={merchantFeeColumns(pageNumber, pageSize, deleteMerchantFee, deleteLoading, openModal)}
                data={merchantFee}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* MERCHANT FEE MODAL */}
            {
                isOpenModal ? (
                    <MerchantFeeModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getMerchantFee={getMerchantFee}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default MerchantFee