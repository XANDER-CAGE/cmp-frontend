import { Col, Collapse, DatePicker, Input, Row, Select } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import { missingTransactionsColumns } from '../../../sources/columns/missingTransactionsColumns'
import { makeOptions } from '../../../utils'
import { useLocalStorageState } from 'ahooks'
import { FaFilter } from 'react-icons/fa'
import dayjs from 'dayjs'
import MissingTransactionsModal from '../../../modals/missingTransactions'
import { useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { v4 as uuidv4 } from 'uuid'

const { RangePicker } = DatePicker

const MissingTransactions = () => {
    const navigate = useNavigate()

    const [missingTransactions, setMissingTransactions] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("missingTransactionsFilter", { defaultValue: false })
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useLocalStorageState("missingTransactions-organizationId", { defaultValue: null })
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useLocalStorageState("missingTransactions-EfsAccountId", { defaultValue: null })
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useLocalStorageState("missingTransactions-CompanyId", { defaultValue: null })
    const [searchCompanyTerm, setSearchCompanyTerm] = useState('')
    const [companyDataById, setCompanyDataById] = useState({})

    const [dateStrings, setDateStrings] = useState([])
    const [dateRangeValue, setDateRangeValue] = useState([])
    const onChangeRange = (dates, dateStrings) => {
        setDateRangeValue(dates)

        if(dateStrings[0] === '' && dateStrings[1] === '') {
            setDateStrings([])
        }
        else {
            setDateStrings(dateStrings)
        }
    };

    const openModal = (organizationId, efsAccountId, companyId, startDate, endDate) => {
        setIsOpenModal(true)
        navigate(`?${queryString.stringify({ organizationId, efsAccountId, companyId, startDate, endDate })}`)
    }

    const newOptions = [
        ...makeOptions(companies, 'name'),
        { label: companyDataById?.name, value: companyDataById?.id }

    ]

    const isExist = makeOptions(companies, 'name').some(c => c.value === companyDataById?.company?.id)

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

    const getCompanies = async () => {
        try {
            const response = await http.post("Companies/discounting/filter/v2", {
                searchTerm: searchCompanyTerm,
                organizationId,
                efsAccountId,
            })
            setCompanies(response?.data?.items)
        } catch (error) {
            console.log(error)
        }
    }

    const getCompanyById = async () => {
        try {
            const response = await http.get(`Companies/${companyId}`)
            setCompanyDataById(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getMissingTransactions = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/Transactions/get-missed-transactions-group", filters)
            setMissingTransactions(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const filters = useMemo(() => {
        return {
            organizationId,
            efsAccountId,
            companyId,
            searchTerm,
            pagination: {
                pageNumber,
                pageSize,
            },
            period: dateStrings && dateStrings.length > 0 ? {
                startDate: `${dateStrings[0]}`,
                endDate: `${dateStrings[1]}`,
            } : null,
        }
    },
        [pageNumber, pageSize, searchTerm, organizationId, efsAccountId, companyId, dateStrings]
    )

    const filterItems = [
        {
            key: '1',
            label: 'Tap to Filter',
            children:
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <RangePicker
                            onChange={onChangeRange}
                            value={dateRangeValue}
                            className='w-[100%]'
                        />
                    </Col>
                    <Col span={8}>
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
                            onChange={(e) => setOrganizationId(e)}
                        />
                    </Col>
                    <Col span={8}>
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
                            onChange={(e) => setEfsAccountId(e)}
                        />
                    </Col>
                    <Col span={8}>
                        <Select
                            className='w-[100%]'
                            placeholder="Company"
                            options={!isExist ? newOptions : makeOptions(companies, 'name')}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={companyId}
                            onChange={(e) => setCompanyId(e)}
                            onSearch={e => setSearchCompanyTerm(e)}
                        />
                    </Col>
                </Row>,
        }
    ]

    useEffect(() => {
        getOrganizations()
    }, [])

    useEffect(() => {
        getEFSAccounts()

        // eslint-disable-next-line
    }, [organizationId])

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [searchCompanyTerm, organizationId, efsAccountId])

    useEffect(() => {
        if (companyId) {
            getCompanyById()
        }

        // eslint-disable-next-line
    }, [companyId])

    useEffect(() => {
        getMissingTransactions()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm, filters])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    return (
        <div>
            <Row className='mb-5'>
                <Col span={18}>
                    <Collapse
                        style={{ width: '100%' }}
                        items={filterItems}
                        bordered={false}
                        activeKey={isOpenFilter ? ['1'] : null}
                        size='small'
                        expandIconPosition='end'
                        expandIcon={() => <FaFilter />}
                        onChange={() => setIsOpenFilter(!isOpenFilter)}
                    />
                </Col>
                <Col className='flex ml-auto' span={5}>
                    <Input.Search
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder='Search'
                        allowClear
                    />
                </Col>
            </Row>

            <CustomTable
                name="missing-transactions"
                columns={missingTransactionsColumns(pageNumber, pageSize, openModal)}
                data={missingTransactions?.map(item => {
                    return { ...item, key: uuidv4() }
                })}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="55vh"
            />

            {
                isOpenModal ? (
                    <MissingTransactionsModal
                        isOpenModal={isOpenModal}
                        setIsOpenModal={setIsOpenModal}
                    />
                ) : null
            }
        </div>
    )
}

export default MissingTransactions