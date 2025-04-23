import { Col, Empty, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import Chart from "react-apexcharts"
import { reFormat } from '../../../utils'
import http from '../../../utils/axiosInterceptors'

const RevenuePie = (props) => {

    const { filters } = props

    const [series, setSeries] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const options = useMemo(() => {
        return {
            title: {
                text: "Gross 2",
                align: 'center',
                floating: false,
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                },
            },
            chart: {
                type: 'pie',
                stacked: true,
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            labels: ['Total Amount', 'Margin', 'Total Discount'],
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return reFormat(val)
                    },
                },
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return reFormat(val)
                    }
                }
            },
            legend: {
                position: 'top',
                offsetX: 40
            }
        }
    }, []
    )

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`dashboard/Chart/RevenuePie`, filters)
            if (response?.data) {
                series.length = 0
                series.push(Math.round(response?.data[0].totalAmount))
                series.push(Math.round(response?.data[0].margin))
                series.push(Math.round(response?.data[0].totalDiscount))
            }
            setSeries([...series])
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
                !isLoading && series?.length > 0 ? (
                    <Chart
                        options={options}
                        series={series}
                        type="pie"
                        height={500}
                    />
                ) : null
            }
            {!isLoading && series?.length === 0 ? <Empty /> : null}
        </Col>
    )
}

export default RevenuePie