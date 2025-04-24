import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Input, Row } from 'antd'
import { toast } from 'react-toastify';
import BankAccountsModal from '../../modals/bankAccounts';
import { bankAccountsColumns } from '../../sources/columns/bankAccounts';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';
import { t } from '../../utils/transliteration';

const BankAccounts = (props) => {
    const { companyId } = useParams()
    const { openedCompanyId } = props
    const { language } = useLanguage();

    const [bankAccounts, setBankAccounts] = useState([])
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

    const getBankAccounts = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(companyId || openedCompanyId ? `CompanyBankAccounts/filter?companyId=${companyId || openedCompanyId}` : `CompanyBankAccounts/filter`, filters)
            setBankAccounts(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteBankAccount = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`CompanyBankAccounts/${id}`)
            if (response?.success) {
                toast.success(t(translations, 'successfullyDeleted', language))
                getBankAccounts()
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
        getBankAccounts()

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
                name="bankAccounts"
                columns={bankAccountsColumns(pageNumber, pageSize, deleteBankAccount, deleteLoading, openModal, language)}
                data={bankAccounts}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* BANK ACCOUNTS MODAL */}
            {
                isOpenModal ? (
                    <BankAccountsModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getBankAccounts={getBankAccounts}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default BankAccounts