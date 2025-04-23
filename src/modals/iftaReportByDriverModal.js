import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, Row, Select, Table, Typography } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { makeOptions } from '../utils'
import http from '../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

const Text = Typography

const IftaReporByDrivertModal = (props) => {
    const { isOpenIftaReportByDriverModal, setIsOpenIftaReportByDriverModal } = props

    const [form] = Form.useForm()

    const [companies, setCompanies] = useState([])
    const [companySearch, setCompanySearch] = useState('')
    const [companiesLoading, setCompaniesLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [companyAccountId, setCompanyAccountId] = useState(null)
    const [allDrivers, setAllDrivers] = useState([])
    const [allDriversView, setAllDriversView] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [year, setYear] = useState('')
    const [quartal, setQuartal] = useState(undefined)
    const [selectedRows, setSelectedRows] = useState([])

    const driversHandler = (item) => {
        item.isSelected = !item.isSelected
        setAllDrivers([...allDrivers])
    }

    const [isAllChecked, setIsAllChecked] = useState(false)
    const toggleCheckAll = () => {
        allDrivers.forEach((item) => (item.isSelected = !isAllChecked))
        setAllDrivers([...allDrivers])
        setIsAllChecked(!isAllChecked)
    }

    const columnsInvoice = useMemo(
        () => [
            {
                title: <Checkbox onChange={toggleCheckAll} checked={isAllChecked} />,
                render: (row) => {
                    return <Checkbox checked={row?.isSelected}></Checkbox>
                },
                width: 50,
            },
            {
                title: `Driver Name`,
                key: 'driverName',
                dataIndex: 'driverName',
                width: 200,
            },
            {
                title: `Unit Number`,
                key: 'unitNumber',
                dataIndex: 'unitNumber',
                width: 150,
            },
            {
                title: `Card Number`,
                key: 'cardNumber',
                dataIndex: 'cardNumber',
                width: 200,
            },
        ],

        // eslint-disable-next-line
        [allDrivers],
    )

    const getCompanyAccounts = async () => {
        setCompaniesLoading(true)
        try {
            const response = await http.post("CompanyAccounts/invoicing/filter/", {
                pagination: {
                    pageNumber: 1,
                    pageSize: 20
                },
                searchTerm: companySearch
            })
            setCompanies(response?.data?.items)
        } catch (error) {
            console.log(error)
        } finally {
            setCompaniesLoading(false)
        }
    }

    const getDrivers = async () => {
        setAllDrivers([])
        try {
            const response = await http.post('/IFTAReport/drivers', {
                companyAccountId,
                year,
                quarter: quartal
            })

            response?.forEach((item) => {
                setAllDrivers((prev) => [...prev, { ...item, isSelected: false, key: `row-${uuidv4()}` }])
            })
        } catch (error) {
            console.log(error)
        }
    }

    const submitForm = async () => {
        setIsLoading(true)

        const data = {
            companyAccountId: companyAccountId,
            year,
            quarter: quartal,
            drivers: selectedRows,
        }
        try {
            const response = await http.post('/IFTAReport/generate-by-driver', data, {
                responseType: 'arraybuffer',
            })
            const item = companies?.find((item) => item.id === data.companyAccountId)
            const fileName = `${item?.organization?.name} (org), ${item?.efsAccount?.name} (efs), ${item?.company?.name} (com)`

            const url = window.URL.createObjectURL(
                new Blob([response], {
                    type: 'application/zip',
                }),
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${fileName}.zip`)
            document.body.appendChild(link)
            link.click()
            return 1
        } catch (error) {
            console.log(error)
            toast.error('Error while generating report!')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getCompanyAccounts()

        // eslint-disable-next-line
    }, [companySearch])

    useEffect(() => {
        if (companyAccountId && year && quartal) {
            getDrivers()
        }

        // eslint-disable-next-line
    }, [companyAccountId, year, quartal])

    useEffect(() => {
        setSelectedRows([])
        allDrivers.forEach((d) => {
            if (d.isSelected) {
                setSelectedRows((prev) => [...prev, d])
            }
        })
    }, [allDrivers])

    useEffect(() => {
        setSelectedRows([])
        setIsAllChecked(false)
    }, [companyAccountId, year])

    const searchFilter = () => {
        const filteredArr = allDrivers?.filter(
            (driver) =>
                driver?.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                driver?.cardNumber?.includes(searchTerm) ||
                driver?.unitNumber?.includes(searchTerm),
        )
        setAllDriversView(filteredArr)
    }

    useEffect(() => {
        searchFilter()

        // eslint-disable-next-line
    }, [searchTerm])

    useEffect(() => {
        setAllDriversView(
            allDrivers.sort((a, b) => {
                const selectedA = a.isSelected ? 1 : 0
                const selectedB = b.isSelected ? 1 : 0
                return selectedB - selectedA
            }),
        )
    }, [allDrivers])

    return (
        <Modal
            open={isOpenIftaReportByDriverModal}
            width={800}
            title={`IFTA Report By Driver`}
            footer={[]}
            closeIcon={null}
        >
            <Form
                name="driver-modal"
                form={form}
                layout='vertical'
                labelCol={{
                    span: 24,
                }}
                wrapperCol={{
                    span: 24,
                }}
                style={{ maxWidth: 'none' }}
                initialValues={{
                    remember: true,
                }}
                onFinish={submitForm}
                autoComplete="off"
            >
                <Row
                    gutter={{
                        xs: 8,
                        sm: 16,
                        md: 24,
                        lg: 32,
                    }}
                >
                    <Col span={24}>
                        <Form.Item
                            label="Company Account"
                            name="companyAccountId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a company account!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="Company Account"
                                options={makeOptions(
                                    companies,
                                    (item) =>
                                        `${item?.organization?.name} (org), ${item?.efsAccount?.name} (efs), ${item?.company?.name} (com)`
                                )}
                                loading={companiesLoading}
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                                }
                                onSearch={e => setCompanySearch(e)}
                                value={companyAccountId}
                                onChange={e => setCompanyAccountId(e)}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Year"
                            name={'year'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select year!',
                                },
                            ]}
                        >
                            <DatePicker
                                onChange={(date, dateString) => {
                                    setYear(dateString)
                                }}
                                style={{ width: '100%' }}
                                picker="year"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Quartal"
                            name={'quartal'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select quartal!',
                                },
                            ]}
                        >
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
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={8} className="ml-auto mb-3">
                        <Input.Search
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Table
                        dataSource={allDriversView}
                        rowKey={`id`}
                        columns={columnsInvoice}
                        size="small"
                        scroll={{ y: '200px' }}
                        pagination={{
                            total: allDriversView?.length,
                            showSizeChanger: false,
                            pageSizeOptions: ['10'],
                        }}
                        onRow={(row) => {
                            return {
                                onClick: () => {
                                    driversHandler(row)
                                },
                            }
                        }}
                    />
                </Row>

                <Row className='mt-5'>
                    <Text>Total: {selectedRows?.length}/{allDriversView?.length}</Text>
                    <Col className='ml-auto'>
                        <Button className='mr-3' disabled={isLoading} onClick={() => setIsOpenIftaReportByDriverModal(false)}>Close</Button>
                        <Button type='primary' htmlType='submit' loading={isLoading} disabled={isLoading}>Generate</Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default IftaReporByDrivertModal