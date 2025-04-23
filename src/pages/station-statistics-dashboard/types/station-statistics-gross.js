import { Col, Empty, Select, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import Chart from "react-apexcharts"
import { reFormatWithSpace, toMln } from '../../../utils'
import dayjs from 'dayjs'
import http from '../../../utils/axiosInterceptors'

const StationStatisticsByGross = (props) => {

    const { filters } = props

    const [period, setPeriod] = useState(1)
    const [data, setData] = useState([])
    const [months, setMonths] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const series = useMemo(() => data?.map((item) => {
        return {
            name: item?.key,
            data: item?.grosses?.map(g => g.toFixed())
        }
    }), [data]
    )

    const options = useMemo(() => {
        return {
            title: {
                text: "Station Statistics By Gross",
                align: 'center',
                floating: false,
                style: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                },
            },
            chart: {
                type: 'line',
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
                width: 3,
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
                categories: months?.map((item) => dayjs(item).format(period === 0 ? 'MM-DD-YY' : 'YYYY-MMM')),
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
                        return toMln(val)
                    }
                }
            }
        }
    }, [period, months]
    )

    const getDashboardInfo = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`dashboard/Chart/StationStatisticsByGross`, {
                ...filters,
                period
            })
            setMonths(response?.data?.date)
            setData(response?.data?.values)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getDashboardInfo()

        // eslint-disable-next-line
    }, [filters, period])

    return (
        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <div className='flex justify-end mb-5'>
                <Select
                    className='w-[200px]'
                    options={[
                        { value: 0, label: "Weekly" },
                        { value: 1, label: "Monthly" },
                    ]}
                    defaultValue={period}
                    onChange={e => setPeriod(e)}
                />
            </div>
            {isLoading ? <Spin /> : null}
            {
                !isLoading && data?.length > 0 ? (
                    <>
                        <Chart
                            options={options}
                            series={series}
                            type="line"
                            height={600}
                        />
                    </>

                ) : null
            }
            {!isLoading && data?.value?.length === 0 ? <Empty /> : null}
        </Col>
    )
}

export default StationStatisticsByGross