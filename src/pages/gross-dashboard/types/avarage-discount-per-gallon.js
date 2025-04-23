import { Col, Empty, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import Chart from "react-apexcharts"
import { reFormatWithSpace } from '../../../utils'
import dayjs from 'dayjs'
import http from '../../../utils/axiosInterceptors'

const AvarageDiscountPerGallon = (props) => {

    const { filters } = props

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const series = useMemo(() => [
        {
            name: 'Avarage Discount',
            data: data?.map((item) => item?.value?.toFixed(5))
        }
    ], [data]
    )

    const options = useMemo(() => {
        return {
            title: {
                text: "Avarage Discount Per Gallon",
                align: 'center',
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#263238'
                },
            },
            chart: {
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
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
                curve: 'straight'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: data?.map((item) => dayjs(item?.key).format('YYYY-MMM')),
            },
            fill: {
                colors: ['#009ab9']
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
                        return val
                    }
                }
            }
        }
    }, [data]
    )

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`dashboard/Chart/AvarageDiscountPerGallon`, filters)
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
                        type="line"
                    />
                ) : null
            }
            {!isLoading && data?.length === 0 ? <Empty /> : null}
        </Col>
    )
}

export default AvarageDiscountPerGallon