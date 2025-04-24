import { setTashkentTime, setUTCTime } from '../../utils';
import { Button, Tag } from 'antd';
import React from 'react';
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

export const suspiciousTransactionsColumns = (pageNumber, pageSize, openCompanyDetailsModal, language = 'en') => [
    {
        title: `#`,
        key: 'numberOfRow',
        fixed: 'left',
        align: 'center',
        width: 92,
        render: (text, obj, index) => {
            return (
                <span> {(pageNumber - 1) * pageSize + index + 1} </span>
            )
        },
        checked: true,
    },
    {
        title: t(translations, 'transactionDate', language),
        dataIndex: ['transaction', 'transactionDate'],
        key: 'transactionDate',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (transactionDate) => setUTCTime(transactionDate, 'YYYY-MM-DD')
    },
    {
        title: t(translations, 'cardNumber', language),
        dataIndex: ['transaction','cardNumber'],
        key: 'cardNumber',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'type', language),
        dataIndex: 'type',
        key: 'status',
        align: 'center',
        width: 150,
        checked: true,
        render: (status) => {
            switch (status){
                case 'New':
                    return <Tag color="cyan">{t(translations, 'new', language)}</Tag>
                case 'Resolved':
                    return <Tag color="success">{t(translations, 'resolved', language)}</Tag>
                case 'InProgress':
                    return <Tag color="processing">{t(translations, 'inProgress', language)}</Tag>
                default:
                    return <Tag color="default">{status}</Tag>
            }
        }
    },
    {
        title: t(translations, 'invoiceNumber', language),
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        align: 'left',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'invoiceStatus', language),
        dataIndex: 'invoiceStatus',
        key: 'invoiceStatus',
        align: 'center',
        width: 150,
        checked: true,
        render: (status) => {
            switch (status){
                case 'Pending':
                    return <Tag color="cyan">{t(translations, 'pending', language)}</Tag>
                case 'Paid':
                    return <Tag color="success">{t(translations, 'paid', language)}</Tag>
                case 'PartiallyPaid':
                    return <Tag color="processing">{t(translations, 'partiallyPaid', language)}</Tag>
                case 'NotInvoiced':
                    return <Tag color="default">{t(translations, 'notInvoiced', language)}</Tag>
            }
        }
    },
    {
        title: t(translations, 'quantity', language),
        dataIndex: ['transaction','quantity'],
        key: 'quantity',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'amount', language),
        dataIndex: ['transaction','amount'],
        key: 'amount',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'organizationName', language),
        dataIndex: 'organizationName',
        key: 'organizationName',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: t(translations, 'efsAccountName', language),
        dataIndex: 'efsAccountName',
        key: 'efsAccountName',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: t(translations, 'companyName', language),
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
        title: t(translations, 'driverName', language),
        dataIndex: ['transaction','driverName'],
        key: 'driverName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'unitNumber', language),
        dataIndex: ['transaction','unit'],
        key: 'unit',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'invoiceNumber', language),
        dataIndex: ['transaction','invoiceNumber'],
        key: 'invoiceNumber',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'locationName', language),
        dataIndex: ['transaction','locationName'],
        key: 'locationName',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: t(translations, 'city', language),
        dataIndex: ['transaction','city'],
        key: 'city',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'state', language),
        dataIndex: ['transaction','state'],
        key: 'state',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'fees', language),
        dataIndex: ['transaction','fees'],
        key: 'fees',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'unitPrice', language),
        dataIndex: ['transaction','unitPrice'],
        key: 'unitPrice',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'discPpu', language),
        dataIndex: ['transaction','discPpu'],
        key: 'discPpu',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'discCost', language),
        dataIndex: ['transaction','discCost'],
        key: 'discCost',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'discAmount', language),
        dataIndex: ['transaction','discAmount'],
        key: 'discAmount',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'discType', language),
        dataIndex: ['transaction','discType'],
        key: 'discType',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'db', language),
        dataIndex: ['transaction','db'],
        key: 'db',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: t(translations, 'currency', language),
        dataIndex: ['transaction','currency'],
        key: 'currency',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'odometer', language),
        dataIndex: ['transaction','odometer'],
        key: 'odometer',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'fileName', language),
        dataIndex: ['transaction','fileName'],
        key: 'fileName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'notes', language),
        dataIndex: 'note',
        key: 'note',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'createdAt', language),
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>
    },
    {
        title: t(translations, 'createdUser', language),
        dataIndex: 'createdUserName',
        key: 'createdUser',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'updatedDate', language),
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date) : null}</>
    },
    {
        title: t(translations, 'updatedUser', language),
        dataIndex: 'updatedUserName',
        key: 'updatedUser',
        align: 'center',
        width: 150,
        checked: true,
    },
    // {
    //     title: t(translations, 'operation', language),
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
    //     //               title={t(translations, 'areYouSureToDetachOriginalTransaction', language)}
    //     //               onConfirm={() => detachTransaction(row?.id)}
    //     //               okText={t(translations, 'yes', language)}
    //     //               cancelText={t(translations, 'no', language)}
    //     //               className={'shadow-lg overflow-hidden'}
    //     //             >
    //     //                 <Tooltip title={t(translations, 'detachOriginalTransaction', language)}>
    //     //                     <div className="icon">
    //     //                         <GrDetach />
    //     //                     </div>
    //     //                 </Tooltip>
    //     //             </Popconfirm>
    //     //           }
    //     //
    //     //           {
    //     //            row.suspiciousTransactionId === null &&
    //     //             <Tooltip title={t(translations, 'attachOriginalTransaction', language)}>
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