import { Button, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import http from '../utils/axiosInterceptors';
import CustomTable from '../components/custom-table';
import { maintenancesInvoiceAttachmentColumns } from '../sources/columns/maintenanceInvoiceAttachmentColumns';
import MaintenanceInvoiceAttachInnerModal from './maintenanceInvoiceAttachInnerModal';

const MaintenanceInvoiceAttachModal = (props) => {
    const { isOpenModalAttachment, maintenanceId, setIsOpenModalAttachment } = props
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [data, setData] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)

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

    const getMaintenanceInvoiceAttachmentsById = async () => {
        setIsLoading(true)
        try {
            const response = await http.get(`/MaintenanceInvoiceAttachments/maintenance/${maintenanceId}`)
            setData(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const downloadMaintenanceInvoiceAttachmentById = async (row) => {
        try {
            const response = await http.get(`/MaintenanceInvoiceAttachments/${row?.id}/download`, {
                responseType: 'arraybuffer'
            })
            const url = window.URL.createObjectURL(
                new Blob([response], {
                    type: 'application/octet-stream',
                }),
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${row?.fileName}`)
            document.body.appendChild(link)
            link.click()
            return 1
        } catch (error) {
            console.log(error)
        }
    }

    const deleteMaintenanceRequestById = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`/MaintenanceInvoiceAttachments/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getMaintenanceInvoiceAttachmentsById()
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
        getMaintenanceInvoiceAttachmentsById()

        // eslint-disable-next-line
    }, [])

    return (
        <Modal
            open={isOpenModalAttachment}
            centered
            width={1200}
            title={`Maintenance Invoice Attachment`}
            footer={[]}
            closeIcon={null}
            onCancel={() => setIsOpenModalAttachment(false)}
        >
            <div className='text-right mb-4' onClick={() => setIsOpenModal(true)}>
                <Button type='primary' htmlType='submit' className='ml-3'>Attach Invoice</Button>
            </div>

            <CustomTable
                name="maintenance-invoice-attachment"
                columns={maintenancesInvoiceAttachmentColumns(pageNumber, pageSize, deleteMaintenanceRequestById, deleteLoading, openModal, downloadMaintenanceInvoiceAttachmentById)}
                data={data}
                size="small"
                isLoading={isLoading}
                scrollY="60vh"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                pageSize={pageSize}
            />

            {
                isOpenModal ? (
                    <MaintenanceInvoiceAttachInnerModal
                        isOpenModal={isOpenModal}
                        maintenanceId={maintenanceId}
                        getMaintenanceInvoiceAttachmentsById={getMaintenanceInvoiceAttachmentsById}
                        editId={editId}
                        closeModal={closeModal}
                    />
                ) : null
            }
        </Modal>
    )
}

export default MaintenanceInvoiceAttachModal