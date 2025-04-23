import { Button, DatePicker, Form, Modal } from 'antd';
import http from '../utils/axiosInterceptors';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const SetBillingDateToMoneyCodeModal = (props) => {
  const {
    isOpenModal,
    onSuccess,
    setIsOpenModal,
    moneyCodeId,
    billingDate,
  } = props;

  const [form] = Form.useForm();

  const [selectedBillingDate, setSelectedBillingDate] = useState(dayjs(billingDate, "YYYY-MM-DD"));
  const [submitLoading, setSubmitLoading] = useState(false)

  const closeModal = () => {
    setIsOpenModal(false)
  }

  const onChangeBillingDate = (dates, dateValue) => {
    setSelectedBillingDate(dateValue);
  }

  const submit = async (values) => {
    const data = {
      moneyCodeId,
      billingDate: selectedBillingDate
    }

    setSubmitLoading(true)

    try {
      await http.post(`/MoneyCodes/update-billing-date/`, data);
      onSuccess();
      closeModal();
      toast.success('Billing date has been set to money code')
    } catch (error) {
      console.log(error)
      toast.error('Failed to set billing date to money code')
    }
    finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    form.setFieldValue('billingDate', selectedBillingDate)
  }, [moneyCodeId])

  return (
    <Modal
      open={isOpenModal}
      footer={[]}
      title={`Set Billing Date to Money Code`}
      width={500}
      onCancel={closeModal}
    >
      <Form
        form={form}
        onFinish={submit}
        layout="vertical"
        autoComplete="off">
        <Form.Item
          label="Billing Date"
          name="billingDate"
          rules={[{ required: true, message: 'Please input billing date!' }]}
        >
          <DatePicker onChange={onChangeBillingDate} defaultValue={selectedBillingDate ? dayjs(selectedBillingDate, "YYYY-MM-DD") : null} style={{ width: '100%' }} />
        </Form.Item>

        <div className='flex justify-end'>
          <Button htmlType='submit' type='primary' loading={submitLoading}>Update</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default SetBillingDateToMoneyCodeModal;