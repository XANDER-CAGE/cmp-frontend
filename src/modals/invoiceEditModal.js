import { Button, Col, Empty, Spin, InputNumber, Modal, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { setUTCTime } from '../utils'
import { toast } from 'react-toastify'

const InvoiceEditModal = (props) => {
    const { isOpenEditModal, setIsOpenEditModal, invoiceId, getInvoiceInfo } = props

    const [isLoading, setIsLoading] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const [calculateLoading, setCalculateLoading] = useState(false)

    const [invoiceData, setInvoiceData] = useState({})
    const [invoiceLinesData, setInvoiceLinesData] = useState([])

    const inputHandler = (e) => {
        invoiceData.totalDiscountPercent.newValue = Number(e)
        setInvoiceData({ ...invoiceData })
    }

    const onCancel = () => {
        if (!saveLoading) {
            setInvoiceData(null)
            setInvoiceLinesData(null)
        }
    }

    const getInvoiceById = async () => {
        try {
            setIsLoading(true)
            const res = await http.get(`/Invoices/${invoiceId}/update-info`)

            if (!res?.success) {
                toast.error(res?.error)
                return
            }
            setInvoiceData(res?.data)
            setInvoiceLinesData(res?.data?.invoiceLines)
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (invoiceId) {
            getInvoiceById()
        }

        // eslint-disable-next-line
    }, [invoiceId])

    const calculate = (line, value) => {
        line.discountCostBilling.newValue = value
        setInvoiceData({ ...invoiceData })
    }

    const submitCalculate = async () => {
        try {
            setCalculateLoading(true)
            const response = await http.post('/Invoices/calculate-discount', invoiceData)

            if (!response?.success) {
                toast.error(response?.error)
                return
            }
            setInvoiceData(response?.data)
            setInvoiceLinesData(response?.data.invoiceLines)
            toast.success('Сalculated')
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setCalculateLoading(false)
        }
    }

    const save = async () => {
        try {
            setSaveLoading(true)
            const response = await http.put('/Invoices/update-invoice-discounts', invoiceData)
            if (!response?.success) {
                toast.error(response?.error)
                return
            }
            toast.success('Successfully saved')
            onCancel()
            getInvoiceInfo()
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setSaveLoading(false)
        }
    }

    return (
        <Modal
            open={isOpenEditModal}
            onCancel={() => setIsOpenEditModal(false)}
            footer={[]}
            title='Edit Invoice'
            width={1800}
        >
            <Row className="mb-5">
                <Col span={7}>
                    <div>
                        <b>Organization: </b> {invoiceData?.organizationName}
                    </div>
                    <div>
                        <b>Company: </b> {invoiceData?.companyName}
                    </div>
                    <div>
                        <b>Efs Account: </b> {invoiceData?.efsAccountName}
                    </div>
                    <div>
                        <b>Period: </b>
                        {setUTCTime(invoiceData?.startPeriod, 'YYYY-MM-DD')} - {setUTCTime(invoiceData?.endPeriod, 'YYYY-MM-DD')}
                    </div>
                    <div>
                        <b>Invoice Number: </b> {invoiceData?.invoiceNumber}
                    </div>
                    <div>
                        <b>Fees: </b> {invoiceData?.totalFees}
                    </div>
                    <div>
                        <b>Bonus: </b> {invoiceData?.bonus}
                    </div>
                </Col>

                <Col span={7}>
                    <div>
                        <b>Total Discount Gallons: </b> {invoiceData?.totalDiscountedGallons}
                    </div>
                    <div>
                        <b>Total Discountable Fuel Retail Amount: </b> {invoiceData?.totalDiscountableFuelRetailAmount}
                    </div>
                    <div>
                        <b>Total Moneycodes: </b> {invoiceData?.totalMoneyCodes}
                    </div>
                    <div>
                        <b>Total Maintenances: </b> {invoiceData?.totalMaintenanceAmount}
                    </div>
                    <div>
                        <b>Total Maintenance Discount: </b> {invoiceData?.totalMaintenanceDiscountAmount}
                    </div>
                </Col>

                <Col span={10}>
                    <table className="default-table inv-amount-diff-table">
                        <tr>
                            <th></th>
                            <th>Previous</th>
                            <th>Current</th>
                            <th>New</th>
                            <th>Difference</th>
                        </tr>
                        <tr>
                            <th>Total Fuel Amount</th>
                            <td>{invoiceData?.totalFuelAmount?.previousValue}</td>
                            <td>{invoiceData?.totalFuelAmount?.oldValue}</td>
                            <td>{invoiceData?.totalFuelAmount?.newValue}</td>
                            <td>{invoiceData?.totalFuelAmount?.diff}</td>
                        </tr>
                        <tr>
                            <th>Total Discount</th>
                            <td>{invoiceData?.totalDiscount?.previousValue}</td>
                            <td>{invoiceData?.totalDiscount?.oldValue}</td>
                            <td>{invoiceData?.totalDiscount?.newValue}</td>
                            <td>{invoiceData?.totalDiscount?.diff}</td>
                        </tr>
                        <tr>
                            <th>Avarage Discount Per Gallon</th>
                            <td>{invoiceData?.averageDiscountPerGallon?.previousValue}</td>
                            <td>{invoiceData?.averageDiscountPerGallon?.oldValue?.toFixed(2)}</td>
                            <td>{invoiceData?.averageDiscountPerGallon?.newValue?.toFixed(2)}</td>
                            <td>{invoiceData?.averageDiscountPerGallon?.diff}</td>
                        </tr>
                        <tr>
                            <th>Total After Discount</th>
                            <td>{invoiceData?.totalAmountAfterDiscount?.previousValue}</td>
                            <td>{invoiceData?.totalAmountAfterDiscount?.oldValue}</td>
                            <td>{invoiceData?.totalAmountAfterDiscount?.newValue}</td>
                            <td>{invoiceData?.totalAmountAfterDiscount?.diff}</td>
                        </tr>
                        <tr>
                            <th>Merchant Fee Percent(%)</th>
                            <td>{invoiceData?.merchantFeePercent?.previousValue}</td>
                            <td>{invoiceData?.merchantFeePercent?.oldValue}</td>
                            <td>{invoiceData?.merchantFeePercent?.newValue}</td>
                            <td>{invoiceData?.merchantFeePercent?.diff}</td>
                        </tr>
                        <tr>
                            <th>Total Merchant Fee</th>
                            <td>{invoiceData?.totalMerchantFeeAmount?.previousValue}</td>
                            <td>{invoiceData?.totalMerchantFeeAmount?.oldValue}</td>
                            <td>{invoiceData?.totalMerchantFeeAmount?.newValue}</td>
                            <td>{invoiceData?.totalMerchantFeeAmount?.diff}</td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>{invoiceData?.totalAmount?.previousValue}</td>
                            <td>{invoiceData?.totalAmount?.oldValue}</td>
                            <td>{invoiceData?.totalAmount?.newValue}</td>
                            <td>{invoiceData?.totalAmount?.diff}</td>
                        </tr>
                        <tr>
                            <th>Total Discount Percent(%)</th>
                            <td>{invoiceData?.totalDiscountPercent?.previousValue}</td>
                            <td>{invoiceData?.totalDiscountPercent?.oldValue}</td>
                            <td>{invoiceData?.totalDiscountPercent?.newValue}</td>
                            <td>{invoiceData?.totalDiscountPercent?.diff}</td>
                        </tr>
                    </table>
                </Col>
            </Row>

            <div className="mb-3" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div></div>
                <div className="flex">
                    <InputNumber
                        value={invoiceData?.totalDiscountPercent?.newValue}
                        placeholder="Input New Percentage"
                        type="number"
                        onChange={(value) => inputHandler(value)}
                        style={{ width: 150 }}
                        className="ml-3"
                        min={0}
                        max={50}
                        readOnly={invoiceData?.calculationMethod === 'ByDiscount'}
                    />
                    <Select
                        value={invoiceData?.calculationMethod || 'By Percentage'}
                        placeholder="Calculation Method"
                        options={[
                            { value: 'ByDiscount', label: 'By Discount' },
                            { value: 'ByPercentage', label: 'By Percentage' },
                        ]}
                        onChange={(value) =>
                            setInvoiceData({
                                ...invoiceData,
                                calculationMethod: value,
                                totalDiscountPercent: { ...invoiceData.totalDiscountPercent, newValue: null },
                            })
                        }
                        style={{ width: 200 }}
                        className="mx-3"
                        showSearch
                    />
                    <Button
                        type={'primary'}
                        className="mr-2"
                        onClick={submitCalculate}
                        loading={calculateLoading}
                        disabled={saveLoading || calculateLoading}
                    >
                        Calculate
                    </Button>
                    <Button type={'primary'} onClick={save} loading={saveLoading} disabled={calculateLoading || saveLoading}>
                        Save
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <Spin />
            ) : (
                <div style={{ overflow: 'auto', height: 'calc(100vh - 360px)' }}>
                    <table className="custom-table">
                        {
                            invoiceLinesData?.length > 0 ? (
                                <thead>
                                    <tr>
                                        <th colSpan={10} style={{ backgroundColor: '#ffffff' }}></th>
                                        <th colSpan={4} style={{ backgroundColor: '#bfc8ff' }}>
                                            From Transaction
                                        </th>
                                        <th colSpan={8} style={{ backgroundColor: '#c7ffcb' }}>
                                            Calculated
                                        </th>
                                    </tr>
                                    <tr>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>Card</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>Transaction Date</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>Driver Name</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>Location</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>City</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>State/Prov</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>Fee</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>Item</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>Quantity</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>UnitPrice</th>

                                        <th style={{ backgroundColor: '#bfc8ff' }}>Disc PPU</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>Disc Cost</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>Disc Amount</th>
                                        <th style={{ backgroundColor: '#bfc8ff' }}>Amount</th>

                                        <th style={{ backgroundColor: '#c7ffcb' }} colSpan={2}>
                                            Disc PPU
                                        </th>
                                        <th style={{ backgroundColor: '#c7ffcb' }} colSpan={2}>
                                            Disc Cost
                                        </th>
                                        <th style={{ backgroundColor: '#c7ffcb' }} colSpan={2}>
                                            Disc Amount
                                        </th>
                                        <th style={{ backgroundColor: '#c7ffcb' }} colSpan={2}>
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                            ) : null
                        }
                        <tbody>
                            {invoiceLinesData?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item?.transaction?.cardNumber}</td>
                                        <td>{setUTCTime(item?.transaction?.transactionDate, 'YYYY-MM-DD')}</td>
                                        <td>{item?.transaction?.driverName}</td>
                                        <td>{item?.transaction?.locationName}</td>
                                        <td>{item?.transaction?.city}</td>
                                        <td>{item?.transaction?.state}</td>
                                        <td>{item?.transaction?.fees}</td>
                                        <td>{item?.transaction?.item}</td>
                                        <td>{item?.transaction?.quantity}</td>
                                        <td>{item?.transaction?.unitPrice}</td>
                                        <td>{item?.transaction?.discPpu}</td>
                                        <td>{item?.transaction?.discCost}</td>
                                        <td>{item?.transaction?.discAmount}</td>
                                        <td>{item?.transaction?.amount}</td>
                                        <td style={{ width: '60px' }}>{item?.discountPpuBilling?.oldValue}</td>
                                        <td style={{ width: '60px' }}>{item?.discountPpuBilling?.newValue ?? '-'}</td>
                                        <td style={{ width: '60px' }}>{item?.discountCostBilling?.oldValue}</td>
                                        <td style={{ width: '60px', padding: '5px' }}>
                                            {item?.isDiscountEditable ? (
                                                <InputNumber
                                                    type="number"
                                                    placeholder="Edit..."
                                                    style={{
                                                        width: '80px',
                                                        border: '1px solid #00000080',
                                                    }}
                                                    size="small"
                                                    readOnly={invoiceData?.calculationMethod === 'ByDiscount' ? false : true}
                                                    min={0}
                                                    max={item?.newDiscountMaxValue}
                                                    value={item?.discountCostBilling?.newValue}
                                                    onChange={(e) => calculate(item, e)}
                                                />
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td style={{ width: '60px' }}>{item?.discountAmount?.oldValue?.toFixed(2)}</td>
                                        <td style={{ width: '60px' }}>{item?.discountAmount?.newValue?.toFixed(2) ?? '-'}</td>
                                        <td style={{ width: '60px' }}>{item?.totalAmount?.oldValue?.toFixed(2)}</td>
                                        <td style={{ width: '60px' }}>{item?.totalAmount?.newValue?.toFixed(2) ?? '-'}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {invoiceLinesData?.length > 0 ? null : (
                        <div className="p-5">
                            <Empty />
                        </div>
                    )}
                </div>
            )}
        </Modal>
    )
}

export default InvoiceEditModal