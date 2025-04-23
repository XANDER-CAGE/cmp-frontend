import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { setTashkentTime, setUTCTime } from "../../utils";
import { GrAttachment } from "react-icons/gr";
import Authorize from '../../utils/Authorize';
import { PERMISSIONS } from '../../constants';
import { FaFileExcel } from 'react-icons/fa';
import React from 'react';

export const maintenancesColumns = (pageNumber, pageSize, deleteMaintenanceRequest, deleteLoading, openModal, openModalAttachment, showOptions, permissions, showExcelOperations, downloadInvoice, openCompanyDetailsModal) => [
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
        dataIndex: 'organizationName',
        key: 'organization',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Company`,
        key: 'companyName',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => {
            return (
              <Button type='link' onClick={() => openCompanyDetailsModal && openCompanyDetailsModal(row?.companyId)} className='text-[blue]'>
                  {row?.companyName}
              </Button>
            )
        }
    },
    {
        title: `Invoice Number`,
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Status`,
        dataIndex: 'status',
        key: 'status',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Fuel Invoice`,
        dataIndex: 'fuelInvoiceNumber',
        key: 'fuelInvoiceNumber',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Payment Status`,
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (status) => {
            switch (status){
                case 'Pending':
                    return <Tag color="cyan">Pending</Tag>
                case 'Paid':
                    return <Tag color="success">Paid</Tag>
                case 'Unpaid':
                    return <Tag color="error">Unpaid</Tag>
                case 'NotInvoiced':
                    return <Tag color="default">Not Invoiced</Tag>
                case 'Debtor':
                    return <Tag color="purple">Debtor</Tag>
            }
        }
    },
    {
        title: `Payment Date`,
        dataIndex: 'paymentDate',
        key: 'paymentDate',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{setUTCTime(date, 'YYYY-MM-DD')}</>
    },
    {
        title: `Billing Cycle`,
        dataIndex: 'billingCycle',
        key: 'billingCycle',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Maintenance Account`,
        dataIndex: 'maintenanceEfsAccountName',
        key: 'maintenanceEfsAccountName',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Date Used`,
        dataIndex: 'dateUsed',
        key: 'dateUsed',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        sorter: true,
    },
    {
        title: `Billing Date`,
        dataIndex: 'billingDate',
        key: 'billingDate',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Driver Name`,
        dataIndex: 'driverName',
        key: 'driverName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Retail Amount`,
        dataIndex: 'retailAmount',
        key: 'retailAmount',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Customer Discount`,
        dataIndex: 'customerDiscount',
        key: 'customerDiscount',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Discounted Amount`,
        dataIndex: 'discountedAmount',
        key: 'discountedAmount',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Service type`,
        dataIndex: 'purchasedItem',
        key: 'purchasedItem',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Our Commission`,
        dataIndex: 'ourCommission',
        key: 'ourCommission',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Location`,
        dataIndex: 'location',
        key: 'location',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `National Tire Account`,
        dataIndex: 'nationalTireAccount',
        key: 'nationalTireAccount',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `EFS Account`,
        dataIndex: 'efsAccountName',
        key: 'efsAccount',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Notes`,
        dataIndex: 'notes',
        key: 'notes',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Manual Invoice No.`,
        dataIndex: 'manualInvoiceNumber',
        key: 'manualInvoiceNumber',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Created User`,
        dataIndex: 'createdUserName',
        key: 'createdUserName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        sorter: true,
        render: (date) => <>{setTashkentTime(date)}</>
    },
    {
        title: `Updated User`,
        dataIndex: 'updatedUserName',
        key: 'updatedUserName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Updated At`,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        sorter: true,
        render: (date) => <>{date ? setTashkentTime(date) : ''}</>
    },
    showOptions && {
        title: `Operations`,
        key: 'operations',
        fixed: 'right',
        align: 'center',
        width: 200,
        render: (row) => {
            return (
                <div className='flex justify-center'>
                    <Popconfirm
                        isLoading={deleteLoading}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        title={'Are you sure to delete?'}
                        onConfirm={() => deleteMaintenanceRequest(row?.id)}
                        okText="Yes"
                        cancelText="No"
                        className={'shadow-lg overflow-hidden'}
                    >
                        <div className='icon'>
                            <MdOutlineDelete />
                        </div>
                    </Popconfirm>
                    <div className='icon' onClick={() => openModal(row?.id)}>
                        <MdEdit />
                    </div>
                    <div className='icon' onClick={() => openModalAttachment(row?.id)}>
                        {
                            row?.hasManualInvoice ? (
                                <Tooltip title="Manual Invoice">
                                    <GrAttachment style={{ color: '#1677FF' }}/>
                                </Tooltip>
                              ) :
                            row?.hasAttachments ? (
                                <GrAttachment />
                            ) : (
                                <Tooltip title="No Invoice Attachments">
                                    <GrAttachment style={{ color: '#fa8c16' }} />
                                </Tooltip>
                            )
                        }
                    </div>

                    {
                        Authorize(permissions, [PERMISSIONS.INVOICE.EXPORT]) && showExcelOperations ? (
                          <>
                              {
                                  row.invoiceId ? (
                                    <Tooltip title={'Excel'}>
                                        <div className={`icon ${!row.invoiceId ? 'disabled-button' : ''}`}
                                             onClick={() => row.invoiceId && downloadInvoice(row, 'EXCEL')}>
                                            <FaFileExcel />
                                        </div>
                                    </Tooltip>
                                  ) : (
                                    <div style={{ width: '32px', height: '32px', margin: '0 5px' }}></div>
                                  )
                              }
                          </>
                        ) : null
                    }
                </div>
            )
        },
        checked: true,
    },
]

export const maintenancesMissingInInvoicesColumns = (pageNumber, pageSize, openCompanyDetailsModal) => [
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
        dataIndex: 'organizationName',
        key: 'organization',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Company`,
        key: 'companyName',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => {
            return (
              <Button type='link' onClick={() => openCompanyDetailsModal && openCompanyDetailsModal(row?.companyId)} className='text-[blue]'>
                  {row?.companyName}
              </Button>
            )
        }
    },
    {
        title: `Invoice Number`,
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Status`,
        dataIndex: 'status',
        key: 'status',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Maintenance Account`,
        dataIndex: 'maintenanceEfsAccountName',
        key: 'maintenanceEfsAccountName',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Date Used`,
        dataIndex: 'dateUsed',
        key: 'dateUsed',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Billing Used`,
        dataIndex: 'billingUsed',
        key: 'billingUsed',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Driver Name`,
        dataIndex: 'driverName',
        key: 'driverName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Retail Amount`,
        dataIndex: 'retailAmount',
        key: 'retailAmount',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Customer Discount`,
        dataIndex: 'customerDiscount',
        key: 'customerDiscount',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Discounted Amount`,
        dataIndex: 'discountedAmount',
        key: 'discountedAmount',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Service type`,
        dataIndex: 'purchasedItem',
        key: 'purchasedItem',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Our Commission`,
        dataIndex: 'ourCommission',
        key: 'ourCommission',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Location`,
        dataIndex: 'location',
        key: 'location',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `National Tire Account`,
        dataIndex: 'nationalTireAccount',
        key: 'nationalTireAccount',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `EFS Account`,
        dataIndex: 'efsAccountName',
        key: 'efsAccount',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Notes`,
        dataIndex: 'notes',
        key: 'notes',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Created User`,
        dataIndex: 'createdUserName',
        key: 'createdUserName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>
    },
    {
        title: `Updated User`,
        dataIndex: 'updatedUserName',
        key: 'updatedUserName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Updated At`,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date) : ''}</>
    }
]