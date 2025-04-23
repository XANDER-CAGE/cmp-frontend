import React, { useEffect, useState } from 'react'
import BankCards from '../bank-cards'
import BankAccounts from '../bank-accounts'
import { Col, Divider, Row, Typography, InputNumber, DatePicker, Input, Button } from 'antd'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { paymentListColumns } from '../../sources/columns/paymentListColumns'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

const Text = Typography

const Payments = (props) => {
    const { openedCompanyId, invoiceId, getInvoiceInfo, setIsOpenDetailsModal } = props
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [paymentList, setPaymentList] = useState([])
    const [invoiceInfo, setInvoiceInfo] = useState({})
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const [amount, setAmount] = useState(0)
    const [notes, setNotes] = useState('')
    const [paymentDate, setPaymentDate] = useState(dayjs(Date.now()))

    const getInvoiceInfoById = async () => {
        setIsLoading(true)
        try {
            const response = await http.get(`Invoices/${invoiceId}`)
            setInvoiceInfo(response?.data)
            setAmount(Number(response?.data?.remainingAmount))
            setNotes(response?.data?.notes)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getInvoicePayments = async () => {
        setIsLoading(true)
        try {
            const response = await http.get(`InvoicePayments/${invoiceId}`)
            setPaymentList(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deletePayment = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`InvoicePayments/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getInvoicePayments()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setDeleteLoading(false)
        }
    }

    const saveInvoicePayments = async () => {
        const data = {
            invoiceId,
            amount,
            notes,
            paymentDate: dayjs(paymentDate).format('YYYY-MM-DD')
        }
        try {
            const response = await http.post(`InvoicePayments`, data)
            if (response?.success) {
                toast.success('Saved succesfully')
                setIsOpenDetailsModal(false)
                getInvoiceInfo()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        }
    }

    useEffect(() => {
        getInvoicePayments()
        getInvoiceInfoById()

        // eslint-disable-next-line
    }, [invoiceId])

    return (
        <div>
            <Row>
                <Col span={12}>
                    <Text className='text-[18px] font-bold'>Email(s)</Text>
                    {
                        invoiceInfo?.companyAccount?.company?.emails?.map((item, index) => {
                            return (
                                <p className='m-0' key={index}>{item}</p>
                            )
                        })
                    }
                </Col>
                <Col span={12}>
                    <Text className='text-[18px] font-bold'>Phone(s)</Text>
                    {
                        invoiceInfo?.companyAccount?.company?.phoneNumbers?.map((item, index) => {
                            return (
                                <p className='m-0' key={index}>{item}</p>
                            )
                        })
                    }
                </Col>
            </Row>
            <Divider />

            <Row className='mb-3'>
                <Col span={8}>
                    <Text className='text-[18px] font-bold'>Total Amount</Text>
                    {invoiceInfo?.totalAmount}$
                </Col>
                <Col span={8}>
                    <Text className='text-[18px] font-bold'>Total Paid</Text>
                    {invoiceInfo?.totalPaid}$
                </Col>
                <Col span={8}>
                    <Text className='text-[18px] font-bold'>Remaining Amount</Text>
                    <span className='text-[red]'>{invoiceInfo?.remainingAmount}$</span>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col span={5}>
                    <InputNumber min={0} className='width-[100%]' value={amount} onChange={(e) => setAmount(e)} />
                </Col>
                <Col span={5}>
                    <DatePicker
                        value={paymentDate ? dayjs(paymentDate) : null}
                        onChange={(date, dateString) => setPaymentDate(dateString)}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col span={12}>
                    <Input placeholder='Notes' value={notes} onChange={(e) => setNotes(e.target.value)} />
                </Col>
                <Col span={2} onClick={saveInvoicePayments}>
                    <Button style={{ width: '100%' }} type='primary'>Save</Button>
                </Col>
            </Row>
            <Divider />

            <Text className='text-[18px] font-bold'>Bank Cards</Text>
            <BankCards openedCompanyId={openedCompanyId} />
            <Divider />

            <Text className='text-[18px] font-bold'>Bank Accounts</Text>
            <BankAccounts openedCompanyId={openedCompanyId} />
            <Divider />

            <Text className='text-[18px] font-bold'>Payment List</Text>
            <CustomTable
                name="payment-list"
                columns={paymentListColumns(pageNumber, pageSize, deletePayment, deleteLoading)}
                data={paymentList}
                size="small"
                isLoading={isLoading}
                scrollY={'60vh'}
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                pageSize={pageSize}
                pageNumber={pageNumber}
            />
        </div>
    )
}

export default Payments