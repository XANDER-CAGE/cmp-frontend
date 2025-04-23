import { setTashkentTime, setUTCTime } from '../../utils';
import { Button, Checkbox, Tag } from 'antd';
import React from 'react';

export const originalTransactionsColumnsForAttachToRefundedTransaction = (pageNumber, pageSize, isSelected, openCompanyDetailsModal) => [
    {
        title: ``,
        dataIndex: 'transactionId',
        key: 'transactionId',
        fixed: 'left',
        width: 40,
        checked: true,
        render: (id) => {
            return <Checkbox checked={isSelected(id)}></Checkbox>
        },
    },
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
        title: `Transaction Date`,
        dataIndex: 'transactionDate',
        key: 'transactionDate',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (transactionDate) => setUTCTime(transactionDate, 'YYYY-MM-DD')
    },
    {
        title: `Card Number`,
        dataIndex: 'cardNumber',
        key: 'cardNumber',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Type`,
        dataIndex: ['suspiciousTransaction','type'],
        key: 'status',
        align: 'center',
        width: 150,
        checked: true,
        render: (status) => {
            switch (status){
                case 'New':
                    return <Tag color="cyan">New</Tag>
                case 'Resolved':
                    return <Tag color="success">Resolved</Tag>
                case 'InProgress':
                    return <Tag color="processing">InProgress</Tag>
                default:
                    return <Tag color="default">{status}</Tag>
            }
        }
    },
    {
        title: `Invoice No.`,
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        align: 'left',
        width: 150,
        checked: true,
    },
    {
        title: `Invoice Status`,
        dataIndex: 'invoiceStatus',
        key: 'invoiceStatus',
        align: 'center',
        width: 150,
        checked: true,
        render: (status) => {
            switch (status){
                case 'Pending':
                    return <Tag color="cyan">Pending</Tag>
                case 'Paid':
                    return <Tag color="success">Paid</Tag>
                case 'PartiallyPaid':
                    return <Tag color="processing">Partially Paid</Tag>
                case 'NotInvoiced':
                    return <Tag color="default">Not Invoiced</Tag>
            }
        }
    },
    {
        title: `Quantity`,
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Amount`,
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Organization`,
        dataIndex: 'organizationName',
        key: 'organizationName',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `EFS Account`,
        dataIndex: 'efsAccountName',
        key: 'efsAccountName',
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
        title: `Driver Name`,
        dataIndex: 'driverName',
        key: 'driverName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Unit Number`,
        dataIndex: 'unit',
        key: 'unit',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Invoice`,
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Location`,
        dataIndex: 'locationName',
        key: 'locationName',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: `City`,
        dataIndex: 'city',
        key: 'city',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `State`,
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Fees`,
        dataIndex: 'fees',
        key: 'fees',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Unit Price`,
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        align: 'center',
        width: 150,
        checked: true,
    },

    {
        title: `Discount PPU`,
        dataIndex: 'discPpu',
        key: 'discPpu',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Discount Cost`,
        dataIndex: 'discCost',
        key: 'discCost',
        align: 'center',
        width: 150,
        checked: true,
    },

    {
        title: `Discount Amount`,
        dataIndex: 'discAmount',
        key: 'discAmount',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Discount Type`,
        dataIndex: 'discType',
        key: 'discType',
        align: 'center',
        width: 150,
        checked: true,
    },

    {
        title: `DB`,
        dataIndex: 'db',
        key: 'db',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `Currency`,
        dataIndex: 'currency',
        key: 'currency',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Odometer`,
        dataIndex: 'odometer',
        key: 'odometer',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `File Name`,
        dataIndex: 'fileName',
        key: 'fileName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Notes`,
        dataIndex: 'note',
        key: 'note',
        align: 'center',
        width: 150,
        checked: true,
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
        dataIndex: 'createdUserName',
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
        dataIndex: 'updatedUserName',
        key: 'updatedUser',
        align: 'center',
        width: 150,
        checked: true,
    },
    // {
    //     title: `Operation`,
    //     key: 'operation',
    //     align: 'center',
    //     fixed: 'right',
    //     width: 100,
    //     checked: true,
    //     // render: (row) => {
    //     //     return (
    //     //       <div className="flex justify-end">
    //     //           {
    //     //             row?.suspiciousTransactionId &&
    //     //             <Popconfirm
    //     //               icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
    //     //               title={'Are you sure to detach original transaction?'}
    //     //               onConfirm={() => detachTransaction(row?.id)}
    //     //               okText="Yes"
    //     //               cancelText="No"
    //     //               className={'shadow-lg overflow-hidden'}
    //     //             >
    //     //                 <Tooltip title={'Detach Original Transaction'}>
    //     //                     <div className="icon">
    //     //                         <GrDetach />
    //     //                     </div>
    //     //                 </Tooltip>
    //     //             </Popconfirm>
    //     //           }
    //     //
    //     //           {
    //     //            row.suspiciousTransactionId === null &&
    //     //             <Tooltip title={'Attach Original Transaction'}>
    //     //                 <div className="icon"
    //     //                      onClick={() => openAttachTransactionModal(row?.id)}>
    //     //                     <GrAttachment />
    //     //                 </div>
    //     //             </Tooltip>
    //     //           }
    //     //
    //     //           {/*<Popconfirm*/}
    //     //           {/*  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}*/}
    //     //           {/*  title={'Are you sure to skip?'}*/}
    //     //           {/*  onConfirm={() => skipMoneyCode(row?.id)}*/}
    //     //           {/*  okText="Yes"*/}
    //     //           {/*  cancelText="No"*/}
    //     //           {/*  className={'shadow-lg overflow-hidden'}*/}
    //     //           {/*>*/}
    //     //           {/*    <Tooltip title={'Skip'}>*/}
    //     //           {/*        <div className="icon">*/}
    //     //           {/*            <IoIosSkipForward />*/}
    //     //           {/*        </div>*/}
    //     //           {/*    </Tooltip>*/}
    //     //           {/*</Popconfirm>*/}
    //     //       </div>
    //     //     );
    //     // },
    // },
]