import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Collapse, Input, Row, Select } from 'antd'
import { toast } from 'react-toastify';
import { makeOptions } from '../../utils';
import { FaFilter } from 'react-icons/fa'
import { useLocalStorageState } from 'ahooks';
import { billingCycleOptions } from '../../constants';
import CompanyAccountsModal from '../../modals/companyAccounts';
import { companyAccountsColumns } from '../../sources/columns/companyAccountsColumns';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const CompanyAccounts = (props) => {
    const { companyId } = useParams()
    const {openedCompanyId} = props

    const [companyAccounts, setCompanyAccounts] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [editId, setEditId] = useState(null)

    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("companyAccountsFilter", { defaultValue: false })
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useLocalStorageState("companyAccounts-organizationId", { defaultValue: null })
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useLocalStorageState("companyAccounts-EfsAccountId", { defaultValue: null })
    const [billingCycle, setBillingCycle] = useLocalStorageState("companyAccounts-billingCycle", { defaultValue: null })
    const [companyStatus, setCompanyStatus] = useLocalStorageState("companyAccounts-companyStatus", { defaultValue: null })

    const [isLoadingExportTable, setIsLoadingExportTable] = useState(false)

    const openModal = (id) => {
        setIsOpenModal(true)
        setEditId(id)
    }

    const closeModal = () => {
        setIsOpenModal(false)
        setEditId(null)
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

    const getCompanyAccounts = async () => {
        setIsLoading(true)
        try {
            const response = await http.post(companyId || openedCompanyId ? `CompanyAccounts/filter?companyId=${companyId || openedCompanyId}` : `CompanyAccounts/filter`, filters)
            setCompanyAccounts(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteCompanyAccount = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`CompanyAccounts/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getCompanyAccounts()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setDeleteLoading(false)
        }
    }

    const filters = useMemo(() => {
        return {
            searchTerm,
            pageNumber,
            pageSize,
            organizationId,
            efsAccountId,
            billingCycle,
            companyStatus
        }
    },
        [pageNumber, pageSize, searchTerm, organizationId, efsAccountId, billingCycle, companyStatus]
    )

    const exportTable = async () => {
        setIsLoadingExportTable(true)
        try {
            const response = await http.post('/export/company-accounts', filters, {
                responseType: 'arraybuffer',
            })
            const url = window.URL.createObjectURL(
              new Blob([response], {
                  type: 'application/zip',
              }),
            )
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `company_accounts_${dayjs().format('YYYY-MM-DD')}.xlsx`)
            document.body.appendChild(link)
            link.click()
            return 1
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setIsLoadingExportTable(false)
        }
    }

    const filterItems = [
        {
            key: '1',
            label: 'Tap to Filter',
            children:
                <Row gutter={[16, 16]}>
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
                            placeholder="Billing Cycle"
                            options={billingCycleOptions}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={billingCycle}
                            onChange={(e) => setBillingCycle(e)}
                        />
                    </Col>
                    <Col span={8}>
                        <Select
                            className='w-[100%]'
                            placeholder="Company Status"
                            options={[
                                { value: "Active", label: "Active" },
                                { value: "Inactive", label: "Inactive" }
                            ]}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={companyStatus}
                            onChange={(e) => setCompanyStatus(e)}
                        />
                    </Col>
                </Row>,
        }
    ];

    useEffect(() => {
        getCompanyAccounts()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm, organizationId, efsAccountId, billingCycle, companyStatus])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    useEffect(() => {
        getOrganizations()
    }, [])

    useEffect(() => {
        getEFSAccounts()

        // eslint-disable-next-line
    }, [organizationId])

    return (
        <div className={companyId || openedCompanyId ? '' : 'box'}>
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
                <Col span={6}>

                    <Row className='mb-3'>
                        <Col className='flex ml-auto'>
                            <Button
                              type="primary"
                              className="ml-3"
                              onClick={exportTable}
                              disabled={isLoadingExportTable}
                              loading={isLoadingExportTable}
                            >
                                Export Table
                            </Button>
                            <Button
                              type="primary"
                              onClick={() => openModal(null)}
                              className="ml-3"
                            >
                                + Add
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='flex ml-auto'>
                            <Input.Search
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                              placeholder="Search"
                              allowClear
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <CustomTable
                name="companyAccounts"
                columns={companyAccountsColumns(pageNumber, pageSize, deleteCompanyAccount, deleteLoading, openModal)}
                data={companyAccounts}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* COMPANY ACCOUNTS MODAL */}
            {
                isOpenModal ? (
                    <CompanyAccountsModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getCompanyAccounts={getCompanyAccounts}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default CompanyAccounts