import { Alert, Button, Checkbox, Col, Descriptions, Modal, Row, Select, Statistic, Table, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react'
import http from '../utils/axiosInterceptors'
import { reFormat, setUTCTime } from '../utils'
import { debtorTypeOptions } from '../constants'
import { toast } from 'react-toastify'

const Text = Typography

const MoveToDebtorsModal = (props) => {
    const { isOpenMoveToDebtorsModal, setIsOpenMoveToDebtorsModal, invoiceId } = props

    const [data, setData] = useState([])
    const [invoiceLines, setInvoiceLines] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isAllChecked, setIsAllChecked] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [submitLoading, setSubmitLoading] = useState(false)
    const [debtorType, setDebtorType] = useState('Insurance')
    const [selectedAmount, setSelectedAmount] = useState(0)

    const getForDebt = async () => {
        setIsLoading(true)
        try {
            const response = await http.get(`Invoices/${invoiceId}/get-for-debt`)
            setData(response?.data)
            setInvoiceLines(response?.data?.invoiceLines?.map((item) => ({ ...item, isSelected: false })))
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleCheckAll = () => {
        invoiceLines.forEach((item) => (item.isSelected = !isAllChecked))
        setInvoiceLines([...invoiceLines])
        setIsAllChecked(!isAllChecked)
    }

    const idHandler = (item) => {
        item.isSelected = !item.isSelected
        setInvoiceLines([...invoiceLines])
    }

    const columns = useMemo(
        () => [
            {
                title: <Checkbox onChange={toggleCheckAll} checked={isAllChecked} disabled={debtorType === "Insurance" || debtorType === 'BadDebtor'} />,
                render: (row) => {
                    return <Checkbox checked={row?.isSelected} disabled={debtorType === "Insurance" || debtorType === 'BadDebtor'}></Checkbox>
                },
                width: 50,
                align: 'center',
                fixed: 'left',
            },
            {
                title: `Card`,
                dataIndex: ['transaction', 'cardNumber'],
                key: 'cardNumber',
                type: 'string',
                width: 200,
                align: 'center'
            },
            {
                title: `Transaction Date`,
                dataIndex: ['transaction', 'transactionDate'],
                key: 'transactionDate',
                type: 'string',
                width: 150,
                align: 'center',
                render: (date) => setUTCTime(date, 'YYYY-MM-DD')
            },
            {
                title: `Driver Name`,
                dataIndex: ['transaction', 'driverName'],
                key: 'driverName',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Location`,
                dataIndex: ['transaction', 'locationName'],
                key: 'locationName',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `City`,
                dataIndex: ['transaction', 'city'],
                key: 'city',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `State/Prov`,
                dataIndex: ['transaction', 'state'],
                key: 'state',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Quantity`,
                dataIndex: ['transaction', 'quantity'],
                key: 'quantity',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Amount`,
                dataIndex: 'totalAmount',
                key: 'totalAmount',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Fees`,
                dataIndex: ['transaction', 'fees'],
                key: 'fees',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Item`,
                dataIndex: ['transaction', 'item'],
                key: 'item',
                type: 'string',
                width: 150,
                align: 'center'
            },

            {
                title: `Unit Price`,
                dataIndex: ['transaction', 'unitPrice'],
                key: 'unitPrice',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Disc Ppu`,
                dataIndex: ['transaction', 'discPpu'],
                key: 'discPpu',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Disc Cost`,
                dataIndex: ['transaction', 'discCost'],
                key: 'discCost',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Disc Amount`,
                dataIndex: ['transaction', 'discAmount'],
                key: 'discAmount',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Amount`,
                dataIndex: ['transaction', 'amount'],
                key: 'amount',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Discount PPU`,
                dataIndex: 'discountPpuBilling',
                key: 'discountPpuBilling',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Discount Cost`,
                dataIndex: 'discountCostBilling',
                key: 'discountCostBilling',
                type: 'string',
                width: 150,
                align: 'center'
            },
            {
                title: `Discount Amount`,
                dataIndex: 'discountAmountBilling',
                key: 'discountAmountBilling',
                type: 'string',
                width: 150,
                align: 'center'
            },

        ],

        // eslint-disable-next-line
        [selectedRows, isAllChecked, debtorType],
    )

    const submitForm = async () => {
        setSubmitLoading(true)
        try {
            const response = await http.post(`Invoices/${invoiceId}/forward-deb-list`, {
                debtorType,
                invoiceLines: debtorType === 'Fraud' ? selectedRows?.map(item => item?.id) : null
            })
            console.log(response)
            if (response?.success) {
                toast.success('Successfully moved to debtors!')
                setIsOpenMoveToDebtorsModal(false)
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setSubmitLoading(false)
        }
    }

    useEffect(() => {
        setSelectedAmount(
            selectedRows?.reduce((acc, cur) => {
                return acc + cur?.totalAmount
            }, 0)
        )
    }, [selectedRows])

    useEffect(() => {
        setSelectedRows(
            invoiceLines
                ?.filter(item => item?.isSelected)
        )
    }, [invoiceLines])

    useEffect(() => {
        getForDebt()

        // eslint-disable-next-line
    }, [invoiceId])

    useEffect(() => {
        if(debtorType === 'Insurance' || debtorType === 'BadDebtor') {
            invoiceLines.forEach((item) => (item.isSelected = false))
            setInvoiceLines([...invoiceLines])
            setIsAllChecked(false)
        }
    }, [debtorType])

    return (
        <Modal
            open={isOpenMoveToDebtorsModal}
            onCancel={() => setIsOpenMoveToDebtorsModal(false)}
            footer={[]}
            title='Move To Debtors'
            width={1800}
        >
            <Row>
                <Col span={24} className='mt-1'>
                    <Descriptions bordered={false} size={'small'} layout={'vertical'}>
                        <Descriptions.Item label='Organization'>{data?.companyAccount?.organization?.name}</Descriptions.Item>
                        <Descriptions.Item label='EFS Account'>{data?.companyAccount?.efsAccount?.name}</Descriptions.Item>
                        <Descriptions.Item label='Company Name'>{data?.companyAccount?.company?.name}</Descriptions.Item>
                        <Descriptions.Item label='Invoice Number'>{data?.invoiceNumber}</Descriptions.Item>
                        <Descriptions.Item label='Date Period'>{setUTCTime(data?.startPeriod, 'YYYY-MM-DD')} - {setUTCTime(data?.endPeriod, 'YYYY-MM-DD')}</Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={24} className='mb-4'>
                    <Alert description={<span>If the <strong>Debtor Type</strong> selected is <strong>Insurance</strong> or <strong>BadDebtor</strong>, the entire invoice is moved to the Debtor List. If the <strong>Debtor Type</strong> is <strong>Fraud</strong>, you can select the fraudulent transactions, and a new debtor invoice will be created from the selected transactions. <br/>The chosen fraudulent transactions will be removed from the current invoice, amounts will be recalculated, and the invoice will be regenerated.</span>} type="info" showIcon />
                </Col>
                <Col span={18}>
                    <div className='mb-4'>
                        <Row gutter={[16, 16]}>
                            <Col span={4}>
                                <Statistic
                                  title="Total Amount:"
                                  value={reFormat(data?.totalAmount?.toFixed(2))}
                                  valueStyle={{
                                      color: '#333333',
                                  }}
                                  suffix="$"
                                />
                            </Col>
                            <Col span={4}>
                                <Statistic
                                  title="Total Money Code:"
                                  value={reFormat(data?.totalMoneyCodeAmount?.toFixed(2))}
                                  valueStyle={{
                                      color: '#1890ff',
                                  }}
                                  suffix="$"
                                />
                            </Col>
                            <Col span={4}>
                                <Statistic
                                  title="Total Paid:"
                                  value={reFormat(data?.totalPaid?.toFixed(2))}
                                  valueStyle={{
                                      color: '#52c41a',
                                  }}
                                  suffix="$"
                                />
                            </Col>
                            <Col span={4}>
                                <Statistic
                                  title="Remaining Amount:"
                                  value={reFormat(data?.remainingAmount?.toFixed(2))}
                                  valueStyle={{
                                      color: '#ff4d4f',
                                  }}
                                  suffix="$"
                                />
                            </Col>
                            <Col span={4}>
                                <Statistic
                                  title="Selected Amount:"
                                  value={reFormat(selectedAmount?.toFixed(2))}
                                  valueStyle={{
                                      color: '#722ed1',
                                  }}
                                  suffix="$"
                                />
                            </Col>
                        </Row>
                        {/*<Text><b>Total Amount:</b> {reFormat(data?.totalAmount?.toFixed(2))}$</Text>*/}
                        {/*<Text className='ml-[50px]'><b>Total Money Code:</b> <span className='text-[brown]'>{reFormat(data?.totalMoneyCodeAmount?.toFixed(2))}$</span></Text>*/}
                        {/*<Text className='ml-[50px]'><b>Total Paid:</b> <span className='text-[green]'>{reFormat(data?.totalPaid?.toFixed(2))}$</span></Text>*/}
                        {/*<Text className='ml-[50px]'><b>Remaining Amount:</b> <span className='text-[red]'>{reFormat(data?.remainingAmount?.toFixed(2))}$</span></Text>*/}
                        {/*<Text className='ml-[50px]'><b>Selected Amount:</b> <span className='text-[blue]'>{reFormat(selectedAmount?.toFixed(2))}$</span></Text>*/}
                    </div>
                </Col>
                <Col span={6} className='ml-auto mb-5'>
                    <Select
                        className='w-[100%]'
                        placeholder="Debtor Type"
                        options={debtorTypeOptions}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={debtorType}
                        onChange={(e) => setDebtorType(e)}
                    />
                </Col>
            </Row>

            <Table
                dataSource={invoiceLines}
                rowKey={`id`}
                columns={columns}
                size="small"
                loading={isLoading}
                scroll={{
                    x: 'scroll',
                    y: '50vh'
                }}
                onRow={(row) => {
                    return {
                        onClick: () => {
                            debtorType !== "Insurance" ? idHandler(row) : console.log('')
                        },
                    }
                }}
            />

            <Row className='mt-2'>
                <Text>Total: {selectedRows?.length}/{invoiceLines?.length}</Text>
                <Col className='ml-auto'>
                    <Button className='mr-3' disabled={submitLoading} onClick={() => setIsOpenMoveToDebtorsModal(false)}>Close</Button>
                    <Button type='primary' loading={submitLoading} disabled={submitLoading} onClick={submitForm}>Submit</Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default MoveToDebtorsModal