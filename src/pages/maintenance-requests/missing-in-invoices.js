import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { maintenancesMissingInInvoicesColumns } from '../../sources/columns/maintenancesColumns';
import { Col, Collapse, DatePicker, Input, Row, Select } from 'antd'
import { makeOptions } from '../../utils'
import { useLocalStorageState } from 'ahooks'
import dayjs from 'dayjs'
import { get } from 'lodash'
import { FaFilter } from 'react-icons/fa'
import CompanyDetailsModal from '../../modals/companyDetailsModal';

const { RangePicker } = DatePicker

const MissingInInvoices = () => {
    const [maintenances, setMaintenances] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [companyDataById, setCompanyDataById] = useState({})

    const openCompanyDetailsModal = (companyId) => {
        setIsOpenCompanyDetailsModal(true);
        setOpenCompanyDetailsId(companyId);
        console.log(companyId)
    }
    const [isOpenCompanyDetailsModal, setIsOpenCompanyDetailsModal] = useState(false);
    const [openCompanyDetailsId, setOpenCompanyDetailsId] = useState(null);

    const [dateStrings, setDateStrings] = useLocalStorageState('dateStrings', {
        defaultValue: [],
    })
    const [dateRangeValue, setDateRangeValue] = useState(
      dateStrings && dateStrings.length > 0 && dateStrings[0] ?
        [dayjs(dateStrings[0], 'YYYY-MM-DD'), dayjs(dateStrings[1], 'YYYY-MM-DD')] :
        []);

    const onChangeRange = (dates, dateStrings) => {
        setDateRangeValue(dates)

        if(dateStrings[0] === '' && dateStrings[1] === '') {
            setDateStrings([])
        }
        else {
            setDateStrings(dateStrings)
        }
    };

    const [searchTerm, setSearchTerm] = useState('')
    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("maintenanceFilter", { defaultValue: false })
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useLocalStorageState("maintenance-organizationId", { defaultValue: undefined })
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useLocalStorageState("maintenance-EfsAccountId", { defaultValue: undefined })
    const [searchCompanyText, setSearchCompanyText] = useState('')
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useLocalStorageState("maintenance-CompanyId", { defaultValue: undefined })
    const [status, setStatus] = useState(null)

    const getMaintenances = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Maintenances/missed/filter", filters)
            setMaintenances(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
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

    const getCompanies = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Companies/discounting/filter/v2", {
                organizationId,
                efsAccountId,
                pagination: {
                    pageNumber: 1,
                    pageSize: 20
                },
                searchTerm: searchCompanyText
            })
            setCompanies(response?.data?.items)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
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

    const filters = useMemo(() => {
        return {
            pagination: {
                pageNumber,
                pageSize,
            },
            period: dateStrings && dateStrings.length > 0 ? {
                startDate: dateStrings[0],
                endDate: dateStrings[1]
            } : undefined,
            organizationId,
            efsAccountId,
            companyId,
            searchTerm,
            status,
        }
    },
        [pageNumber, pageSize, dateStrings, organizationId, efsAccountId, companyId, searchTerm, status]
    )

    const newOptions = [
        ...makeOptions(companies, 'name'),
        { label: companyDataById?.name, value: companyDataById?.id }

    ]

    const isExist = makeOptions(companies, 'name').some(c => c.value === companyDataById?.company?.id)

    const filterItems = [
        {
            key: '1',
            label: 'Tap to Filter',
            children:
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <RangePicker
                            onChange={onChangeRange}
                            value={dateRangeValue}
                        />
                    </Col>
                    <Col span={6}>
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
                                setCompanyId(null)
                            }}
                        />
                    </Col>
                    <Col span={6}>
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
                                setCompanyId(null)
                            }}
                        />
                    </Col>
                    <Col span={6}>
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
                            onSearch={e => setSearchCompanyText(e)}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                          className='w-[100%]'
                          placeholder="Status"
                          options={[
                              { value: "Draft", label: "Draft" },
                              { value: "Completed", label: "Completed" }
                          ]}
                          showSearch
                          allowClear
                          filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                          }
                          value={status}
                          onChange={(e) => setStatus(e)}
                        />
                    </Col>
                </Row>,
        }
    ]

    useEffect(() => {
        getMaintenances()

        // eslint-disable-next-line
    }, [filters])

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
    }, [organizationId, efsAccountId, searchCompanyText])

    useEffect(() => {
        if (companyId) {
            getCompanyById()
        }

        // eslint-disable-next-line
    }, [companyId])

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
                name="maintenances"
                columns={maintenancesMissingInInvoicesColumns(pageNumber, pageSize, openCompanyDetailsModal)}
                data={maintenances}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* COMPANY DETAILS MODAL */}
            {
                isOpenCompanyDetailsModal ? (
                  <CompanyDetailsModal
                    isOpenModal={isOpenCompanyDetailsModal}
                    setIsOpenModal={setIsOpenCompanyDetailsModal}
                    companyId={openCompanyDetailsId}
                  />
                ) : null
            }
        </div>
    )
}

export default MissingInInvoices