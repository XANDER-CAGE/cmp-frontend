import React, { useCallback, useEffect, useState } from 'react'
import http from '../../../utils/axiosInterceptors'
import dayjs from 'dayjs'
import { chain, get } from 'lodash'
import clsx from 'clsx'
import { StyledCalendar } from '../../../components/calendar'

const DailyDiscountsView = () => {

    const [data, setData] = useState([])
    const [value, setValue] = useState(dayjs(new Date()))

    const getDailyDiscounts = async () => {
        try {
            const response = await http.post('/DailyUpToDiscounts/filter', {
                startDate: `${value.subtract(1, 'M').format('YYYY-MM-')}24`,
                endDate: `${value.add(1, 'M').format('YYYY-MM-')}07`,
            })
            setData(chain(response?.data?.items).keyBy('day').value())
        } catch (error) {
            console.log(error)
        }
    }

    const getDiscount = useCallback(
        (value) => {
            return get(data, value.format('YYYY-MM-DD'), '')
        },
        [data],
    )

    const dateCellRender = (value) => {
        const res = getDiscount(value)
        return (
            <div
                className={clsx({
                    'text-red-500': res.zone === 'Red',
                    'text-yellow-500': res.zone === 'Yellow',
                    'text-green-500': res.zone === 'Green',
                    'font-bold': true,
                    'bg-gray-200': res?.invoicesCount > 0,
                    'h-full w-full p-3 rounded-t-lg': true,
                })}
            >
                {res?.dailyUpToDiscount?.discount}
            </div>
        )
    }

    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current)
        return info.originNode
    }

    const onPanelChange = (newValue) => {
        setValue(newValue)
    }

    useEffect(() => {
        getDailyDiscounts()

        // eslint-disable-next-line
    }, [value])

    return (
        <div>
            <StyledCalendar value={value} cellRender={cellRender} mode='month' onPanelChange={onPanelChange} />
        </div>
    )
}

export default DailyDiscountsView