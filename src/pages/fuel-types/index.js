import React, { useEffect, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Row } from 'antd'
import { toast } from 'react-toastify';
import FuelTypesModal from '../../modals/fuel-types';
import { fuelTypesColumns } from '../../sources/columns/fuelTypesColumns';

const FuelTypes = () => {
    const [fuelTypes, setFuelTypes] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
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

    const getFuelTypes = async () => {
        setIsLoading(true)
        try {
            const response = await http.get("FuelType")
            setFuelTypes(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteFuelType = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`FuelType/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getFuelTypes()
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
        getFuelTypes()
    }, [])

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
                name="fuel-types"
                columns={fuelTypesColumns(pageNumber, pageSize, deleteFuelType, deleteLoading, openModal)}
                data={fuelTypes}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                scrollY="60vh"
            />

            {/* FUEL TYPES MODAL */}
            {
                isOpenModal ? (
                    <FuelTypesModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getFuelTypes={getFuelTypes}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default FuelTypes