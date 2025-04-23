import { Col, Collapse, Input, Row, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import { attachedCompaniesColumns } from '../../../sources/columns/attachedCompaniesColumns'
import { toast } from 'react-toastify'
import AttachToCompany from '../../../modals/attachToCompany'
import { useLocalStorageState } from 'ahooks';
import { makeOptions } from '../../../utils';
import { moneyCodeCompanyAttachmentTypeOptions } from '../../../constants';
import { FaFilter } from 'react-icons/fa';
import { moneyCodesListColumns } from '../../../sources/columns/moneyCodesListColumns';
import { v4 as uuidv4 } from 'uuid';
import AttachAllMoneyCodesToCompany from '../../../modals/attachAllMoneyCodesToCompany';
import CompanyDetailsModal from '../../../modals/companyDetailsModal';

const AttachedCompanies = () => {

    const [attachments, setAttachments] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isEditable, setIsEditable] = useState(null)
    const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("moneyCodeAttachmentsFilter", { defaultValue: false })
    const [companies, setCompanies] = useState([])
    const [companyId, setCompanyId] = useState(null)
    const [searchCompanyTerm, setSearchCompanyTerm] = useState('')
    const [attachmentType, setAttachmentType] = useState(null)

    const [attachModalIssuedTo, setAttachModalIssuedTo] = useState(null)
    const [attachModalAttachedCompanyId, setAttachModalAttachedCompanyId] = useState(null)
    const [attachModalAttachedCompanyName, setAttachModalAttachedCompanyName] = useState(null)
    const [attachModalAttachmentType, setAttachModalAttachmentType] = useState(null)


    const openCompanyDetailsModal = (companyId) => {
        setIsOpenCompanyDetailsModal(true);
        setOpenCompanyDetailsId(companyId);
        console.log(companyId)
    }
    const [isOpenCompanyDetailsModal, setIsOpenCompanyDetailsModal] = useState(false);
    const [openCompanyDetailsId, setOpenCompanyDetailsId] = useState(null);

    const openCompanyAttachModal = (issuedTo, attachedCompanyId, attachedCompanyName, attachmentType) => {
        setAttachModalIssuedTo(issuedTo)
        setAttachModalAttachedCompanyId(attachedCompanyId)
        setAttachModalAttachedCompanyName(attachedCompanyName)
        setAttachModalAttachmentType(attachmentType)

        setIsOpenModal(true)
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

    const detachAll = async (issuedTo, attachedCompanyId, attachmentType) => {
        try {
            const response = await http.post('/MoneyCodes/detach-all-money-codes', {
                issuedTo,
                attachedCompanyId,
                attachmentType
            })
            if (response?.success) {
                toast.success('Unplugged successfully!')
                getAttachments()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

    const getAttachments = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/MoneyCodes/get-attachments", filters)
            setAttachments(response?.data?.items)
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
            attachmentType,
            searchTerm,
            pageNumber,
            pageSize,
            isEditable: isEditable
        }
    },
        [pageNumber, pageSize, searchTerm, isEditable, companyId, attachmentType]
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
                  <Col span={6}>
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
                  <Col span={6}>
                      <Select
                        className='w-[200px]'
                        placeholder="Filter"
                        options={[
                            { value: false, label: 'Invoiced' },
                            { value: true, label: 'Not Inviced' },
                        ]}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                          (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={isEditable}
                        onChange={(e) => setIsEditable(e)}
                      />
                  </Col>
              </Row>,
        }
    ]


    const MoneyCodesTableComponent = ({ record }) => {
        const [moneyCodes, setMoneyCodes] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [pageNumber, setPageNumber] = useState(1)
        const [pageSize, setPageSize] = useState(10)
        const [totalCount, setTotalCount] = useState(0)

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

        const detachCompany = async (moneyCodeId) => {
            try {
                const response = await http.post(`/MoneyCodes/detach/${moneyCodeId}`)
                if (response?.success) {
                    toast.success('Unplugged successfully!')

                    if (totalCount === 1) {
                        getAttachments();
                    } else {
                        getMoneyCodes();
                    }
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

                    if (totalCount === 1) {
                        getAttachments();
                    } else {
                        getMoneyCodes();
                    }
                } else {
                    toast.error(response?.error)
                }
            } catch (error) {
                toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
            }
        }

        const rollback = async (id) => {
            try {
                const response = await http.post(`MoneyCodes/unskip/${id}`)
                if (response?.success) {
                    toast.success(`The money code was rolled back successfully!`)

                    if (totalCount === 1) {
                        getAttachments();
                    } else {
                        getMoneyCodes();
                    }
                } else {
                    toast.error(response?.error)
                }
            } catch (error) {
                toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
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

        const getMoneyCodes = async () => {
            setIsLoading(true)
            try {
                const response = await http.post("/MoneyCodes/filter", {
                    companyId: record?.attachedCompanyId,
                    issuedTo: record?.issuedTo,
                    attachmentType: record?.attachmentType,
                    pagination: {
                        pageNumber,
                        pageSize
                    }
                })
                setMoneyCodes(response?.data?.items)
                setTotalCount(response?.data?.totalCount)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }

        const onAttachSuccess = () => {
            if (totalCount === 1) {
                getAttachments();
            } else {
                getMoneyCodes();
            }
        }

        useEffect(() => {
            getMoneyCodes();
        }, [record, pageNumber, pageSize]);


        return (
          <>
              <CustomTable
                name="attachment-child-money-codes"
                columns={moneyCodesListColumns(pageNumber, pageSize, rollback, skipMoneyCode, detachCompany, openCompanyAttachModal, openOneTimeCompanyAttachModal, openCompanyDetailsModal)}
                showFilter={false}
                data={moneyCodes?.map(item => {
                    return { ...item, key: uuidv4() };
                })}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                rowKey={'key'}
                sbowPagination={false}
                scroll={{ 'x': '100%' }}
              />

              {
                  openAttachToCompanyModal ? (
                    <AttachToCompany
                      isOpenModal={openAttachToCompanyModal}
                      setIsOpenModal={setOpenAttachToCompanyModal}
                      onSuccess={onAttachSuccess}
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
          </>
        );
    };

    useEffect(() => {
        getAttachments()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm, filters])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm, companyId, attachmentType, isEditable])

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
                <Col span={5} className='ml-auto flex'>
                    <Input.Search
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder='Search'
                        allowClear
                        className='w-[250px] ml-3'
                    />
                </Col>
            </Row>

            <CustomTable
                name="attached-companies"
                columns={attachedCompaniesColumns(pageNumber, pageSize, openCompanyAttachModal, detachAll, openCompanyDetailsModal)}
                data={attachments?.map(item => {
                    return { ...item, key: uuidv4() };
                })}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                rowKey={'key'}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                rowClassName={(record) => (record?.isEditable ? '' : 'bg-[#e9f6f0]')}
                scrollY="55vh"
                expandable={{
                    expandedRowRender: (record) => <MoneyCodesTableComponent record={record} />,
                }}
            />

            {
                isOpenModal ? (
                    <AttachAllMoneyCodesToCompany
                        isOpenModal={isOpenModal}
                        setIsOpenModal={setIsOpenModal}
                        onSuccess={getAttachments}
                        issuedTo={attachModalIssuedTo}
                        oldAttachedCompanyId={attachModalAttachedCompanyId}
                        oldAttachedCompanyName={attachModalAttachedCompanyName}
                        oldAttachmentType={attachModalAttachmentType}
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

export default AttachedCompanies