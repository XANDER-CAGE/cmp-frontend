import { Modal } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../utils/axiosInterceptors'
import CustomTable from '../components/custom-table'
import { missedInInvoicesMoneyCodesColumns } from '../sources/columns/missedInInvoicesMoneyCodesColumns';
import CompanyDetailsModal from './companyDetailsModal';

const MissingMoneyCodesModal = (props) => {

    const { setIsOpenModal, isOpenModal } = props
    const { companyId, startDate, endDate } = props.data

    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [missingMoneyCodes, setMissingMoneyCodes] = useState([])

    const openCompanyDetailsModal = (companyId) => {
        setIsOpenCompanyDetailsModal(true);
        setOpenCompanyDetailsId(companyId);
        console.log(companyId)
    }
    const [isOpenCompanyDetailsModal, setIsOpenCompanyDetailsModal] = useState(false);
    const [openCompanyDetailsId, setOpenCompanyDetailsId] = useState(null);

    const cancel = () => {
        setIsOpenModal(false)
    }

    const filters = useMemo(
        () => ({
            companyId: companyId,
            period: {
                startDate,
                endDate,
            },
            pagination: {
                pageNumber,
                pageSize,
            },
        }),
        [pageNumber, pageSize, companyId, startDate, endDate],
    )

    const getMissingTransactions = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/MoneyCodes/get-missed-transactions", filters)
            setMissingMoneyCodes(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getMissingTransactions()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, filters])

    return (
        <Modal
            open={isOpenModal}
            title="Missing MoneyCodes"
            footer={[]}
            width={1400}
            centered
            onCancel={cancel}
        >
            <CustomTable
                name="missing-money-codes-modal"
                columns={missedInInvoicesMoneyCodesColumns(pageNumber, pageSize, openCompanyDetailsModal)}
                data={missingMoneyCodes}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
            />

            {/* COMPANY DETAILS MODAL */}
            {
                isOpenCompanyDetailsModal ? (
                  <CompanyDetailsModal
                    isOpenModal={isOpenCompanyDetailsModal}
                    setIsOpenModal={setIsOpenCompanyDetailsModal}
                    companyId={openCompanyDetailsId}
                  />
                ) : null
            }
        </Modal>
    )
}

export default MissingMoneyCodesModal