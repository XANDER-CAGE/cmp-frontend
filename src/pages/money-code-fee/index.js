import React, { useEffect, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Collapse, Row, Select } from 'antd'
import { toast } from 'react-toastify'
import MoneyCodeFeeModal from '../../modals/moneyCodeFeeModal'
import { moneyCodeFeeColumns } from '../../sources/columns/moneyCodeFeeColumns'
import { makeOptions } from '../../utils'
import { useLocalStorageState } from 'ahooks'
import { FaFilter } from 'react-icons/fa'

const MoneyCodeFee = () => {
    const [moneyCodeFee, setMoneyCodeFee] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [editId, setEditId] = useState(null)

    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("money-code-feeFilter", { defaultValue: false })
    const [organizations, setOrganizations] = useState([])
    const [organizationId, setOrganizationId] = useLocalStorageState("money-code-fee-organizationId", { defaultValue: undefined })
    const [searchCompanyText, setSearchCompanyText] = useState('')
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useLocalStorageState("money-code-fee-company-id", { defaultValue: undefined })
    const [selectType, setSelectType] = useLocalStorageState("money-code-fee-type", { defaultValue: undefined })

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

    const getCompanies = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Companies/discounting/filter/v2", {
                organizationId,
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

    const filterItems = [
        {
            key: '1',
            label: 'Tap to Filter',
            children:
                <Row gutter={[16, 16]}>
                    <Col span={8}>
                        <Select
                            options={[
                                { value: "Default", label: "Default" },
                                { value: "Organization", label: "Organization" },
                                { value: "Company", label: "Company" }
                            ]}
                            value={selectType}
                            onChange={e => setSelectType(e)}
                            className='w-[100%] mb-5'
                            placeholder="Type"
                            disabled={!!editId}
                            allowClear={true}
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
                            onChange={(e) => {
                                setOrganizationId(e)
                                setCompanyId(null)
                            }}
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
                            onSearch={e => setSearchCompanyText(e)}
                        />
                    </Col>
                </Row>,
        }
    ]

    const getMoneyCodeFee = async () => {
        setIsLoading(true)
        try {
            const response = await http.get("MoneyCodeFeeConditions/filter", {
                params: {
                    organizationId,
                    companyId,
                    pageNumber,
                    pageSize,
                    type: selectType
                }
            })
            setMoneyCodeFee(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteMoneyCodeFee = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`MoneyCodeFeeConditions/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getMoneyCodeFee()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        getMoneyCodeFee()

        // eslint-disable-next-line
    }, [organizationId, companyId, pageNumber, pageSize, selectType])

    useEffect(() => {
        getOrganizations()
    }, [])

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [organizationId, searchCompanyText])

    return (
        <div className='box'>
            <Row className='mb-5'>
                <Col span={18}>
                    <Collapse
                        style={{ width: '100%' }}
                        items={filterItems}
                        bordered={false}
                        activeKey={isOpenFilter ? ['1'] : null}
                        size="small"
                        expandIconPosition="end"
                        expandIcon={() => <FaFilter />}
                        onChange={() => setIsOpenFilter(!isOpenFilter)}
                    />
                </Col>

                <Col className='ml-auto'>
                    <Button
                        type='primary'
                        onClick={() => openModal(null)}
                    >
                        + Add
                    </Button>
                </Col>
            </Row>

            <CustomTable
                name="money-code-fee"
                columns={moneyCodeFeeColumns(pageNumber, pageSize, deleteMoneyCodeFee, deleteLoading, openModal)}
                data={moneyCodeFee}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* MONEY CODE FEE MODAL */}
            {
                isOpenModal ? (
                    <MoneyCodeFeeModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getMoneyCodeFee={getMoneyCodeFee}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default MoneyCodeFee