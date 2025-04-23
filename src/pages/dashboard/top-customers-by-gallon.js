import { Col, Empty, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import Chart from "react-apexcharts"
import { reFormatWithSpace } from '../../../utils'
import http from '../../../utils/axiosInterceptors'

const TopCustomersByGallon = (props) => {

    const { filters } = props

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const series = useMemo(() => [
        {
            name: 'Discount Per Gallon',
            data: data?.map((item) => item?.discountPerGallon?.toFixed())
        },
        {
            name: 'Gallon',
            data: data?.map((item) => item?.gallon?.toFixed())
        },
    ], [data]
    )

    const options = useMemo(() => {
        return {
            title: {
                text: "Top Customers By Discount Per Gallon",
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
                stacked: true,
            },
            plotOptions: {
                bar: {
                    columnWidth: '100%',
                    endingShape: 'rounded',
                    horizontal: true,
                },
            },
            fill: {
                colors: ['#008ffb', '#00e396', '#feb019']
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
                width: 1,
                colors: ['transparent']
            },
            grid: {
                row: {
                    colors: ['#fff', '#f2f2f2']
                }
            },
            xaxis: {
                categories: data?.map((item) => item?.companyName)
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
            const response = await http.post(`dashboard/Chart/TopCustomersByDiscountPerGallon`, filters)
            setData(response?.data?.slice(0, 20))
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
        <Col xl={12} lg={12} md={24} sm={24} xs={24} className='mb-5'>
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

export default TopCustomersByGallon