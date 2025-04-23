import { Button, Col, Collapse, DatePicker, Input, Row, Select, Switch } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import { makeOptions } from '../../../utils';
import { FaFilter } from 'react-icons/fa';
import { useLocalStorageState } from 'ahooks';
import { v4 as uuidv4 } from 'uuid';
import { moneyCodesListColumns } from '../../../sources/columns/moneyCodesListColumns';
import { toast } from 'react-toastify';
import { moneyCodeCompanyAttachmentTypeOptions } from '../../../constants';
import AttachToCompany from '../../../modals/attachToCompany';
import SetBillingDateToMoneyCodeModal from '../../../modals/setBillingDateToMoneyCode';
import CompanyDetailsModal from '../../../modals/companyDetailsModal';
const { RangePicker } = DatePicker

const MoneyCodesList = () => {
    const [moneyCodes, setMoneyCodes] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("missingMoneyCodesFilter", { defaultValue: false })
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(null)
    const [searchCompanyTerm, setSearchCompanyTerm] = useState('')
    const [isLoadingExportTable, setIsLoadingExportTable] = useState(false)
    const [attachmentType, setAttachmentType] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState(null)

    const [openAttachToCompanyModal, setOpenAttachToCompanyModal] = useState(false)
    const [attachModalOneTime, setAttachModalOneTime] = useState(false)
    const [attachModalIssuedTo, setAttachModalIssuedTo] = useState(null)
    const [attachModalAttachedCompanyId, setAttachModalAttachedCompanyId] = useState(null)
    const [attachModalAttachedCompanyName, setAttachModalAttachedCompanyName] = useState(null)
    const [attachModalAttachmentType, setAttachModalAttachmentType] = useState(null)
    const [attachModalMoneyCodeId, setAttachModalMoneyCodeId] = useState(null)
    const [attachModelRefNo, setAttachModelRefNo] = useState(null)

    const [editId, setEditId] = useState(null)
    const [billingDate, setBillingDate] = useState(null)
    const [isOpenBillingDateModal, setIsOpenBillingDateModal] = useState(false)

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

    const openSetBillingDateModal = (id, billingDate) => {
        setEditId(id);
        setBillingDate(billingDate)

        setIsOpenBillingDateModal(true);
    }

    const rollback = async (id) => {
        try {
            const response = await http.post(`MoneyCodes/unskip/${id}`)
            if (response?.success) {
                toast.success(`The money code was rolled back successfully!`)
                getMoneyCodes()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

    const skipMoneyCode = async (id) => {
        try {
            const response = await http.post(`/MoneyCodes/skip/${id}`)
            if (response?.success) {
                toast.success('Skipped Succesfully!')
                getMoneyCodes()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

    const detachCompany = async (moneyCodeId) => {
        try {
            const response = await http.post(`/MoneyCodes/detach/${moneyCodeId}`)
            if (response?.success) {
                toast.success('Unplugged successfully!')
                getMoneyCodes()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
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

    const getMoneyCodes = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/MoneyCodes/filter", filters)
            setMoneyCodes(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
            return true;
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const exportTable = async () => {
        setIsLoadingExportTable(true);

        const data = {
            ...filters
        };

        try {
            const response = await http.post('/MoneyCodes/export', data, {
                responseType: 'arraybuffer',
            });
            const url = window.URL.createObjectURL(
              new Blob([response], {
                  type: 'application/zip',
              }),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `MoneyCodes-export.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            return 1;
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!');
        } finally {
            setIsLoadingExportTable(false);
        }
    };

    const filters = useMemo(() => {
        return {
            companyId,
            searchTerm,
            attachmentType,
            paymentStatus,
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
        [pageNumber, pageSize, searchTerm, companyId, dateStrings, attachmentType, paymentStatus]
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
                  <Col span={8}>
                      <Select
                        className="w-[100%]"
                        placeholder="Attachment Type"
                        options={moneyCodeCompanyAttachmentTypeOptions}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                          (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={attachmentType}
                        onChange={(e) => setAttachmentType(e)}
                      />
                  </Col>
                  <Col span={8}>
                      <Select
                        className='w-[100%]'
                        placeholder="Payment Status"
                        options={[
                            { value: "NotInvoiced", label: "Not Invoiced" },
                            { value: "Unpaid", label: "Unpaid" },
                            { value: "Paid", label: "Paid" },
                            { value: "Prepaid", label: "Prepaid" },
                        ]}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                          (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e)}
                      />
                  </Col>
              </Row>,
        }
    ]

    useEffect(() => {
        getMoneyCodes()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm, filters])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    useEffect(() => {
        getCompanies()

        // eslint-disable-next-line
    }, [searchCompanyTerm])

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
                <Col
                  span={6}
                >
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
                name="money-codes-list"
                columns={moneyCodesListColumns(pageNumber, pageSize, rollback, skipMoneyCode, detachCompany, openCompanyAttachModal, openOneTimeCompanyAttachModal, openSetBillingDateModal, openCompanyDetailsModal)}
                data={moneyCodes?.map(item => {
                    return { ...item, key: uuidv4() }
                })}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                scrollY={'55vh'}
                totalCount={totalCount}
            />

            {
                openAttachToCompanyModal ? (
                  <AttachToCompany
                    isOpenModal={openAttachToCompanyModal}
                    setIsOpenModal={setOpenAttachToCompanyModal}
                    onSuccess={getMoneyCodes}
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

            {
                isOpenBillingDateModal ? (
                  <SetBillingDateToMoneyCodeModal
                    isOpenModal={isOpenBillingDateModal}
                    setIsOpenModal={setIsOpenBillingDateModal}
                    onSuccess={getMoneyCodes}
                    moneyCodeId={editId}
                    billingDate={billingDate}
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

export default MoneyCodesList