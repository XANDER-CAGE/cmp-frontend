import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Input, Row } from 'antd'
import { toast } from 'react-toastify';
import EmailTemplatesModal from '../../modals/email-templates';
import { emailTemplatesColumns } from '../../sources/columns/email-templates';

const EmailTemplates = () => {
    const [emailTemplates, setEmailTemplates] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
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

    const getEmailTemplates = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("InvoiceEmailTemplate/filter", filters)
            setEmailTemplates(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteEmailTemplate = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`InvoiceEmailTemplate/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getEmailTemplates()
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
            searchTerm,
            pagination: {
                pageNumber,
                pageSize,
            }
        }
    },
        [pageNumber, pageSize, searchTerm]
    )

    useEffect(() => {
        getEmailTemplates()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    return (
        <div className='box'>
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
                name="email-templates"
                columns={emailTemplatesColumns(pageNumber, pageSize, deleteEmailTemplate, deleteLoading, openModal)}
                data={emailTemplates}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* EMAIL TEMPLATES MODAL */}
            {
                isOpenModal ? (
                    <EmailTemplatesModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getEmailTemplates={getEmailTemplates}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default EmailTemplates