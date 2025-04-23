import { Col, Empty, Modal, Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { reFormatWithSpace } from '../utils'
import dayjs from 'dayjs'
import Chart from "react-apexcharts"

const CompanyInfoModal = (props) => {
    const { isOpenModal, setIsOpenModal, id, filters, companyName } = props

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const series = useMemo(() => [
        {
            name: 'Gross',
            data: data?.map((item) => item?.value?.toFixed())
        }
    ], [data]
    )

    const options = useMemo(() => {
        return {
            title: {
                text: "Company Gross",
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
                        return reFormatWithSpace(val)
                    }
                }
            }
        }
    }, [data]
    )

    const getCompanyGrossById = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`/dashboard/Chart/CompanyGross/${id}`, filters)
            console.log(response)
            setData(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCompanyGrossById()

        // eslint-disable-next-line
    }, [id])

    return (
        <Modal
            open={isOpenModal}
            centered
            width={1000}
            title={companyName}
            footer={[]}
            onCancel={() => setIsOpenModal(false)}
        >
            <Col xl={24} lg={24} md={24} sm={24} xs={24} className='text-center'>
                {isLoading ? <Spin size='large' /> : null}
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
        </Modal>
    )
}

export default CompanyInfoModal