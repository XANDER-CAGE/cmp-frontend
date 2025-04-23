import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Input, Row } from 'antd'
import { toast } from 'react-toastify';
import CompanyAccountCardModal from '../../modals/companyAccountCards';
import { companyAccountCardsColumns } from '../../sources/columns/companyAccountCards';
import { useParams } from 'react-router-dom';

const CompanyAccountCards = (props) => {
    const { companyId } = useParams()
    const {openedCompanyId} = props

    const [companyAccountCards, setCompanyAccountCards] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [editId, setEditId] = useState(null)
    const [isLoadingExportTable, setIsLoadingExportTable] = useState(null)

    const openModal = (id) => {
        setIsOpenModal(true)
        setEditId(id)
    }

    const closeModal = () => {
        setIsOpenModal(false)
        setEditId(null)
    }

    const filters = useMemo(() => {
        return {
            searchTerm,
            pageNumber,
            pageSize,
            companyId: companyId || openedCompanyId
        }
    },
        [pageNumber, pageSize, searchTerm, companyId, openedCompanyId]
    )

    const getCompanyAccountCards = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("CompanyAccountCards/filter", filters)
            setCompanyAccountCards(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteCompanyAccountCard = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`CompanyAccountCards/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getCompanyAccountCards()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setDeleteLoading(false)
        }
    }

    const exportTable = async () => {
        setIsLoadingExportTable(true)

        try {
            const response = await http.post('/CompanyAccountCards/export', filters, {
                responseType: 'arraybuffer',
            })
            const url = window.URL.createObjectURL(
                new Blob([response], {
                    type: 'application/zip',
                }),
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `file.xlsx`)
            document.body.appendChild(link)
            link.click()
            return 1
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setIsLoadingExportTable(false)
        }
    }

    useEffect(() => {
        getCompanyAccountCards()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    return (
        <div className={companyId || openedCompanyId ? '' : 'box'}>
            <Row className='mb-5'>
                <Col className='flex ml-auto'>
                    <Input.Search
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder='Search'
                        allowClear
                    />
                    {
                        companyId || openedCompanyId ? (
                            <Button
                                type='primary'
                                onClick={exportTable}
                                className='ml-3'
                                loading={isLoadingExportTable}
                            >
                                Export
                            </Button>
                        ) : null
                    }
                    <Button
                        type='primary'
                        onClick={() => openModal(null)}
                        className='ml-3'
                    >
                        + Add
                    </Button>
                </Col>
            </Row>

            <CustomTable
                name="companyAccountCards"
                columns={companyAccountCardsColumns(pageNumber, pageSize, deleteCompanyAccountCard, deleteLoading, openModal)}
                data={companyAccountCards}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* COMPANY ACCOUNT CARDS MODAL */}
            {
                isOpenModal ? (
                    <CompanyAccountCardModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getCompanyAccountCards={getCompanyAccountCards}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default CompanyAccountCards