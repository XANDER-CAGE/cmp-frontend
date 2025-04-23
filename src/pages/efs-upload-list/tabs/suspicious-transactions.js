import { Col, Collapse, DatePicker, Row, Select, Input } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import {
  refundedTransactionInvoicePaymentStatusOptions,
  refundedTransactionStatusOptions,
  suspiciousTransactionTypeOptions,
} from '../../../constants';
import { FaFilter } from 'react-icons/fa';
import { useLocalStorageState } from 'ahooks';
import { v4 as uuidv4 } from 'uuid';
import { suspiciousTransactionsColumns } from '../../../sources/columns/suspiciousTransactionsColumnsColumns';
import CompanyDetailsModal from '../../../modals/companyDetailsModal';

const { RangePicker } = DatePicker

const SuspiciousTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [type, setType] = useState()
  const [paymentStatus, setPaymentStatus] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("suspiciousTransactionsFilter", { defaultValue: false })

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
  };

  const getTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await http.post("/SuspiciousTransactions/filter", filters)
      setTransactions(response?.data?.items)
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
        type,
        invoiceStatus: paymentStatus,
        period: dateStrings && dateStrings.length > 0 ? {
          startDate: `${dateStrings[0]}`,
          endDate: `${dateStrings[1]}`,
        } : null,
        paging: {
          pageNumber,
          pageSize,
        },
      };
    },
    [pageNumber, pageSize, searchTerm, type, paymentStatus, dateStrings]
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
              placeholder="Type"
              options={suspiciousTransactionTypeOptions}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              value={type}
              onChange={(e) => setType(e)}
            />
          </Col>
          <Col span={8}>
            <Select
              className='w-[100%]'
              placeholder="Invoice Status"
              options={refundedTransactionInvoicePaymentStatusOptions}
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
    getTransactions()

    // eslint-disable-next-line
  }, [pageNumber, pageSize, searchTerm, type, paymentStatus, dateStrings])

  useEffect(() => {
    setPageNumber(1)
  }, [searchTerm, paymentStatus, type, dateStrings])

  return (
    <div>
      <Row className='mb-5' gutter={[16, 16]}>
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
        name="suspicious-transactions"
        columns={suspiciousTransactionsColumns(pageNumber, pageSize, openCompanyDetailsModal)}
        data={transactions?.map(item => {
          return { ...item, key: uuidv4() };
        })}
        size="small"
        setPageNumber={setPageNumber}
        setPageSize={setPageSize}
        isLoading={isLoading}
        pageSize={pageSize}
        pageNumber={pageNumber}
        totalCount={totalCount}
        scrollY="55vh"
        rowKey={'key'}
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

export default SuspiciousTransactions