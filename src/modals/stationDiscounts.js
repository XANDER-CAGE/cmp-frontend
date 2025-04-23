import { Button, Checkbox, Col, DatePicker, Input, Modal, Row, Select, Table, Typography } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { groupByKey, makeOptions } from '../utils'
import { get } from 'lodash'
import clsx from 'clsx'

const { Text } = Typography
const { RangePicker } = DatePicker

const StationDiscountsModal = (props) => {
    const { isOpenModal, getStationDiscounts, closeModal, editData } = props

    const [discount, setDiscount] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [dateStrings, setDateStrings] = useState()
    const [dateRangeValue, setDateRangeValue] = useState([])
    const [selectedStates, setSelectedStates] = useState([])
    const [selectedStationChains, setSelectedStationChains] = useState([])
    const [states, seStates] = useState([])
    const [stationChains, setStationChains] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [allStationsData, setAllStationsData] = useState([])
    const [allDays, setAllDays] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)

    const [isAllChecked, setIsAllChecked] = useState(false)
    const [selectedIDs, setSelectedIDs] = useState([])
    const [unselectedIDs, setUnselectedIDs] = useState([])

    const isChecked = (id) => {
        if (isAllChecked) {
            return !unselectedIDs.includes(id)
        } else {
            return selectedIDs.includes(id) || isAllChecked
        }
    }

    const idHandler = (id) => {
        if (isAllChecked) {
            if (unselectedIDs.includes(id)) {
                setUnselectedIDs(unselectedIDs.filter((item) => item !== id))
            } else {
                setUnselectedIDs((prev) => [...prev, id])
            }
        } else {
            if (selectedIDs.includes(id)) {
                setSelectedIDs(selectedIDs.filter((item) => item !== id))
            } else {
                setSelectedIDs((prev) => [...prev, id])
            }
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

    const filter = useMemo(() => {
        return {
            searchTerm,
            chains: selectedStationChains,
            states: selectedStates,
            startDate: dateStrings && dateStrings.length > 0 ? dateStrings[0] : null,
            endDate: dateStrings && dateStrings.length > 0 ? dateStrings[1] : null,
            pagination: {
                pageNumber,
                pageSize
            },
            stationIds: editData?.stationIds,
        }
    },
        [selectedStationChains, selectedStates, dateStrings, searchTerm, pageNumber, pageSize, editData]
    )

    const editedFilter = useMemo(() => {
        return {
            modifiedDate: editData?.modifiedAt,
            modifiedUserId: editData?.user?.id,
            startDate: editData?.fromDate,
            endDate: editData?.toDate,
            discount: editData?.discount,
            searchTerm,
            pagination: {
                pageNumber,
                pageSize
            }
        }
    },
        [editData, pageNumber, pageSize, searchTerm]
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

    const getStationsFilter = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(editData ? 'StationDiscounts/filter/edit' : 'StationDiscounts/filter', editData ? editedFilter : filter)
            if (response?.success) {
                console.log(response)
                setAllDays(response?.data?.days)
                setAllStationsData(response?.data?.items)
                setTotalCount(response?.data?.totalCount)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const submitForm = async () => {
        setSubmitLoading(true)
        const data = {
            ...filter,
            discount,
            selectAllByFilter: isAllChecked,
            excludedStationIds: unselectedIDs,
            stationIds: selectedIDs,
        }
        const updatedData = {
            modifiedDate: editData?.modifiedAt,
            modifiedUserId: editData?.user?.id,
            from: editData?.fromDate,
            to: editData?.toDate,
            oldDiscount: editData?.discount,
            newDiscount: discount,
        }
        try {
            const response = editData ? await http.put(`StationDiscounts/list/v2`, updatedData) : await http.post('StationDiscounts/list/v2', data)

            if (response?.success) {
                toast.success(`Succesfully ${editData ? 'updated' : 'added'}!`)
                closeModal()
                getStationDiscounts()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setSubmitLoading(false)
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
                        month: dayjs(date, 'YYYY-MM-DD').format('MMMM')
                    }
                }),
                'month',
                'days'
            ) || []),
        [allDays]
    )

    const items = useMemo(
        () =>
            allStationsData?.map((item) => ({
                ...item,
                key: item['station']?.id,
            })),
        [allStationsData],
    )

    const columns = useMemo(
        () => [
            {
                title: (
                    <Checkbox
                        onClick={() => {
                            setIsAllChecked(!isAllChecked)
                            setUnselectedIDs([])
                            setSelectedIDs([])
                        }}
                        checked={isAllChecked}
                        disabled={!!editData}
                    />
                ),
                dataIndex: 'key',
                key: 'key',
                render: (id) => {
                    return <Checkbox checked={isChecked(id)} disabled={!!editData}></Checkbox>
                },
                width: 40,
                align: 'center',
                fixed: 'left'
            },
            {
                title: 'Stations',
                width: 250,
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
                    width: 50,
                    align: 'center',
                    render: (item) => {
                        return get(item, `[${day.index}]['stationDiscount'].discount`, '-')
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

            //eslint-disable-next-line
        ], [days, selectedIDs, unselectedIDs, isAllChecked]
    )

    useEffect(() => {
        if (editData) {
            setDiscount(editData?.discount)
            setDateRangeValue([dayjs(editData?.fromDate), dayjs(editData?.toDate)])
            setDateStrings([editData?.fromDate, editData?.toDate])
        }
    }, [editData])

    useEffect(() => {
        getStates()
        getStationChains()
    }, [])

    useEffect(() => {
        if (dateStrings?.length > 0) {
            getStationsFilter()
        }

        // eslint-disable-next-line
    }, [filter])

    return (
        <Modal
            open={isOpenModal}
            width={1500}
            title={`${editData ? "Edit" : "Add"} Discount`}
            footer={[]}
            closeIcon={null}
        >
            <Row gutter={[12, 12]} className='mb-5'>
                <Col span={4}>
                    <Input
                        type='number'
                        placeholder='Discount'
                        value={discount}
                        onChange={e => setDiscount(e.target.value)}
                    />
                </Col>
                <Col span={5}>
                    <RangePicker
                        onChange={onChangeRange}
                        value={dateRangeValue}
                        className='w-[100%]'
                        disabled={!!editData}
                    />
                </Col>
                <Col span={5}>
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
                        disabled={!!editData}
                    />
                </Col>
                <Col span={5}>
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
                        disabled={!!editData}
                    />
                </Col>
                <Col span={5}>
                    <Input.Search placeholder='Search' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={items}
                scroll={{
                    x: 'scroll',
                    y: '50vh',
                }}
                onRow={(row) => {
                    return {
                        onClick: () => {
                            if (!editData) {
                                idHandler(row?.key)
                            }
                        },
                    }
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

            <Row className='mt-5'>
                <Text>Total: {isAllChecked ? totalCount - unselectedIDs?.length : selectedIDs?.length}/{totalCount}</Text>
                <Col className='ml-auto'>
                    <Button className='mr-3' onClick={closeModal}>Cancel</Button>
                    <Button type='primary' loading={submitLoading} disabled={submitLoading} onClick={submitForm}>
                        {editData ? "Update" : "Save"}
                    </Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default StationDiscountsModal