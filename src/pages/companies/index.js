import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Collapse, Input, Row, Select } from 'antd'
import { toast } from 'react-toastify';
import { makeOptions } from '../../utils';
import { FaFilter } from 'react-icons/fa'
import { useLocalStorageState } from 'ahooks';
import { billingCycleOptions, missingFilterOptions } from '../../constants';
import CompaniesModal from '../../modals/companies';
import { companiesColumns } from '../../sources/columns/companiesColumns';

const Companies = () => {
    const [companies, setCompanies] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [editId, setEditId] = useState(null)

    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("companiesFilter", { defaultValue: false })
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useLocalStorageState("companies-organizationId", { defaultValue: null })
    const [efsAccounts, setEfsAccounts] = useState([])
    const [efsAccountId, setEfsAccountId] = useLocalStorageState("companies-EfsAccountId", { defaultValue: null })
    const [billingCycle, setBillingCycle] = useLocalStorageState("companies-billingCycle", { defaultValue: null })
    const [isTrusted, setIsTrusted] = useLocalStorageState("companies-isTrusted", { defaultValue: null })
    const [companyStatus, setCompanyStatus] = useLocalStorageState("companies-companyStatus", { defaultValue: null })
    const [missingStatus, setMissingStatus] = useLocalStorageState("companies-missingStatus", { defaultValue: null })

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

    const getCompanies = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Companies/filter", filters)
            setCompanies(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteCompany = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`Companies/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getCompanies()
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
            isTrusted,
            companyStatus,
            missingStatus
        }
    },
        [pageNumber, pageSize, searchTerm, organizationId, efsAccountId, billingCycle, isTrusted, companyStatus, missingStatus]
    )

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
                            placeholder="Is Trusted"
                            options={[
                                { value: true, label: "Yes" },
                                { value: false, label: "No" }
                            ]}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={isTrusted}
                            onChange={(e) => setIsTrusted(e)}
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
                    <Col span={8}>
                        <Select
                            className='w-[100%]'
                            placeholder="Missing filter"
                            options={missingFilterOptions}
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label || '').toLowerCase().includes(input.toLowerCase())
                            }
                            value={missingStatus}
                            onChange={(e) => setMissingStatus(e)}
                        />
                    </Col>
                </Row>,
        }
    ];

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm, organizationId, efsAccountId, billingCycle, isTrusted, companyStatus, missingStatus])

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
        <div className='box'>
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
                    <Button
                        type='primary'
                        onClick={() => openModal(null)}
                        className='ml-3'
                    >
                        + Add
                    </Button>
                </Col>
            </Row>

            <CustomTable
                name="companies"
                columns={companiesColumns(pageNumber, pageSize, deleteCompany, deleteLoading, openModal)}
                data={companies}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* COMPANIES MODAL */}
            {
                isOpenModal ? (
                    <CompaniesModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getCompanies={getCompanies}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default Companies