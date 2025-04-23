import { Col, Spin, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { setMonthString, toMln } from '../../../utils'
import dayjs from 'dayjs'
import http from '../../../utils/axiosInterceptors'
import clsx from 'clsx'

const AgentPerformanceTable = (props) => {

    const { filters } = props

    const [data, setData] = useState([])
    const [months, setMonths] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const columns = [
        {
            title: 'Agents',
            width: 200,
            dataIndex: 'key',
            fixed: 'left',
            align: 'center',
            render: (row) => row?.length > 0 ? row : 'NO AGENT'
        },
        ...(months?.map((item, index) => {
            return {
                title: item,
                dataIndex: 'value',
                key: 'value',
                align: 'center',
                render: (record) => <div>{record[index]?.value?.came}</div>,
                onCell: (record) => {
                    const item = record?.value[index]?.value
                    return {
                        className:
                            clsx({
                                'bg-green-100': item?.came >= 1 && item?.came < 2,
                                'bg-green-200': item?.came >= 2 && item?.came < 3,
                                'bg-green-300': item?.came >= 3 && item?.came < 4,
                                'bg-green-400': item?.came >= 4 && item?.came < 5,
                                'bg-green-500': item?.came >= 5 && item?.came < 6,
                                'bg-green-600': item?.came >= 6 && item?.came < 7,
                                'bg-green-700': item?.came >= 7 && item?.came < 8,
                                'bg-green-800': item?.came >= 8 && item?.came < 9,
                                'bg-green-900': item?.came >= 9,
                            }),
                    }
                }
            }
        }) || []),
        {
            title: 'Total',
            width: 100,
            dataIndex: 'total',
            fixed: 'right',
            align: 'center',
        },
        {
            title: 'Gross',
            width: 150,
            dataIndex: 'gross',
            align: 'center',
            render: (row) => toMln(row?.toFixed())
        },
    ]

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`dashboard/Chart/AgentPerfomance`, filters)
            setMonths(response?.data[0].value?.map(item => setMonthString(dayjs(item?.key).month())))
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
                        <h1 className='text-center text-[16px] mb-[20px]' style={{ fontWeight: 'bold' }}>Agent Performance</h1>
                        <Table
                            columns={columns}
                            dataSource={data}
                            scroll={{
                                x: 'scroll',
                            }}
                            bordered
                            rowKey={"id"}
                            size='small'
                            loading={isLoading}
                        />
                    </>
                )
            }
        </Col>
    )
}

export default AgentPerformanceTable