import { Col, Collapse, DatePicker, Input, Row, Select } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import { makeOptions } from '../../../utils'
import { useLocalStorageState } from 'ahooks'
import { FaFilter } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'
import { missingMoneyCodesColumns } from '../../../sources/columns/missingMoneyCodesColumns'
import MissingMoneyCodesModal from '../../../modals/missingMoneyCodes';

const { RangePicker } = DatePicker

const MissingMoneyCodes = () => {

    const [missingMoneyCodes, setMissingMoneyCodes] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("missingMoneyCodesFilter", { defaultValue: false })
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(null)
    const [searchCompanyTerm, setSearchCompanyTerm] = useState('')
    const [companyDataById, setCompanyDataById] = useState({})

    const [missionMoneyCodesModalData, setMissionMoneyCodesModalData] = useState({})

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
    }

    const openModal = (companyId, startDate, endDate) => {
        setIsOpenModal(true)
        setMissionMoneyCodesModalData({ companyId, startDate, endDate })
    }

    const getCompanies = async () => {
        try {
            const response = await http.post("Companies/discounting/filter/v2", {
                searchTerm: searchCompanyTerm,
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

    const getMissingMoneyCodes = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/MoneyCodes/get-missed-transactions-group", filters)
            setMissingMoneyCodes(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const filters = useMemo(() => {
        return {
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
        [pageNumber, pageSize, searchTerm, companyId, dateStrings]
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
                            placeholder="Company"
                            options={makeOptions(companies, 'name')}
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
        getCompanies()

        // eslint-disable-next-line
    }, [searchCompanyTerm])

    useEffect(() => {
        if (companyId) {
            getCompanyById()
        }

        // eslint-disable-next-line
    }, [companyId])

    useEffect(() => {
        getMissingMoneyCodes()

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
                name="missing-money-codes"
                columns={missingMoneyCodesColumns(pageNumber, pageSize, openModal)}
                data={missingMoneyCodes?.map(item => {
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
                    <MissingMoneyCodesModal
                        isOpenModal={isOpenModal}
                        setIsOpenModal={setIsOpenModal}
                        data={missionMoneyCodesModalData}
                    />
                ) : null
            }
        </div>
    )
}

export default MissingMoneyCodes