import { Button, Checkbox, Col, DatePicker, Modal, Row, Select, Table, Typography } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { makeOptions } from '../utils'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'

const Text = Typography

const IftaReportByCompanyModal = (props) => {
    const { isOpenIftaReportByCompanyModal, setIsOpenIftaReportByCompanyModal } = props

    const [year, setYear] = useState('')
    const [quartal, setQuartal] = useState(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useState(null)
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useState(null)
    const [searchCompanyText, setSearchCompanyText] = useState('')
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [data, setData] = useState([])

    const [isAllChecked, setIsAllChecked] = useState(false)
    const [selectedIDs, setSelectedIDs] = useState([])
    const [unselectedIDs, setUnselectedIDs] = useState([])

    const filters = useMemo(() => {
        return {
            year,
            quarter: quartal,
            organizationId: organizationId,
            efsAccountId: efsAccountId,
            companyIds: companyId ? [companyId] : null,
            pagination: {
                pageNumber,
                pageSize,
            },
        }
    }, [organizationId, efsAccountId, companyId, year, quartal, pageSize, pageNumber])

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

    const columnsInvoice = useMemo(
        () => [
            {
                title: <Checkbox
                    onClick={() => {
                        setIsAllChecked(!isAllChecked)
                        setUnselectedIDs([])
                        setSelectedIDs([])
                    }}
                    checked={isAllChecked}
                />,
                render: (id) => {
                    return <Checkbox checked={isChecked(id)}></Checkbox>
                },
                dataIndex: 'id',
                key: 'id',
                width: 30,
                align: 'center'
            },
            {
                title: `Organization`,
                key: 'organizationName',
                render: (data) => {
                    return <div>{data?.organization?.name}</div>
                },
                width: 300,
                align: 'center'
            },
            {
                title: `EFS Account`,
                render: (data) => {
                    return <div>{data?.efsAccount?.name}</div>
                },
                key: 'efsAccountName',
                type: 'string',
                width: 300,
                align: 'center'
            },
            {
                title: `Company`,
                render: (data) => {
                    return <div>{data?.company?.name}</div>
                },
                key: 'companyName',
                type: 'string',
                width: 300,
                align: 'center'
            },
        ],

        // eslint-disable-next-line
        [selectedIDs, unselectedIDs, isAllChecked],
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

    const getCompanies = async () => {
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
        }
    }

    const getIFTAReportData = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(`/CompanyAccounts/invoicing/filter`, filters)
            setData(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const submitForm = async () => {
        setSubmitLoading(true)
        const data = {
            ...filters,
            selectAllByFilter: isAllChecked,
            excludedCompanyAccountIds: unselectedIDs,
            companyAccountIds: selectedIDs,
        }
        try {
            const response = await http.post('/IFTAReport/generate/v2', data, {
                responseType: 'arraybuffer',
            })

            const url = window.URL.createObjectURL(
                new Blob([response], {
                    type: 'application/zip',
                }),
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `IFTA.zip`)
            document.body.appendChild(link)
            link.click()
            return 1
        } catch (error) {
            if (!error?.response?.data) return 1
            const decoder = new TextDecoder()
            const errorMessage = decoder.decode(error?.response?.data)
            toast.error(errorMessage)
        } finally {
            setSubmitLoading(false)
        }
    }

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
        getIFTAReportData()

        // eslint-disable-next-line
    }, [organizationId, efsAccountId, companyId, year, quartal, pageNumber, pageSize])

    return (
        <Modal
            open={isOpenIftaReportByCompanyModal}
            width={1500}
            title={`IFTA Report`}
            footer={[]}
            closeIcon={null}
        >
            <Row
                gutter={12}
            >
                <Col span={4}>
                    <DatePicker
                        onChange={(date, dateString) => {
                            setYear(dateString)
                        }}
                        style={{ width: '100%' }}
                        picker="year"
                    />
                </Col>
                <Col span={5}>
                    <Select
                        value={quartal}
                        placeholder="Quartal"
                        allowClear
                        options={[
                            { value: 'First', label: 'First' },
                            { value: 'Second', label: 'Second' },
                            { value: 'Third', label: 'Third' },
                            { value: 'Fourth', label: 'Fourth' },
                        ]}
                        onChange={(value) => setQuartal(value)}
                        showSearch
                        className='w-[100%]'
                    />
                </Col>
                <Col span={5}>
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
                <Col span={5}>
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
                <Col span={5}>
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
                        onSearch={e => setSearchCompanyText(e)}
                    />
                </Col>
            </Row>

            <Row className='mt-5'>
                <Table
                    dataSource={data}
                    rowKey={`id`}
                    columns={columnsInvoice}
                    size="small"
                    loading={isLoading}
                    pagination={{
                        total: totalCount,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    onChange={(pagination) => {
                        setPageSize(pagination.pageSize)
                        setPageNumber(pagination.current)
                    }}
                    scroll={{
                        y: '50vh',
                    }}
                    onRow={(row) => {
                        return {
                            onClick: () => {
                                idHandler(row?.id)
                            },
                        }
                    }} />
            </Row>

            <Row className='mt-5'>
                <Text>Total: {isAllChecked ? totalCount - unselectedIDs?.length : selectedIDs?.length}/{totalCount}</Text>
                <Col className='ml-auto'>
                    <Button className='mr-3' disabled={submitLoading} onClick={() => setIsOpenIftaReportByCompanyModal(false)}>Close</Button>
                    <Button type='primary' loading={submitLoading} disabled={submitLoading} onClick={submitForm}>Generate</Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default IftaReportByCompanyModal