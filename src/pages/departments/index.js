import React, { useEffect, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Row } from 'antd'
import { toast } from 'react-toastify';
import DepartmentsModal from '../../modals/departments';
import { departmentsColumns } from '../../sources/columns/departmentsColumns';

const Departments = () => {
    const [departments, setDepartments] = useState([])
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

    const getDepartments = async () => {
        setIsLoading(true)
        try {
            const response = await http.get("Departments")
            setDepartments(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteDepartment = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`Departments/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getDepartments()
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
        getDepartments()
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
                name="departments"
                columns={departmentsColumns(pageNumber, pageSize, deleteDepartment, deleteLoading, openModal)}
                data={departments}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                scrollY="60vh"
            />

            {/* DEPARTMENT MODAL */}
            {
                isOpenModal ? (
                    <DepartmentsModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getDepartments={getDepartments}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default Departments