import { Col, Collapse, DatePicker, Input, Row, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import { toast } from 'react-toastify'
import { FaFilter } from 'react-icons/fa';
import { useLocalStorageState } from 'ahooks';
import { skippedMoneyCodesColumns } from '../../../sources/columns/skippedMoneyCodesColumns';
import AttachToCompany from '../../../modals/attachToCompany';
import { makeOptions } from '../../../utils';
import CompanyDetailsModal from '../../../modals/companyDetailsModal';

const { RangePicker } = DatePicker

const SkippedTransactions = () => {
    const [skippedTransactions, setSkippedTransactions] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("skippedMoneyCodesFilter", { defaultValue: false })

    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(null)
    const [searchCompanyTerm, setSearchCompanyTerm] = useState('')

    const [openAttachToCompanyModal, setOpenAttachToCompanyModal] = useState(false)
    const [attachModalOneTime, setAttachModalOneTime] = useState(false)
    const [attachModalIssuedTo, setAttachModalIssuedTo] = useState(null)
    const [attachModalAttachedCompanyId, setAttachModalAttachedCompanyId] = useState(null)
    const [attachModalAttachedCompanyName, setAttachModalAttachedCompanyName] = useState(null)
    const [attachModalAttachmentType, setAttachModalAttachmentType] = useState(null)
    const [attachModalMoneyCodeId, setAttachModalMoneyCodeId] = useState(null)
    const [attachModelRefNo, setAttachModelRefNo] = useState(null)

    const openCompanyDetailsModal = (companyId) => {
        setIsOpenCompanyDetailsModal(true);
        setOpenCompanyDetailsId(companyId);
        console.log(companyId)
    }
    const [isOpenCompanyDetailsModal, setIsOpenCompanyDetailsModal] = useState(false);
    const [openCompanyDetailsId, setOpenCompanyDetailsId] = useState(null);


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

    const getSkippedTransactions = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/MoneyCodes/filter", filters)
            setSkippedTransactions(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
            return true;
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
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

    const openOneTimeCompanyAttachModal = (id, issuedTo, attachedCompanyId, attachedCompanyName, attachmentType, refNo) => {
        setAttachModalOneTime(true)

        openCompanyAttachModal(id, issuedTo, attachedCompanyId, attachedCompanyName, attachmentType, refNo)
    }

    const openCompanyAttachModal = (id, issuedTo, attachedCompanyId, attachedCompanyName, attachmentType, refNo) => {
        setAttachModalIssuedTo(issuedTo)
        setAttachModalAttachedCompanyId(attachedCompanyId)
        setAttachModalAttachedCompanyName(attachedCompanyName)
        setAttachModalAttachmentType(attachModalOneTime ? 'OneTime' : attachmentType)
        setAttachModalMoneyCodeId(id)
        setAttachModelRefNo(refNo)

        setOpenAttachToCompanyModal(true)
    }

    const detachCompany = async (moneyCodeId) => {
        try {
            const response = await http.post(`/MoneyCodes/detach/${moneyCodeId}`)
            if (response?.success) {
                toast.success('Unplugged successfully!')
                getSkippedTransactions()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }


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

    const filters = useMemo(() => {
        return {
            companyId,
            searchTerm,
            paymentStatus: 'Prepaid',
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
        [pageNumber, pageSize, searchTerm, dateStrings, companyId]
    )

    useEffect(() => {
        getSkippedTransactions()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm, filters])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [searchCompanyTerm])

    const rollback = async (id) => {
        try {
            const response = await http.post(`MoneyCodes/unskip/${id}`)
            if (response?.success) {
                toast.success(`The money code was rolled back successfully!`)
                getSkippedTransactions()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

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
                <Col className='ml-auto'>
                    <Input.Search
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder='Search'
                        allowClear
                    />
                </Col>
            </Row>

            <CustomTable
                name="skipped-transactions"
                columns={skippedMoneyCodesColumns(pageNumber, pageSize, true, detachCompany, openOneTimeCompanyAttachModal, rollback, openCompanyDetailsModal)}
                data={skippedTransactions}
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
                openAttachToCompanyModal ? (
                  <AttachToCompany
                    isOpenModal={openAttachToCompanyModal}
                    setIsOpenModal={setOpenAttachToCompanyModal}
                    onSuccess={getSkippedTransactions}
                    selectAttachment={!attachModalOneTime}
                    issuedTo={attachModalIssuedTo}
                    attachedCompanyName={attachModalAttachedCompanyName}
                    attachedCompanyId={attachModalAttachedCompanyId}
                    refNo={attachModelRefNo}
                    moneyCodeId={attachModalMoneyCodeId}
                    attachmentType={attachModalAttachmentType}
                    isUncheckedMoneyCode={false}
                  />
                ) : null
            }

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

export default SkippedTransactions