import { Button, Col, DatePicker, Input, Row, Select, Table } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../../../utils/axiosInterceptors'
import { groupByKey, makeOptions } from '../../../utils'
import dayjs from 'dayjs'
import { get } from 'lodash'
import clsx from 'clsx'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

const { RangePicker } = DatePicker

const StationDiscountsView = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [stationDiscounts, setStationDiscounts] = useState([])
    const [states, seStates] = useState([])
    const [stationChains, setStationChains] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedStates, setSelectedStates] = useState([])
    const [selectedStationChains, setSelectedStationChains] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const defaultDates = useMemo(() => [dayjs().subtract(1, 'month'), dayjs()], [])

    const [dateStrings, setDateStrings] = useState(
        defaultDates.map((date) => date.format('YYYY-MM-DD')),
    )

    const [dateRangeValue, setDateRangeValue] = useState(defaultDates)

    const prevDate = () => {
        if (dateRangeValue && dateRangeValue[0] && dateRangeValue[1]) {
            const end = dateRangeValue[0]
            const start = dateRangeValue[0]?.subtract(1, 'month')
            setDateRangeValue([start, end])
            setDateStrings([start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')])
        }
    }

    const nextDate = () => {
        if (dateRangeValue && dateRangeValue[0] && dateRangeValue[1]) {
            const start = dateRangeValue[1]
            const end = dateRangeValue[1]?.add(1, 'month')
            setDateRangeValue([start, end])
            setDateStrings([start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')])
        }
    }

    const onChangeRange = (dates, dateStrings) => {
        setDateRangeValue(dates)

        if(dateStrings[0] === '' && dateStrings[1] === '') {
            setDateStrings([])
        }
        else {
            setDateStrings(dateStrings)
        }
    };

    const filters = useMemo(
        () => ({
            startDate: dateStrings && dateStrings.length > 0 && dateStrings[0],
            endDate: dateStrings && dateStrings.length > 0 && dateStrings[1],
            chains: selectedStationChains,
            states: selectedStates,
            timezones: [""],
            searchTerm,
            pagination: {
                pageSize,
                pageNumber
            }
        }),
        [dateStrings, searchTerm, selectedStationChains, selectedStates, pageSize, pageNumber],
    )

    const getStates = async () => {
        try {
            const response = await http.get('Stations/states')
            seStates(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getStationChains = async () => {
        try {
            const response = await http.get('StationChains')
            setStationChains(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getStationDiscountsView = async () => {
        setIsLoading(true)
        try {
            const response = await http.post('StationDiscounts/filter', filters)
            setStationDiscounts(response?.data)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const days = useMemo(
        () =>
        (groupByKey(
            stationDiscounts?.days?.map((date, index) => {
                return {
                    index,
                    date,
                    day: date.slice(8),
                    month: dayjs(date, 'YYYY-MM-DD').format('MMMM'),
                }
            }),
            'month',
            'days',
        ) || []),
        [stationDiscounts],
    )

    const items = useMemo(
        () =>
            stationDiscounts?.items?.map((item) => ({
                ...item,
                key: item?.station?.id,
            })),
        [stationDiscounts],
    )

    const columns = useMemo(
        () => [
            {
                title: 'Stations',
                width: 300,
                fixed: 'left',
                align: 'center',
                render: (item) => item?.station?.name,
            },
            ...(days?.map((obj, index) => ({
                title: obj?.month,
                dataIndex: 'stationDiscountDays',
                key: `stationDiscountDays ${obj?.month}`,
                children: obj?.days?.map((day) => ({
                    title: day?.day,
                    dataIndex: 'stationDiscountDays',
                    key: `stationDiscountDays ${day?.day}`,
                    width: 100,
                    align: 'center',
                    render: (item) => {
                        return get(item, `[${day.index}]['stationDiscount'].discount`, '-');
                    },
                    onCell: (record) => {
                        const item = record['stationDiscountDays'][day.index]
                        return {
                            className:
                                clsx({
                                    'text-red-500': item?.zone === 'Red',
                                    'text-yellow-500': item?.zone === 'Yellow',
                                    'text-green-500': item?.zone === 'Green',
                                    'bg-gray-200': item?.invoicesCount > 0,
                                }) + ' ',
                        }
                    }
                }))
            })) || [])
        ], [days]
    )

    useEffect(() => {
        getStationDiscountsView()

        // eslint-disable-next-line
    }, [filters, dateStrings])

    useEffect(() => {
        getStates()
        getStationChains()
    }, [])

    return (
        <div>
            <Row className='mb-5 flex' gutter={[12, 12]}>
                <Col span={6} className='flex'>
                    <Button onClick={prevDate} className='flex items-center text-[16px]'>
                        <AiOutlineLeft />
                    </Button>
                    <RangePicker
                        onChange={onChangeRange}
                        value={dateRangeValue}
                        className='mx-2'
                    />
                    <Button onClick={nextDate} className='flex items-center text-[16px]'>
                        <AiOutlineRight />
                    </Button>
                </Col>
                <Col span={6}>
                    <Select
                        placeholder="State"
                        allowClear
                        options={states?.map(item => ({ label: item, value: item }))}
                        value={selectedStates}
                        onChange={(e) => setSelectedStates(e)}
                        style={{ width: '100%' }}
                        showSearch
                        filterOption={(input, option) =>
                            ((option?.label || '')).toLowerCase().includes(input.toLowerCase())
                        }
                        mode="multiple"
                    />
                </Col>
                <Col span={6}>
                    <Select
                        placeholder="Station Chain"
                        allowClear
                        options={makeOptions(stationChains, 'name')}
                        value={selectedStationChains}
                        onChange={(e) => setSelectedStationChains(e)}
                        style={{ width: '100%' }}
                        showSearch
                        filterOption={(input, option) =>
                            ((option?.label || '')).toLowerCase().includes(input.toLowerCase())
                        }
                        mode="multiple"
                    />
                </Col>
                <Col span={6}>
                    <Input.Search placeholder='Search' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={items}
                scroll={{
                    x: 'scroll',
                    y: '55vh'
                }}
                bordered
                size='small'
                rowKey={"id"}
                loading={isLoading}
                pagination={{ defaultPageSize: pageSize, total: totalCount, current: pageNumber, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
                onChange={(e) => {
                    setPageNumber(e.current)
                    setPageSize(e.pageSize)
                }}
            />
        </div>
    )
}

export default StationDiscountsView