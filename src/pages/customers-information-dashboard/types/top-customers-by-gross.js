import { Col, Empty, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import Chart from "react-apexcharts"
import { reFormatWithSpace, toMln } from '../../../utils'
import http from '../../../utils/axiosInterceptors'

const TopCustomersByGross = (props) => {

    const { filters } = props

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const series = useMemo(() => [
        {
            name: 'Gross',
            data: data?.map((item) => item?.gross?.toFixed())
        },
        {
            name: 'Gallons',
            data: data?.map((item) => item?.gallons?.toFixed())
        },
        {
            name: 'Driver Number',
            data: data?.map((item) => item?.driverNumber?.toFixed())
        },
    ], [data]
    )

    const options = useMemo(() => {
        return {
            title: {
                text: "Top Customers By Gross",
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
                    return toMln(val)
                }
            },
            stroke: {
                show: true,
                curve: 'straight',
                width: 1,
                colors: ['#fff']
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
                categories: data?.map((item) => item?.companyName),
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
                        return toMln(val)
                    }
                }
            }
        }
    }, [data]
    )

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`dashboard/Chart/TopCustomers`, filters)
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
                !isLoading && data?.length > 0 ? (
                    <Chart
                        options={options}
                        series={series}
                        type="bar"
                        height={'700px'}
                    />
                ) : null
            }
            {!isLoading && data?.length === 0 ? <Empty /> : null}
        </Col>
    )
}

export default TopCustomersByGross