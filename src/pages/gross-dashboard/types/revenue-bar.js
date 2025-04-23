import { Col, Empty, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import Chart from "react-apexcharts"
import { reFormatWithSpace, toMln } from '../../../utils'
import dayjs from 'dayjs'
import http from '../../../utils/axiosInterceptors'

const RevenueBar = (props) => {

    const { filters } = props

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const series = useMemo(() => [
        {
            name: 'Margin',
            data: data?.map((item) => item?.margin?.toFixed())
        },
        {
            name: 'Total Discount',
            data: data?.map((item) => item?.totalDiscount?.toFixed())
        },
        {
            name: 'Total Amount',
            data: data?.map((item) => item?.totalAmount?.toFixed())
        },
    ], [data]
    )

    const options = useMemo(() => {
        return {
            title: {
                text: "Gross 1",
                align: 'center',
                floating: false,
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                },
            },
            chart: {
                type: 'bar',
                height: 350,
                // stacked: true,
            },
            fill: {
                colors: ['#008ffb', '#00e396', '#feb019']
            },
            dataLabels: {
                // enabled: false,
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
                width: 1,
                colors: ['transparent']
            },
            grid: {
                row: {
                    colors: ['#fff', '#f2f2f2']
                }
            },
            xaxis: {
                categories: data?.map((item) => dayjs(item?.date).format('YYYY-MMM')),
            },
            yaxis: {
                labels: {
                    formatter: function (val, opt) {
                        return reFormatWithSpace(val)
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: function (val, opt) {
                        return toMln(val)
                    }
                }
            },
            legend: {
                position: 'top',
                offsetX: 40
            }
        }
    }, [data]
    )

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`dashboard/Chart/RevenueBar`, filters)
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
                !isLoading && data?.length > 0 ? (
                    <Chart
                        options={options}
                        series={series}
                        type="bar"
                    />
                ) : null
            }
            {!isLoading && data?.length === 0 ? <Empty /> : null}
        </Col>
    )
}

export default RevenueBar