import { Button, Checkbox, Col, DatePicker, Input, Modal, Row, Select, Table, Typography } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { groupByKey, makeOptions } from '../utils'
import { get } from 'lodash'
import clsx from 'clsx'
import { billingCycleOptions, discountConditionTypeOptions, discountTypeOptions } from '../constants'

const { Text } = Typography
const { RangePicker } = DatePicker

const StationChainsCompanyDiscountsModal = (props) => {
    const { isOpenModal, getCompanyDiscounts, closeModal, editData } = props

    const [discount, setDiscount] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [dateStrings, setDateStrings] = useState()
    const [dateRangeValue, setDateRangeValue] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [allCompaniesData, setAllCompaniesData] = useState([])
    const [allDays, setAllDays] = useState([])
    const [allChains, setAllChains] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useState(null)
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useState(null)
    const [billingCycle, setBillingCycle] = useState(undefined)
    const [discountType, setDiscountType] = useState(editData ? editData?.discountType : "Fixed")
    const [conditionType, setConditionType] = useState(editData ? editData?.conditionType : "Add")
    const [stationChains, setStationChains] = useState([])
    const [stationChainIds, setStationChainIds] = useState(editData ? editData?.chains : [])

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
        }
    },
        [dateStrings, searchTerm, pageNumber, pageSize, stationChainIds, organizationId, efsAccountId, billingCycle]
    )

    const editedFilter = useMemo(() => {
        return {
            modifiedDate: editData?.modifiedAt,
            modifiedUserId: editData?.user?.id,
            startDate: editData?.fromDate,
            endDate: editData?.toDate,
            discount: editData?.discount,
            discountType: editData?.discountType,
            conditionType: editData?.conditionType,
            chainIds: editData?.chains,
            searchTerm,
            pagination: {
                pageNumber,
                pageSize
            }
        }
    },
        [editData, pageNumber, pageSize, searchTerm]
    )

    const getStationChains = async () => {
        setIsLoading(true)
        try {
            const response = await http.get("StationChains")
            setStationChains(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getOrganizations = async () => {
        try {
            const response = await http.get("Organizations")
            setOrganizations(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getEFSAccounts = async () => {
        try {
            const response = await http.post("EfsAccounts/filter", {
                organizationId
            })
            setEfsAccounts(response?.data?.items)
        } catch (error) {
            console.log(error)
        }
    }

    const getCompaniesFilter = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(editData ? 'StationChainCompanyDiscount/filter/edit' : 'StationChainCompanyDiscount/filter', editData ? editedFilter : filter)
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

    const submitForm = async () => {
        setSubmitLoading(true)
        const data = {
            ...filter,
            discount,
            discountType,
            conditionType,
            chainIds: stationChainIds,
            companyFilter: {
                organizationId: organizationId,
                efsAccountId: efsAccountId,
                billingCycle: billingCycle,
                searchTerm: searchTerm,
                selectAllByFilter: isAllChecked,
                excludedCompanyIds: unselectedIDs,
                companyIds: selectedIDs,
            },
        }
        const updatedData = {
            modifiedDate: editData?.modifiedAt,
            modifiedUserId: editData?.user?.id,
            from: editData?.fromDate,
            to: editData?.toDate,
            oldDiscount: editData?.discount,
            oldDiscountType: editData?.discountType,
            oldConditionType: editData?.conditionType,
            newDiscount: discount,
            newDiscountType: discountType,
            newConditionType: conditionType,
            chainIds: stationChainIds
        }
        try {
            const response = editData ? await http.put(`StationChainCompanyDiscount/list`, updatedData) : await http.post('StationChainCompanyDiscount/list', data)

            if (response?.success) {
                toast.success(`Succesfully ${editData ? 'updated' : 'added'}!`)
                closeModal()
                getCompanyDiscounts()
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
                width: 50,
                align: 'center',
                fixed: 'left'
            },
            {
                title: 'Companies',
                width: 300,
                dataIndex: ['company', 'name'],
                fixed: 'left',
                align: 'center',
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
        if (dateStrings?.length > 0) {
            getCompaniesFilter()
        }

        // eslint-disable-next-line
    }, [filter])

    useEffect(() => {
        setIsAllChecked(false)
        setSelectedIDs([])
        setUnselectedIDs([])

    }, [organizationId, efsAccountId, billingCycle])

    useEffect(() => {
        getOrganizations()
        getStationChains()
    }, [])

    useEffect(() => {
        getEFSAccounts()

        // eslint-disable-next-line
    }, [organizationId])

    return (
        <Modal
            open={isOpenModal}
            width={2000}
            title={`${editData ? "Edit" : "Add"} Discount`}
            footer={[]}
            closeIcon={null}
        >
            <Row gutter={[12, 12]} className='mb-5'>
                <Col span={2}>
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
                <Col span={4}>
                    <Select
                        value={discountType}
                        className='w-[100%]'
                        placeholder="Discount type"
                        allowClear
                        options={discountTypeOptions}
                        onChange={(value) => {
                            setDiscountType(value)

                            if (value === "Conditional") {

                                // set default condition type to Add
                                setConditionType("Add")
                            }
                        }}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Col>
                <Col span={4}>
                    {
                        discountType === "Conditional" ? (
                            <Select
                                value={conditionType}
                                className='w-[100%]'
                                placeholder="Discount Condition type"
                                allowClear
                                options={discountConditionTypeOptions}
                                onChange={(value) => setConditionType(value)}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        ) : null
                    }
                </Col>
                <Col span={9}></Col>
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
                        disabled={!!editData}
                    />
                </Col>
                <Col span={4}>
                    <Select
                        className='w-[100%]'
                        placeholder="Organization"
                        options={makeOptions(organizations, 'name')}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={organizationId}
                        onChange={(e) => {
                            setOrganizationId(e)
                            setEfsAccountId(null)
                        }}
                        disabled={!!editData}
                    />
                </Col>
                <Col span={4}>
                    <Select
                        className='w-[100%]'
                        placeholder="EFS Account"
                        options={makeOptions(efsAccounts, 'name')}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={efsAccountId}
                        onChange={(e) => {
                            setEfsAccountId(e)
                        }}
                        disabled={!!editData}
                    />
                </Col>
                <Col span={4}>
                    <Select
                        value={billingCycle}
                        className='w-[100%]'
                        placeholder="Billing Cycle"
                        allowClear
                        options={billingCycleOptions}
                        onChange={(value) => setBillingCycle(value)}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        disabled={!!editData}
                    />
                </Col>
                <Col span={5} className='ml-auto'>
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

export default StationChainsCompanyDiscountsModal