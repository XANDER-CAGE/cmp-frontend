import { Button, Checkbox, Col, DatePicker, Input, Modal, Row, Select, Table, Typography } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import { groupByKey, makeOptions } from '../utils'
import { get } from 'lodash'
import clsx from 'clsx'
import { billingCycleOptions } from '../constants'

const { Text } = Typography
const { RangePicker } = DatePicker

const CompanyDiscountsModal = (props) => {
    const { isOpenModal, getCompanyDiscounts, closeModal, editData } = props

    const [discount, setDiscount] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [dateStrings, setDateStrings] = useState()
    const [dateRangeValue, setDateRangeValue] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [allCompaniesData, setAllCompaniesData] = useState([])
    const [allDays, setAllDays] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [totalCount, setTotalCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useState(null)
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useState(null)
    const [billingCycle, setBillingCycle] = useState(undefined)

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
            startDate: dateStrings ? dateStrings[0] : null,
            endDate: dateStrings ? dateStrings[1] : null,
            pagination: {
                pageNumber,
                pageSize
            },
            companyIds: editData?.companyIds,
        }
    },
        [dateStrings, searchTerm, pageNumber, pageSize, editData]
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
            const response = await http.post(editData ? 'CompanyDiscounts/filter/edit' : 'CompanyDiscounts/filter', editData ? editedFilter : filter)
            if (response?.success) {
                setAllDays(response?.data?.days)
                setAllCompaniesData(response?.data?.items)
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
            excludedCompanyIds: unselectedIDs,
            companyIds: selectedIDs,
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
            const response = editData ? await http.put(`CompanyDiscounts/list/v2`, updatedData) : await http.post('CompanyDiscounts/list/v2', data)

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
                fixed: 'left',
                align: 'center',
                render: (item) => item?.company?.name,
            },
            ...(days?.map((obj, index) => ({
                title: obj?.month,
                dataIndex: 'companyDiscountDays',
                key: `companyDiscountDays ${obj?.month}`,
                children: obj?.days?.map((day) => ({
                    title: day?.day,
                    dataIndex: 'companyDiscountDays',
                    key: `companyDiscountDays ${day?.day}`,
                    width: 100,
                    align: 'center',
                    render: (item) => {
                        return get(item, `[${day.index}]['companyDiscount'].discount`, '-')
                    },
                    onCell: (record) => {
                        const item = record['companyDiscountDays'][day.index]
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
        if (dateStrings?.length > 0) {
            getCompaniesFilter()
        }

        // eslint-disable-next-line
    }, [filter])

    useEffect(() => {
        getOrganizations()
    }, [])

    useEffect(() => {
        getEFSAccounts()

        // eslint-disable-next-line
    }, [organizationId])

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
                <Col span={4}>
                    <RangePicker
                        onChange={onChangeRange}
                        value={dateRangeValue}
                        className='w-[100%]'
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
                    />
                </Col>
                <Col span={4}>
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

export default CompanyDiscountsModal