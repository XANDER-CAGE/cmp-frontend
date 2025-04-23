import { Col, Collapse, DatePicker, Row, Select, Input } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import CustomTable from '../../../components/custom-table'
import http from '../../../utils/axiosInterceptors'
import { refundedTransactionInvoicePaymentStatusOptions, refundedTransactionStatusOptions } from '../../../constants';
import { FaFilter } from 'react-icons/fa';
import { useLocalStorageState } from 'ahooks';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { refundedTransactionsColumns } from '../../../sources/columns/refundedTransactionsColumnsColumns';
import AttachOriginalToRefundedTransactionModal from '../../../modals/attach-original-to-refunded-transaction';
import { suspiciousTransactionsColumns } from '../../../sources/columns/suspiciousTransactionsColumnsColumns';
import CompanyDetailsModal from '../../../modals/companyDetailsModal';

const { RangePicker } = DatePicker

const RefundedTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [status, setStatus] = useState()
  const [paymentStatus, setPaymentStatus] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenFilter, setIsOpenFilter] = useLocalStorageState("refundedTransactionsFilter", { defaultValue: false })
  const [isOpenAttachTransactionModal, setIsOpenAttachTransactionModal] = useState(false)
  const [refundedTransactionId, setRefundedTransactionId] = useState(null)

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
      const response = await http.post("/RefundedTransactions/filter", filters)
      setTransactions(response?.data?.items)
      setTotalCount(response?.data?.totalCount)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const detachedTransaction = async (transactionId) => {
    try {
      const response = await http.post(`/RefundedTransactions/${transactionId}/detach-original-transaction`)
      if(response.success) {
        toast.success('Transaction detached successfully')
        getTransactions()
      }else{
        toast.error(response?.error ?? 'Transaction detached failed')
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Transaction detached failed')
    }
  }

  const openAttachTransactionModal = async (transactionId) => {
    setIsOpenAttachTransactionModal(true)
    setRefundedTransactionId(transactionId)
  }

  const filters = useMemo(() => {
      return {
        searchTerm,
        status,
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
    [pageNumber, pageSize, searchTerm, status, paymentStatus, dateStrings]
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
              placeholder="Status"
              options={refundedTransactionStatusOptions}
              showSearch
              allowClear
              filterOption={(input, option) =>
                (option?.label || '').toLowerCase().includes(input.toLowerCase())
              }
              value={status}
              onChange={(e) => setStatus(e)}
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

  const AttachedTransactionTableComponent = ({ suspiciousTransaction }) => {

    return (
      <>
        <CustomTable
          name="refunded-attached-transactions"
          columns={suspiciousTransactionsColumns(1, 100)}
          showFilter={false}
          data={[{...suspiciousTransaction, key: uuidv4()}] }
          size="small"
          rowKey={'key'}
          showPagination={false}
          scroll={{ 'x': '100%' }}
        />
      </>
    );
  };

  useEffect(() => {
    getTransactions()

    // eslint-disable-next-line
  }, [pageNumber, pageSize, searchTerm, status, paymentStatus, dateStrings])

  useEffect(() => {
    setPageNumber(1)
  }, [searchTerm, paymentStatus, status, dateStrings])

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
        name="refunded-transactions"
        columns={refundedTransactionsColumns(pageNumber, pageSize, detachedTransaction, openAttachTransactionModal, openCompanyDetailsModal)}
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
        rowClassName={(record) => (record?.suspiciousTransactionId === null ? '' : 'bg-[#e9f6f0]')}
        expandable={{
          expandedRowRender: (record) => <AttachedTransactionTableComponent suspiciousTransaction={record.suspiciousTransaction} />,
          rowExpandable: (record) => record.suspiciousTransactionId !== null,
        }}
      />

      {
        isOpenAttachTransactionModal && (
          <AttachOriginalToRefundedTransactionModal
            isOpenModal={isOpenAttachTransactionModal}
            setIsOpenModal={setIsOpenAttachTransactionModal}
            refundedTransactionId={refundedTransactionId}
            onSuccess={getTransactions}
          />
        )
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

export default RefundedTransactions