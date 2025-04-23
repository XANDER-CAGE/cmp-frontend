import { Modal } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../utils/axiosInterceptors'
import CustomTable from '../components/custom-table'
import { uncheckedTransactionsColumns } from '../sources/columns/uncheckedTransactionsColumnsColumns'
import queryString from 'query-string'
import { useNavigate } from 'react-router-dom'

const MissingTransactionsModal = (props) => {
    const navigate = useNavigate()

    const { setIsOpenModal, isOpenModal } = props
    const { organizationId, efsAccountId, companyId, startDate, endDate } = queryString.parse(window.location.search)

    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [missingTransactions, setMissingTransactions] = useState([])

    const cancel = () => {
        setIsOpenModal(false)
        navigate(`?${queryString.stringify({ organizationId: undefined, efsAccountId: undefined, companyId: undefined, startDate: undefined, endDate: undefined })}`)
    }

    const filters = useMemo(
        () => ({
            organizationId: organizationId,
            efsAccountId: efsAccountId,
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
        [pageNumber, pageSize, organizationId, efsAccountId, companyId, startDate, endDate],
    )

    const getMissingTransactions = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/Transactions/get-missed-transactions", filters)
            setMissingTransactions(response?.data?.items)
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
            title="Missing Transactions"
            footer={[]}
            width={1400}
            centered
            onCancel={cancel}
        >
            <CustomTable
                name="missing-transactions-modal"
                columns={uncheckedTransactionsColumns(pageNumber, pageSize)}
                data={missingTransactions}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
            />
        </Modal>
    )
}

export default MissingTransactionsModal