import { Col, Empty, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import Chart from "react-apexcharts"
import { reFormat, toMln } from '../../../utils'
import dayjs from 'dayjs'
import http from '../../../utils/axiosInterceptors'

const Gross = (props) => {

    const { filters } = props

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const series = useMemo(() => [
        {
            name: 'Total',
            data: data?.value?.map((item) => item?.total?.toFixed())
        },
        {
            name: 'Paid',
            data: data?.value?.map((item) => item?.paid?.toFixed())
        },
        {
            name: 'Unpaid',
            data: data?.value?.map((item) => item?.unpaid?.toFixed())
        },
    ], [data]
    )

    const options = useMemo(() => {
        return {
            title: {
                text: "Payments",
                align: 'center',
                floating: false,
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                },
            },
            chart: {
                type: 'area',
                height: 350,
            },
            fill: {
                colors: ['blue', 'green', 'red']
            },
            dataLabels: {
                position: 'top',
                style: {
                    fontSize: '10px',
                    colors: ['#000000'],
                },
                formatter: function (val) {
                    return toMln(val)
                }
            },
            stroke: {
                curve: 'straight',
                width: 1,
                dashArray: 0,
            },
            grid: {
                row: {
                    colors: ['#fff', '#f2f2f2']
                }
            },
            xaxis: {
                labels: {
                    rotate: -45
                },
                categories: data?.value?.map((item) => dayjs(item?.date).format('YYYY-MMM')),
                tickPlacement: 'on'
            },
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return reFormat(val)
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: function (val, e) {
                        const totalItem = e.series[0][e.dataPointIndex]
                        const percent = (val * 100 / totalItem)?.toFixed(3)

                        return `${toMln(val)} / ${percent}%`
                    }
                }
            }
        }
    }, [data]
    )

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`dashboard/Chart/Gross`, filters)
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
        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            {isLoading ? <Spin /> : null}
            {
                !isLoading && data?.value?.length > 0 ? (
                    <Chart
                        options={options}
                        series={series}
                        type="area"
                    />
                ) : null
            }
            {!isLoading && data?.value?.length === 0 ? <Empty /> : null}
        </Col>
    )
}

export default Gross