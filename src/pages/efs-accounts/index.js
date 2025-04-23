import React, { useEffect, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Row } from 'antd'
import { toast } from 'react-toastify';
import EfsAccountsModal from '../../modals/efs-account';
import { efsAccountsColumns } from '../../sources/columns/efsAccountsColumns';

const EfsAccounts = () => {
    const [efsAccounts, setEfsAccounts] = useState([])
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

    const getEfsAccounts = async () => {
        setIsLoading(true)
        try {
            const response = await http.get("EfsAccounts")
            setEfsAccounts(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteEfsAccounts = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`efsAccounts/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getEfsAccounts()
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
        getEfsAccounts()
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
                name="efs-accounts"
                columns={efsAccountsColumns(pageNumber, pageSize, deleteEfsAccounts, deleteLoading, openModal)}
                data={efsAccounts}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                scrollY="60vh"
            />

            {/* EFS ACCOUNTS MODAL */}
            {
                isOpenModal ? (
                    <EfsAccountsModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getEfsAccounts={getEfsAccounts}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default EfsAccounts