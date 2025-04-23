import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { moneyCodeRemainingColumns } from '../../sources/columns/moneyCodeRemainingColumns'
import { Col, DatePicker, Input, Row, Switch } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
    weekStart: 1,
})

dayjs.extend(customParseFormat)

const weekFormat = 'YYYY-MM-DD'

const MoneyCodeRemaining = () => {
    const [moneyCodeRemaining, setMoneyCodeRemaining] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [isLoading, setIsLoading] = useState(false)
    const [moneyCodeUsed, setMoneyCodeUsed] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [weekNum, setWeekNum] = useState(null)
    const [yearNum, setYearNum] = useState(null)

    const onChange = (date, dateString) => {
        const weekYear = dayjs(date).weekYear()
        const weekNumber = dayjs(date).week()
        setWeekNum(weekNumber)
        setYearNum(weekYear)
    }

    const customWeekStartEndFormat = (value) =>
        `${dayjs(value).startOf('week').format(weekFormat)}  ~  ${dayjs(value).endOf('week').format(weekFormat)}`

    let curr = new Date()
    let week = []

    for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i
        let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
        week.push(day)
    }

    const filters = useMemo(() => {
        return {
            pageNumber,
            pageSize,
            searchTerm,
            moneyCodeUsed,
            week: weekNum ? weekNum : dayjs().week(),
            year: yearNum ? yearNum : dayjs().weekYear()
        }
    },
        [pageNumber, pageSize, searchTerm, moneyCodeUsed, weekNum, yearNum]
    )

    const getMoneyCodeRemaining = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("MoneyCodeRemaining/filter/v2", filters)
            setMoneyCodeRemaining(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getMoneyCodeRemaining()

        //eslint-disable-next-line
    }, [filters])

    return (
        <div className='box'>
            <Row className='mb-5' gutter={[16, 16]}>
                <Col span={4}>
                    <DatePicker
                        onChange={onChange}
                        defaultValue={dayjs()}
                        format={customWeekStartEndFormat}
                        picker="week"
                    />
                </Col>
                <Col span={4} className='notification-col mr-auto mt-1'>
                    <label className='mr-5'>Money Code Used</label>
                    <Switch
                        checked={moneyCodeUsed === null || moneyCodeUsed === false ? false : true}
                        onChange={(checked) => setMoneyCodeUsed(checked === false || checked === null ? null : true)}
                    />
                </Col>
                <Col span={4}>
                    <Input.Search
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder='Search'
                        allowClear
                    />
                </Col>
            </Row>

            <CustomTable
                name="moneyCodeRemaining"
                columns={moneyCodeRemainingColumns(pageNumber, pageSize)}
                data={moneyCodeRemaining?.map((item, index) => ({ ...item, key: index }))}
                size="small"
                totalCount={totalCount}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                scrollY="60vh"
            />
        </div>
    )
}

export default MoneyCodeRemaining