import { useLocalStorageState } from 'ahooks'
import { Col, DatePicker, Row, Select } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import { makeOptions } from '../../utils'
import AgentPerformanceTable from './types/agent-performance-table'

const { RangePicker } = DatePicker

const AgentPerformanceDashboard = () => {
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useLocalStorageState("agent-performance-organizationId", { defaultValue: null })
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useLocalStorageState("agent-performance-efsAccountId", { defaultValue: null })

    const [dateStrings, setDateStrings] = useState(undefined)
    const [dateRangeValue, setDateRangeValue] = useState(undefined)
    const onChangeRange = (dates, dateStrings) => {
        setDateStrings(
            dateStrings && dateStrings.length > 0 && dateStrings[0] ? [
                dayjs(dateStrings[0]).format('DDMMYYYY'),
                dayjs(dateStrings[1]).format('DDMMYYYY')
            ] : undefined
        )
        setDateRangeValue(dates)
    }

    const filters = useMemo(() => {
        return {
            fromDate: dateStrings && dateStrings.length > 0 ? dateStrings[0] : null,
            toDate: dateStrings && dateStrings.length > 0 ? dateStrings[1] : null,
            organizationId: organizationId?.toString(),
            efsAccountId: efsAccountId?.toString(),
        }
    },
        [dateStrings, organizationId, efsAccountId]
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

    useEffect(() => {
        getOrganizations()
    }, [])

    useEffect(() => {
        getEFSAccounts()

        // eslint-disable-next-line
    }, [organizationId])

    return (
        <div className='box'>
            <Row gutter={12} className='justify-end'>
                <Col span={4}>
                    <RangePicker
                        onChange={onChangeRange}
                        value={dateRangeValue}
                        className='w-[100%]'
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
            </Row>

            <Row gutter={[16, 16]} className='mt-[30px]'>
                <AgentPerformanceTable
                    filters={filters}
                />
            </Row>
        </div>
    )
}

export default AgentPerformanceDashboard