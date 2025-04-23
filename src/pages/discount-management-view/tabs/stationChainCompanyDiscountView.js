import { Button, Col, DatePicker, Input, Row, Select, Table } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../../../utils/axiosInterceptors'
import { groupByKey, makeOptions } from '../../../utils'
import dayjs from 'dayjs'
import { get } from 'lodash'
import clsx from 'clsx'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { billingCycleOptions } from '../../../constants'

const { RangePicker } = DatePicker

const StationChainCompanyDiscountsView = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [allCompaniesData, setAllCompaniesData] = useState([])
    const [allDays, setAllDays] = useState([])
    const [organizations, setOrganizations] = useState([])
    const [efsAccounts, setEfsAccounts] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [organizationId, setOrganizationId] = useState(null)
    const [efsAccountId, setEfsAccountId] = useState(null)
    const [billingCycle, setBillingCycle] = useState(null)
    const [totalCount, setTotalCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const defaultDates = useMemo(() => [dayjs().subtract(1, 'month'), dayjs()], [])
    const [stationChains, setStationChains] = useState([])
    const [stationChainIds, setStationChainIds] = useState([])
    const [allChains, setAllChains] = useState([])

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
            startDate: dateStrings && dateStrings.length > 0 ? dateStrings[0] : null,
            endDate: dateStrings && dateStrings.length > 0 ? dateStrings[1] : null,
            pagination: {
                pageNumber,
                pageSize
            },
            chainIds: stationChainIds,
            companyFilter: {
                searchTerm,
                organizationId,
                efsAccountId,
                billingCycle
            }
        }),
        [dateStrings, searchTerm, pageSize, pageNumber, organizationId, efsAccountId, billingCycle, stationChainIds],
    )

    const getStationChains = async () => {
        setIsLoading(true)
        try {
            const response = await http.get("StationChains")
            setStationChains(response?.data)
            setStationChainIds(response?.data ? [response?.data[0]?.id] : [])
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getOrganizations = async () => {
        try {
            const response = await http.get('Organizations')
            setOrganizations(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getEfsAccounts = async () => {
        try {
            const response = await http.post('EfsAccounts/filter', { organizationId })
            setEfsAccounts(response?.data?.items)
        } catch (error) {
            console.log(error)
        }
    }

    const getCompanyDiscountsView = async () => {
        setIsLoading(true)
        try {
            const response = await http.post('StationChainCompanyDiscount/filter', filters)
            if (response?.success) {
                setAllDays(response?.data?.days)
                setAllCompaniesData(response?.data?.items)
                setAllChains(
                    response?.data?.items[0].byChainSummaries?.map((item) => {
                        return {
                            id: item?.chain?.id,
                            name: item?.chain?.name,
                        }
                    })
                )
                setTotalCount(response?.data?.totalCount)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const days = useMemo(
        () => (
            groupByKey(
                allDays?.map((date, index) => {
                    return {
                        index,
                        date,
                        day: date.slice(8),
                        month: dayjs(date, 'YYYY-MM-DD').format('MMMM'),
                        year: dayjs(date).format('YYYY - MMM'),
                    }
                }),
                'year',
                'days',
                'chains'
            ) || []),
        [allDays]
    )

    const items = useMemo(
        () =>
            allCompaniesData?.map((item) => ({
                ...item,
                key: item['company']?.id,
            })),
        [allCompaniesData],
    )

    const columns = useMemo(
        () => [
            {
                title: 'Companies',
                width: 300,
                fixed: 'left',
                align: 'center',
                render: (item) => item?.company?.name,
            },
            ...(allChains?.map((chain, chainIndex) => {
                return {
                    title: chain.name,
                    dataIndex: 'byChainSummaries',
                    key: `byChainSummaries ${chain?.id}`,
                    align: 'center',
                    children: days?.map((obj, index) => {
                        return {
                            title: obj?.year,
                            dataIndex: 'byDaySummaries',
                            key: `byDaySummaries ${obj?.month}`,
                            children: obj?.days?.map((day, dayIndex) => {
                                return (
                                    {
                                        title: day?.day,
                                        key: `byDaySummaries ${day?.day}`,
                                        width: 60,
                                        align: 'center',
                                        render: (item) => get(item, `['byChainSummaries'][${chainIndex}]['byDaySummaries'][${day.index}]`)?.discount?.discount ?? '-',
                                        onCell: (record) => {
                                            const item = get(record, `['byChainSummaries'][${chainIndex}]['byDaySummaries'][${day.index}]`)
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
                                    }
                                )
                            })
                        }
                    }),
                }
            }) || [])
        ], [days, allChains]
    )

    useEffect(() => {
        getCompanyDiscountsView()

        // eslint-disable-next-line
    }, [filters, dateStrings])

    useEffect(() => {
        getOrganizations()
        getStationChains()
    }, [])

    useEffect(() => {
        getEfsAccounts()

        // eslint-disable-next-line
    }, [organizationId])

    return (
        <div>
            <Row className='mb-5 flex' gutter={[12, 12]}>
                <Col span={8} className='flex'>
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
            </Row>

            <Row className='mb-5 flex' gutter={[12, 12]}>
                <Col span={4}>
                    <Select
                        className='w-[100%]'
                        placeholder="Station Chains"
                        options={makeOptions(stationChains, 'name')}
                        showSearch
                        allowClear
                        mode='multiple'
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={stationChainIds}
                        onChange={(e) => setStationChainIds(e)}
                    />
                </Col>
                <Col span={4}>
                    <Select
                        placeholder="Organization"
                        allowClear
                        options={makeOptions(organizations, 'name')}
                        value={organizationId}
                        onChange={(e) => setOrganizationId(e)}
                        style={{ width: '100%' }}
                        showSearch
                        filterOption={(input, option) =>
                            ((option?.label || '')).toLowerCase().includes(input.toLowerCase())
                        }
                        onSelect={() => setEfsAccountId(null)}
                    />
                </Col>
                <Col span={4}>
                    <Select
                        placeholder="Efs Account"
                        allowClear
                        options={makeOptions(efsAccounts, 'name')}
                        value={efsAccountId}
                        onChange={(e) => setEfsAccountId(e)}
                        style={{ width: '100%' }}
                        showSearch
                        filterOption={(input, option) =>
                            ((option?.label || '')).toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Col>
                <Col span={4}>
                    <Select
                        placeholder="Billing Cycle"
                        allowClear
                        options={billingCycleOptions}
                        value={billingCycle}
                        onChange={(e) => setBillingCycle(e)}
                        style={{ width: '100%' }}
                        showSearch
                        filterOption={(input, option) =>
                            ((option?.label || '')).toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Col>
                <Col span={4} className='ml-auto'>
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

export default StationChainCompanyDiscountsView