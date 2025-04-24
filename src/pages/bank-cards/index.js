import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Input, Row } from 'antd'
import { toast } from 'react-toastify';
import BankCardsModal from '../../modals/bankCards';
import { bankCardsColumns } from '../../sources/columns/bankCardsColumns';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import { t } from '../../utils/transliteration';

const BankCards = (props) => {
    const { companyId } = useParams()
    const { openedCompanyId } = props
    const { language } = useLanguage();

    const [bankCards, setBankCards] = useState([])
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

    const getBankCards = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(companyId || openedCompanyId ? `CompanyBankCards/filter?companyId=${companyId || openedCompanyId}` : `CompanyBankCards/filter`, filters)
            setBankCards(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteBankCard = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`CompanyBankCards/${id}`)
            if (response?.success) {
                toast.success(t(translations, 'successfullyDeleted', language))
                getBankCards()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? t(translations, 'serverError', language))
        } finally {
            setDeleteLoading(false)
        }
    }

    const filters = useMemo(() => {
        return {
            searchTerm,
            pageNumber,
            pageSize,
        }
    },
        [pageNumber, pageSize, searchTerm]
    )

    useEffect(() => {
        getBankCards()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    return (
        <div className={companyId || openedCompanyId ? '' : 'box'}>
            <Row className='mb-5'>
                <Col className='flex ml-auto' span={5}>
                    <Input.Search
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={t(translations, 'search', language)}
                        allowClear
                    />
                    <Button
                        type='primary'
                        onClick={() => openModal(null)}
                        className='ml-3'
                    >
                        + {t(translations, 'add', language)}
                    </Button>
                </Col>
            </Row>

            <CustomTable
                name="bankCards"
                columns={bankCardsColumns(pageNumber, pageSize, deleteBankCard, deleteLoading, openModal, language)}
                data={bankCards}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* BANK CARDS MODAL */}
            {
                isOpenModal ? (
                    <BankCardsModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getBankCards={getBankCards}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default BankCards