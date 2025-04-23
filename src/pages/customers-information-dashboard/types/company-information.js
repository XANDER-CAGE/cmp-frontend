import { Col, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import http from '../../../utils/axiosInterceptors'
import { reFormatWithSpace, setUTCTime } from '../../../utils'
import CustomTable from '../../../components/custom-table'
import { IoMdEye } from "react-icons/io"
import CompanyInfoModal from '../../../modals/companyInfoModal'

const CompanyInformation = (props) => {

    const { filters } = props

    const [data, setData] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [id, setId] = useState(null)
    const [companyName, setCompanyName] = useState(null)

    const openModal = (row) => {
        setIsOpenModal(true)
        setCompanyName(row?.companyName)
        setId(row?.id)
    }

    const columns = useMemo(
        () => [
            {
                title: `#`,
                key: 'numberOfRow',
                fixed: 'left',
                align: 'center',
                width: 60,
                render: (text, obj, index) => {
                    return (
                        <span> {(pageNumber - 1) * pageSize + index + 1} </span>
                    )
                },
                checked: true,
            },
            {
                title: 'Company Name',
                width: 200,
                align: 'center',
                key: 'companyName',
                dataIndex: 'companyName',
                checked: true,
            },
            {
                title: 'Start Date',
                width: 100,
                key: 'startDate',
                dataIndex: 'startDate',
                align: 'center',
                render: (item) => setUTCTime(item, 'MM-DD-YYYY'),
                checked: true,
            },
            {
                title: 'Card Amount',
                width: 100,
                align: 'center',
                dataIndex: 'cardAmount',
                key: 'cardAmount',
                checked: true,
            },
            {
                title: 'Transaction Amount',
                width: 200,
                align: 'center',
                dataIndex: 'transactionAmount',
                key: 'transactionAmount',
                checked: true,
            },
            {
                title: 'Gallons',
                width: 100,
                align: 'center',
                dataIndex: 'gallons',
                key: 'gallons',
                render: (item) => reFormatWithSpace(item),
                checked: true,
            },
            {
                title: 'Amount',
                width: 100,
                align: 'center',
                dataIndex: 'amount',
                key: 'amount',
                render: (item) => reFormatWithSpace(item),
                checked: true,
            },
            {
                title: 'Margin',
                width: 100,
                align: 'center',
                dataIndex: 'margin',
                key: 'margin',
                checked: true,
                render: (item) => {
                    return (
                        <div className={item < 0 ? 'text-[red]' : ''}>
                            {reFormatWithSpace(item?.toFixed(2))}
                        </div>
                    )
                },
            },
            {
                title: 'Discount',
                width: 100,
                align: 'center',
                dataIndex: 'discount',
                key: 'discount',
                render: (item) => reFormatWithSpace(item?.toFixed(2)),
                checked: true,
            },
            {
                title: 'DD',
                width: 100,
                align: 'center',
                dataIndex: 'dd',
                key: 'dd',
                checked: true,
            },
            {
                title: 'Debt',
                width: 100,
                align: 'center',
                dataIndex: 'debt',
                key: 'debt',
                render: (item) => reFormatWithSpace(item?.toFixed(2)),
                checked: true,
            },
            {
                title: 'Direction',
                width: 100,
                align: 'center',
                key: 'direction',
                render: (row) => <IoMdEye className='cursor-pointer' size={20} onClick={() => openModal(row)} />,
                checked: true,
            },
        ], [pageNumber, pageSize]
    )

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`dashboard/Chart/CompanyInformation`, {
                ...filters,
                pageNumber,
                pageSize
            })
            setData(response?.data?.data)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getDashboardInfo()

        // eslint-disable-next-line
    }, [filters, pageNumber, pageSize])

    return (
        <Col xl={24} lg={24} md={24} sm={24} xs={24} className='mb-5'>
            {
                isOpenModal ? <CompanyInfoModal
                    isOpenModal={isOpenModal}
                    setIsOpenModal={setIsOpenModal}
                    id={id}
                    companyName={companyName}
                    filters={filters}
                /> : null
            }

            {
                isLoading ? <Spin /> : (
                    <>
                        <h1 className='text-center text-[16px] mb-[20px]' style={{ fontWeight: 'bold' }}>Company Information</h1>
                        <CustomTable
                            name="company-info-dashboard"
                            columns={columns}
                            data={data?.map((item => {
                                return {
                                    ...item,
                                    key: uuidv4()
                                }
                            }))}
                            size="small"
                            setPageNumber={setPageNumber}
                            setPageSize={setPageSize}
                            isLoading={isLoading}
                            pageSize={pageSize}
                            pageNumber={pageNumber}
                            totalCount={totalCount}
                            scrollY={'60vh'}
                        />
                    </>
                )
            }
        </Col>
    )
}

export default CompanyInformation