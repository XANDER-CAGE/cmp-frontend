import { Col, Spin, Table } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import http from '../../../utils/axiosInterceptors'
import { reFormatWithSpace } from '../../../utils'

const StationStatistics = (props) => {

    const { filters } = props

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const columns = useMemo(
        () => [
            {
                title: '',
                width: 100,
                fixed: 'left',
                align: 'center',
                render: (item) => {
                    return <b>{item?.name}</b>
                },
            },
            {
                title: 'Number',
                width: 100,
                align: 'center',
                render: (item) => reFormatWithSpace(item?.number),
            },
            {
                title: 'Transaction Amount',
                width: 150,
                align: 'center',
                render: (item) => reFormatWithSpace(item?.transactionAmount),
            },
            {
                title: 'Gallons',
                width: 150,
                align: 'center',
                render: (item) => reFormatWithSpace(item?.gallons?.toFixed(2)),
            },
            {
                title: 'Amount',
                width: 150,
                align: 'center',
                render: (item) => reFormatWithSpace(item?.amount?.toFixed(2)),
            },
            {
                title: 'Discount',
                width: 150,
                align: 'center',
                render: (item) => reFormatWithSpace(item?.discount?.toFixed(2)),
            },
            {
                title: 'Margin',
                width: 150,
                align: 'center',
                render: (item) => reFormatWithSpace(item?.margin?.toFixed(2)),
            },
        ], []
    )

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`dashboard/Chart/StationsStatistics`, filters)
            let obj = {
                name: "TOTAL",
                number: 0,
                transactionAmount: 0,
                gallons: 0,
                amount: 0,
                discount: 0,
                margin: 0,
            }
            response?.data?.forEach((item) => {
                obj.number += item?.number
                obj.transactionAmount += item?.transactionAmount
                obj.gallons += item?.gallons
                obj.amount += item?.amount
                obj.discount += item?.discount
                obj.margin += item?.margin
            })

            setData([...response?.data, obj])
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
        <Col xl={24} lg={24} md={24} sm={24} xs={24} className='mb-5'>
            {
                isLoading ? <Spin /> : (
                    <>
                        <h1 className='text-center text-[16px] mb-[20px]' style={{ fontWeight: 'bold' }}>Station Statistics</h1>
                        <Table
                            columns={columns}
                            dataSource={data?.map((item => {
                                return {
                                    ...item,
                                    key: uuidv4()
                                }
                            }))}
                            scroll={{
                                x: 'scroll',
                            }}
                            size='middle'
                            bordered
                            rowKey={"id"}
                            pagination={false}
                            rowClassName={(row) => row?.name === "TOTAL" ? 'font-bold' : ''}
                            loading={isLoading}
                        />
                    </>
                )
            }
        </Col>
    )
}

export default StationStatistics