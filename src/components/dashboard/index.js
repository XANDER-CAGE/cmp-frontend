import { Card, Col, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Chart from "react-apexcharts"
import { reFormat } from '../../utils'

const Dashboard = (props) => {

    const { filters, dashboardTitle, url } = props

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const series = useMemo(() => [
        {
            name: 'Value',
            data: data?.map((item) => item?.Value?.toFixed())
        }
    ], [data]
    )

    const options = useMemo(() => {
        return {
            annotations: {
                points: [{
                    x: dashboardTitle,
                    seriesIndex: 0,
                    label: {
                        borderColor: '#775DD0',
                        offsetY: 0,
                        style: {
                            color: '#fff',
                            background: '#775DD0',
                        },
                        text: dashboardTitle,
                    }
                }]
            },
            chart: {
                type: 'line',
                height: 350
            },
            plotOptions: {
                line: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
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
                categories: data?.map((item) => item?.Key),
                tickPlacement: 'on'
            },
            yaxis: {
                labels: {
                    formatter: val => reFormat(val)
                }
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return reFormat(val)
                    }
                }
            }
        }
    }, [data, dashboardTitle]
    )

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(url, filters)
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
            <Card
                title={dashboardTitle}
            >
                {
                    isLoading ? <Spin /> : (
                        <Chart
                            options={options}
                            series={series}
                            type="line"
                            height="500px"
                        />
                    )
                }
            </Card>
        </Col>
    )
}

export default Dashboard