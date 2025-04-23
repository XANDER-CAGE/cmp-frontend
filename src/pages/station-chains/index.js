import React, { useEffect, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Row } from 'antd'
import { toast } from 'react-toastify';
import StationChainsModal from '../../modals/station-chains';
import { stationChainsColumns } from '../../sources/columns/stationChainsColumns';

const StationChains = () => {
    const [stationChains, setStationChains] = useState([])
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

    const getStationChains = async () => {
        setIsLoading(true)
        try {
            const response = await http.get("StationChains")
            setStationChains(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteStationChains = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`StationChains/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getStationChains()
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
        getStationChains()
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
                name="station-chains"
                columns={stationChainsColumns(pageNumber, pageSize, deleteStationChains, deleteLoading, openModal)}
                data={stationChains}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                scrollY="60vh"
            />

            {/* STATION CHAINS MODAL */}
            {
                isOpenModal ? (
                    <StationChainsModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getStationChains={getStationChains}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default StationChains