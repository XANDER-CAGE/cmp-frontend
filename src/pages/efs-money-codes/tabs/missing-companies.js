import { Col, Input, Row } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import { missingCompaniesColumns } from '../../../sources/columns/missingCompaniesColumns'
import AttachToCompany from '../../../modals/attachToCompany'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid';
import { uncheckedMoneyCodesColumns } from '../../../sources/columns/uncheckedMoneyCodesColumns';
import AttachAllUncheckedMoneyCodesToCompany from '../../../modals/attachAllUncheckedMoneyCodesToCompany';

const MissingCompanies = () => {
    const [missingCompanies, setMissingCompanies] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)

    const [attachModalIssuedTo, setAttachModalIssuedTo] = useState(null)

    const openModal = (issuedTo) => {
        setIsOpenModal(true)
        setAttachModalIssuedTo(issuedTo)
    }

    const skipAllByIssuedTo = async (issuedTo) => {
        try {
            const response = await http.post('/EfsMoneyCodes/skip-all-by-issued-to', {
                issuedTo
            })
            if (response?.success) {
                toast.success('Skipped Succesfully!')
                getMissingCompanies()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

    const getMissingCompanies = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("/EfsMoneyCodes/get-unchecked-money-codes-group", filters)
            setMissingCompanies(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const filters = useMemo(() => {
        return {
            searchTerm,
            pageNumber,
            pageSize,
        }
    },
        [pageNumber, pageSize, searchTerm]
    )


    const MoneyCodesTableComponent = ({ record, onRowsChanged }) => {
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


        const skipMoneyCode = async (id) => {
            try {
                const response = await http.post(`/EfsMoneyCodes/skip/${id}`)
                if (response?.success) {
                    toast.success('Skipped Succesfully!')

                    onAttachSuccess()
                } else {
                    toast.error(response?.error)
                }
            } catch (error) {
                toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
            }
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
                const response = await http.post(`/EfsMoneyCodes/get-unchecked-money-codes-by-group/${record.issuedTo}`, {
                    issuedTo: record?.issuedTo,
                    pageNumber,
                    pageSize,
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
            if (totalCount === 1 && onRowsChanged) {
                onRowsChanged();
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
                name="attachment-child-unchecked-money-codes"
                columns={uncheckedMoneyCodesColumns(pageNumber, pageSize, true,  skipMoneyCode, openCompanyAttachModal)}
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
                      isUncheckedMoneyCode={true}
                    />
                  ) : null
              }
          </>
        );
    };

    useEffect(() => {
        getMissingCompanies()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm])

    return (
        <div>
            <Row className='mb-5'>
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
                name="missing-companies"
                columns={missingCompaniesColumns(pageNumber, pageSize, openModal, skipAllByIssuedTo)}
                data={missingCompanies?.map(item => {
                    return { issuedTo: item, key: uuidv4() };
                })}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                rowKey={'key'}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="55vh"
                expandable={{
                    expandedRowRender: (record) => <MoneyCodesTableComponent record={record} onRowsChanged={getMissingCompanies} />,
                }}
            />

            {
                isOpenModal ? (
                    <AttachAllUncheckedMoneyCodesToCompany
                        isOpenModal={isOpenModal}
                        setIsOpenModal={setIsOpenModal}
                        onSuccess={getMissingCompanies}
                        issuedTo={attachModalIssuedTo}
                    />
                ) : null
            }
        </div>
    )
}

export default MissingCompanies