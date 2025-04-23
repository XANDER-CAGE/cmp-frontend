import { Link } from "react-router-dom"
import { setTashkentTime } from "../../utils"
import clsx from "clsx";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdOutlineDriveFileMove } from "react-icons/md";
import { Button, Tag, Tooltip } from 'antd';
import { toast } from "react-toastify";
import React from 'react';

export const invoicePaymentListColumns = (pageNumber, pageSize, openInvoiceDetailsModal, openMoveToDebtorsModal, openCompanyDetailsModal) => [
    {
        title: `#`,
        key: 'numberOfRow',
        fixed: 'left',
        align: 'center',
        width: 60,
        render: (text, obj, index) => {
            return (
                <span> {(pageNumber - 1) * pageSize + index + 1} </span>
            )
        },
        checked: true,
    },
    {
        title: `Organization`,
        dataIndex: ['companyAccount', 'organization', 'name'],
        key: 'organization',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `EFS Account`,
        dataIndex: ['companyAccount', 'efsAccount', 'name'],
        key: 'efsAccount',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Company`,
        dataIndex: ['companyAccount', 'company'],
        key: 'company',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => {
            return (
              <Button type='link' onClick={() => openCompanyDetailsModal && openCompanyDetailsModal(row?.id)} className='text-[blue]'>
                  {row?.name}
              </Button>
            )
        }
    },
    {
        title: `Status`,
        dataIndex: 'status',
        key: 'status',
        type: 'string',
        align: 'center',
        width: 100,
        checked: true,
        render: (status) => {
            switch (status){
                case 'Pending':
                    return <Tag color="cyan">Pending</Tag>
                case 'Paid':
                    return <Tag color="success">Paid</Tag>
                case 'PartiallyPaid':
                    return <Tag color="processing">Partially Paid</Tag>
            }
        }
    },
    {
        title: `Company Status`,
        dataIndex: ['companyAccount', 'company', 'companyStatus'],
        key: 'companyStatus',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Pricing Models`,
        dataIndex: 'pricingModels',
        key: 'pricingModels',
        align: 'center',
        width: 150,
        checked: true,
        render: (row) => row?.map(item => item)
    },
    {
        title: `Fees Changed`,
        dataIndex: 'feesChanged',
        key: 'feesChanged',
        align: 'center',
        width: 150,
        checked: true,
        render: (row) => row?.map(item => item)
    },
    {
        title: `Invoice Number`,
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Billing Cycle`,
        dataIndex: 'billingCycle',
        key: 'billingCycle',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Billing Type`,
        dataIndex: 'billingType',
        key: 'billingType',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Total Discount`,
        dataIndex: 'totalDiscount',
        key: 'totalDiscount',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Total Fees`,
        dataIndex: 'totalFees',
        key: 'totalFees',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `Total Fuel Amount`,
        dataIndex: 'totalFuelAmount',
        key: 'totalFuelAmount',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Merchant Fee(%)`,
        dataIndex: 'organizationMerchantFeePercentage',
        key: 'organizationMerchantFeePercentage',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Total Merchant Fee`,
        dataIndex: 'totalMerchantFeeAmount',
        key: 'totalMerchantFeeAmount',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Total Amount`,
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Bonus`,
        dataIndex: 'bonus',
        key: 'bonus',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `Total Paid`,
        key: 'totalPaid',
        align: 'center',
        width: 150,
        checked: true,
        render: (row, record) => (
            <div className="text-blue-500 cursor-pointer" onClick={() => openInvoiceDetailsModal(row)}>
                {row?.totalPaid}
            </div>
        ),
    },
    {
        title: `Discount Edited Info`,
        dataIndex: 'discountEditedInfo',
        key: 'discountEditedInfo',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Discount Variance`,
        dataIndex: 'discountVariance',
        key: 'discountVariance',
        align: 'center',
        width: 150,
        checked: true,
        render: (row) => row ? row : '-'
    },
    {
        title: `Conditional Discount Investment`,
        dataIndex: 'conditionDiscountInvestment',
        key: 'conditionDiscountInvestment',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => row ? row : '-'
    },
    {
        title: `Average Discount Per Gallon`,
        dataIndex: 'averageDiscountPerGallon',
        key: 'averageDiscountPerGallon',
        align: 'center',
        width: 220,
        checked: true,
    },
    {
        title: `Total Discounted Gallons`,
        dataIndex: 'totalDiscountedGallons',
        key: 'totalDiscountedGallons',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Remaining Amount`,
        dataIndex: 'remainingAmount',
        key: 'remainingAmount',
        align: 'center',
        width: 150,
        checked: true,
        render: (value) => (
            <span className={clsx({ 'text-green-500': value < 0, 'text-red-500': value > 0 })}>{value}</span>
        ),
    },
    {
        title: `Last Payment Date`,
        dataIndex: 'lastPaymentDate',
        key: 'lastPaymentDate',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date, 'YYYY-MM-DD') : null}</>
    },
    {
        title: `Last Payment Note`,
        dataIndex: 'lastPaymentNote',
        key: 'lastPaymentNote',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Additional Charge`,
        dataIndex: 'additionalCharge',
        key: 'additionalCharge',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Notes`,
        dataIndex: ['companyAccount', 'company', 'notes'],
        key: 'notes',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Period`,
        key: 'period',
        align: 'center',
        width: 150,
        checked: true,
        render: (row) => {
            return (
                <>
                    {setTashkentTime(row?.startPeriod, 'YYYY-MM-DD')}
                    <br />
                    {setTashkentTime(row?.endPeriod, 'YYYY-MM-DD')}
                </>
            )
        }
    },
    {
        title: `Invoice Date`,
        dataIndex: 'invoiceDate',
        key: 'invoiceDate',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{setTashkentTime(date, 'YYYY-MM-DD')}</>
    },
    {
        title: `Due Date`,
        dataIndex: 'dueDate',
        key: 'dueDate',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{setTashkentTime(date, 'YYYY-MM-DD')}</>
    },
    {
        title: `Created Date`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>
    },
    {
        title: `Created User`,
        dataIndex: ['createdUser', 'name'],
        key: 'createdUser',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Updated Date`,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date) : null}</>
    },
    {
        title: `Updated User`,
        dataIndex: ['updatedUser', 'name'],
        key: 'updatedUser',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Operations`,
        key: 'operations',
        fixed: 'right',
        align: 'center',
        width: 120,
        render: (row) => {
            return (
                <div className='flex justify-center'>
                    <div className='icon' onClick={() => openInvoiceDetailsModal(row)}>
                        <BsCurrencyDollar />
                    </div>
                    <Tooltip title={'Move To Debtors'}>
                        <div
                            className='icon'
                            onClick={() => row?.status === 'Paid' ? toast.warning(`Invoice ${row?.invoiceNumber} was already paid`) : openMoveToDebtorsModal(row)}
                        >
                            <MdOutlineDriveFileMove />
                        </div>
                    </Tooltip>
                </div>
            )
        },
        checked: true,
    },
]