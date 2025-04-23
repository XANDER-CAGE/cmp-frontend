import React, { useEffect, useState } from 'react';
import { Col, Divider, Modal, Row, Select, Typography, Input } from 'antd';
import { toast } from 'react-toastify';
import http from '../utils/axiosInterceptors';
import { refundedTransactionsColumns } from '../sources/columns/refundedTransactionsColumnsColumns';
import { v4 as uuidv4 } from 'uuid';
import CustomTable from '../components/custom-table';
import {
  originalTransactionsColumnsForAttachToRefundedTransaction
} from '../sources/columns/originalTransactionColumnsForAttachToRefundedTransaction';
import { suspiciousTransactionTypeOptions } from '../constants';


const AttachOriginalToRefundedTransactionModal = (props) => {

  const {
    isOpenModal,
    setIsOpenModal,
    onSuccess,
    refundedTransactionId
  } = props;

  const [originalTransactions, setOriginalTransactions] = useState([])
  const [refundedTransaction, setRefundedTransaction] = useState(null)
  const [selectedOriginalTransactionId, setSelectedOriginalTransactionId] = useState(null)
  const [selectedSuspiciousTransactionId, setSelectedSuspiciousTransactionId] = useState(null)
  const [suspiciousTransactionType, setSuspiciousTransactionType] = useState('SystemError')
  const [notes, setNotes] = useState('')

  const getRefundedTransaction = async () => {
    try{
      const response = await http.get(`/RefundedTransactions/${refundedTransactionId}`)
      if(response?.success){
        setRefundedTransaction(response?.data)
      }else{
        toast.error(response?.error ?? 'Failed to get refunded transaction')
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.statusText ?? 'Failed to get refunded transaction')
    }
  }

  const getOriginalTransactions = async () => {
    try {
      const response = await http.get(`/RefundedTransactions/get-original-transactions/${refundedTransactionId}`);
      if (response?.success) {
        setOriginalTransactions(response?.data);
      } else {
        toast.error(response?.error ?? 'Failed to get original transactions');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.statusText ?? 'Failed to get original transactions');
    }
  };

  const idHandler = (row) => {
    const { transactionId, suspiciousTransaction } = row

    if(selectedOriginalTransactionId === transactionId){
      setSelectedOriginalTransactionId(null)
      setSelectedSuspiciousTransactionId(null)

      return;
    }

    setSelectedOriginalTransactionId(transactionId)
    setSelectedSuspiciousTransactionId(suspiciousTransaction?.Id)

    if(suspiciousTransaction){
      setSuspiciousTransactionType(suspiciousTransaction?.Type)
      setNotes(suspiciousTransaction?.note)
    }
  }

  const isSelected = (id) => {
    return selectedOriginalTransactionId === id
  }

  const onAttach = async () => {
    if(!selectedOriginalTransactionId){
      toast.error('Please select an original transaction to attach')
      return;
    }

    try {
      const response = await http.post(`/RefundedTransactions/${refundedTransactionId}/attach-original-transaction`, {
        originalTransactionId: selectedOriginalTransactionId,
        suspiciousTransactionId: selectedSuspiciousTransactionId,
        note: notes,
        type: suspiciousTransactionType
      })
      if (response?.success) {
        toast.success('Transaction attached successfully')
        setIsOpenModal(false)
        onSuccess()
      }else{
        toast.error(response?.error ?? 'Failed to attach transaction')
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.statusText ?? 'Failed to attach transaction')
    }
  }

  useEffect(() => {
    if(isOpenModal){
      getRefundedTransaction()
      getOriginalTransactions()
    }
  }
  , [])

  return (
    <Modal
      open={isOpenModal}
      width={1800}
      title={`Attach Original Transaction to Refunded Transaction`}
      onCancel={() => setIsOpenModal(false)}
      okText={'Save'}
      onOk={onAttach}
      maskClosable={false}
    >

      <Typography.Title className='mt-8' level={4}>
        Refunded Transaction
      </Typography.Title>

      <CustomTable
        className="mt-4"
        name="refunded-transactions-2"
        columns={refundedTransactionsColumns(1, 1, null, null, false)}
        data={[{ ...refundedTransaction, key: uuidv4() }]}
        size="small"
        scrollY="55vh"
        rowKey={'key'}
        showFilter={false}
        showPagination={false}
      />

      <Divider/>


      <Typography.Title className='mt-8' level={4}>
        Select the Original Transaction
      </Typography.Title>

      <CustomTable
        className="mt-4"
        name="refunded-transactions-22"
        columns={originalTransactionsColumnsForAttachToRefundedTransaction(1, 100, isSelected)}
        data={originalTransactions.map(item => {
          return { ...item, key: uuidv4() };
        })}
        size="small"
        scrollY="55vh"
        rowKey={'key'}
        showFilter={false}
        showPagination={false}
        isRowSelection={true}
        onRowSelection={idHandler}
        // rowSelection={{ type: 'radio', ...rowSelection }}
      />

      <Row gutter={[32, 32]}>
        <Col span={8}>
          <Typography.Title level={5}>
            Notes
          </Typography.Title>
          <Input.TextArea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder='Enter notes'
          />
        </Col>

        <Col span={6}>
          <Typography.Title level={5}>
            Suspicious Transaction Type
          </Typography.Title>
          <Select
            className='w-[100%]'
            placeholder="Select Suspicious Transaction Type"
            options={suspiciousTransactionTypeOptions}
            value={suspiciousTransactionType}
            onChange={(e) => setSuspiciousTransactionType(e)}
          />
        </Col>
      </Row>
    </Modal>
  )
}

export default AttachOriginalToRefundedTransactionModal;