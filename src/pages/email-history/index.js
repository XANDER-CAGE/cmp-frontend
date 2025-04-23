import { Button, DatePicker, Table } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import { groupByKey } from '../../utils'
import dayjs from 'dayjs'
import { get } from 'lodash'
import clsx from 'clsx'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

const { RangePicker } = DatePicker

const EmailHistory = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [emailHistory, setEmailHistory] = useState([])
    const defaultDates = useMemo(() => [dayjs(), dayjs().add(1, 'month')], [])

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
            dateRange: {
                startDate: `${dateStrings[0]}T00:00:00`,
                endDate: `${dateStrings[1]}T00:00:00`,
            },
        }),
        [dateStrings],
    )

    const getEmailHistory = async () => {
        setIsLoading(true)
        try {
            const response = await http.post('InvoiceEmailTemplate/by-day', filters)
            setEmailHistory(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const days = useMemo(
        () =>
        (groupByKey(
            emailHistory?.days?.map((date, index) => {
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
        [emailHistory],
    )

    const items = useMemo(
        () =>
            emailHistory?.templatesByDay?.map((item) => ({
                ...item,
                key: item?.organizationId,
            })),
        [emailHistory],
    )

    const columns = useMemo(
        () => [
            {
                title: 'Organizations',
                width: 200,
                fixed: 'left',
                align: 'center',
                render: (item) => item?.organizationName,
            },
            ...(days?.map((obj, index) => ({
                title: obj?.month,
                dataIndex: 'emailTemplates',
                key: `emailTemplates ${obj?.month}`,
                children: obj?.days?.map((day) => ({
                    title: day?.day,
                    dataIndex: 'emailTemplates',
                    key: `emailTemplates ${day?.day}`,
                    width: 100,
                    align: 'center',
                    render: (item) => {
                        return get(item, `[${day?.index}].templateName`, '-')
                    },
                    onCell: (record) => {
                        const item = record['emailTemplates'][day.index]
                        return {
                            className:
                                clsx({
                                    'text-blue-500': item?.isDefault,
                                    'text-green-500': !item?.isDefault,
                                })
                        }
                    }
                }))
            })) || [])
        ], [days]
    )

    useEffect(() => {
        getEmailHistory()

        // eslint-disable-next-line
    }, [filters, dateStrings])

    return (
        <div className='box'>
            <div className='mb-5 flex'>
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
            </div>

            <Table
                columns={columns}
                dataSource={items}
                scroll={{
                    x: 'scroll',
                }}
                bordered
                rowKey={"id"}
                pagination={false}
                loading={isLoading}
            />
        </div>
    )
}

export default EmailHistory