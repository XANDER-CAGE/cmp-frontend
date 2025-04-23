import { Col, Spin, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../../../utils/axiosInterceptors'
import dayjs from 'dayjs'

const FinancialIndicators = (props) => {

    const { filters } = props

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const columns = [
        {
            title: '',
            width: 200,
            dataIndex: 'date',
            fixed: 'left',
            align: 'center',
            render: (date) => <b>{dayjs(date).format('YYYY-MMM')}</b>
        },
        {
            title: "Retail Price",
            align: 'center',
            children: [
                {
                    title: "am",
                    width: 120,
                    align: 'center',
                    render: (record) => <div>{record?.retailPrice}</div>
                },
                {
                    title: "%",
                    width: 120,
                    align: 'center',
                    render: (record) => <div>{record?.retailPricePercent}</div>
                },
            ]
        },
        {
            title: "Station Discount",
            align: 'center',
            children: [
                {
                    title: "am",
                    width: 120,
                    align: 'center',
                    render: (record) => <div>{record?.stationDiscount}</div>
                },
                {
                    title: "%",
                    width: 120,
                    align: 'center',
                    render: (record) => <div>{record?.stationDiscountPercent}</div>
                },
            ]
        },
        {
            title: "Discount",
            align: 'center',
            children: [
                {
                    title: "am",
                    width: 120,
                    align: 'center',
                    render: (record) => <div>{record?.discount}</div>
                },
                {
                    title: "%",
                    width: 120,
                    align: 'center',
                    render: (record) => <div>{record?.discountPercent}</div>
                },
            ]
        },
        {
            title: "Money Code",
            align: 'center',
            width: 200,
            render: (record) => <div>{record?.currency}</div>,
        },
        {
            title: "Grand Total",
            align: 'center',
            children: [
                {
                    title: "am",
                    width: 120,
                    align: 'center',
                    render: (record) => <div>{record?.grandTotal}</div>
                },
                {
                    title: "%",
                    width: 120,
                    align: 'center',
                    render: (record) => <div>{record?.grandTotalPercent}</div>
                },
                {
                    title: "debt",
                    width: 120,
                    align: 'center',
                    render: (record) => <div>{record?.grandTotalDebt}</div>
                },
            ]
        },
    ]

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`dashboard/Chart/FinancialIndicatorsDataByMonth`, filters)
            setData(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getDashboardInfo()

        // eslint-disable-next-line
    }, [filters])

    return (
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            {
                isLoading ? <Spin /> : (
                    <>
                        <h1 className='text-center text-[16px] mb-[20px]' style={{ fontWeight: 'bold' }}>Financial Indicators</h1>
                        <Table
                            columns={columns}
                            dataSource={data}
                            scroll={{
                                x: 'scroll',
                            }}
                            bordered
                            rowKey={"id"}
                            pagination={false}
                            loading={isLoading}
                        />
                    </>
                )
            }
        </Col>
    )
}

export default FinancialIndicators