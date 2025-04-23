import { Col, Empty, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import Chart from "react-apexcharts"
import { reFormatWithSpace } from '../../../utils'
import dayjs from 'dayjs'
import http from '../../../utils/axiosInterceptors'

const NumberOfCustomers = (props) => {

    const { filters } = props

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const series = useMemo(() => [
        {
            name: 'New Customers',
            data: data?.value?.map((item) => item?.total?.toFixed())
        },
        {
            name: 'Active Customers',
            data: data?.value?.map((item) => item?.active?.toFixed())
        },
    ], [data]
    )

    const options = useMemo(() => {
        return {
            title: {
                text: "Number Of New Customers",
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
            plotOptions: {
                bar: {
                    columnWidth: '100%',
                    endingShape: 'rounded',
                    horizontal: true,
                },
            },
            dataLabels: {
                position: 'top',
                style: {
                    fontSize: '10px',
                    colors: ['#000000'],
                },
                formatter: function (val) {
                    return reFormatWithSpace(val)
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
                        return reFormatWithSpace(val)
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return reFormatWithSpace(val)
                    }
                }
            }
        }
    }, [data]
    )

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`dashboard/Chart/NumberOfCustomers`, filters)
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
        <Col xl={24} lg={24} md={24} sm={24} xs={24} className='mb-5'>
            {isLoading ? <Spin /> : null}
            {
                !isLoading && data?.value?.length > 0 ? (
                    <Chart
                        options={options}
                        series={series}
                        type="area"
                        height={'600px'}
                    />
                ) : null
            }
            {!isLoading && data?.value?.length === 0 ? <Empty /> : null}
        </Col>
    )
}

export default NumberOfCustomers