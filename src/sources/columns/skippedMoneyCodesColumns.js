import { setTashkentTime, setUTCTime } from "../../utils";
import React from 'react';
import { FaCircleLeft } from 'react-icons/fa6';
import { Button, Popconfirm, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { GrAttachment, GrDetach } from 'react-icons/gr';
import { Link } from 'react-router-dom';

export const skippedMoneyCodesColumns = (pageNumber, pageSize, showOperations, detachCompany, openOneTimeCompanyAttachModal, rollback, openCompanyDetailsModal) => [
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
        title: `Ref No`,
        dataIndex: 'refNo',
        key: 'refNo',
        type: 'string',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `Issued Company`,
        key: 'issuedToCompanyName',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => {
            return (
              <Button type='link' onClick={() => openCompanyDetailsModal && openCompanyDetailsModal(row?.issuedToCompanyId)} className='text-[blue]'>
                  {row?.issuedToCompanyName}
              </Button>
            )
        }
    },
    {
        title: `Issued To`,
        dataIndex: 'issuedTo',
        key: 'issuedTo',
        align: 'center',
        width: 300,
        checked: true,

    },
    {
        title: `Issued By`,
        dataIndex: 'issuedBy',
        key: 'issuedBy',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Issue Type`,
        dataIndex: 'issueType',
        key: 'issueType',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Issued Date`,
        dataIndex: 'issuedDate',
        key: 'issuedDate',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setUTCTime(date)
    },
    {
        title: `Date Used`,
        dataIndex: 'dateUsed',
        key: 'dateUsed',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setUTCTime(date)
    },
    {
        title: `Fee`,
        dataIndex: 'fee',
        key: 'fee',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `Original Amount`,
        dataIndex: 'originalAmount',
        key: 'originalAmount',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Bill Date`,
        dataIndex: 'billDate',
        key: 'billDate',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setUTCTime(date)
    },
    {
        title: `Check Number`,
        dataIndex: 'checkNumber',
        key: 'checkNumber',
        align: 'center',
        width: 150,
        checked: true,
    },

    {
        title: `Amount of Used`,
        dataIndex: 'amountOfUsed',
        key: 'amountOfUsed',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Currency`,
        dataIndex: 'currency',
        key: 'currency',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `One Time Use`,
        dataIndex: 'oneTimeUse',
        key: 'oneTimeUse',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Exact Amt`,
        dataIndex: 'exactAmt',
        key: 'exactAmt',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `Expire Date`,
        dataIndex: 'expireDate',
        key: 'expireDate',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setUTCTime(date)
    },
    {
        title: `Phone Number`,
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
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
        title: `City`,
        dataIndex: 'city',
        key: 'city',
        align: 'center',
        width: 150,
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
        title: `Contract ID`,
        dataIndex: 'contractId',
        key: 'contractId',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: `Sub Contract`,
        dataIndex: 'subContract',
        key: 'subContract',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: `Voide`,
        dataIndex: 'voide',
        key: 'voide',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `File Name`,
        dataIndex: 'fileName',
        key: 'fileName',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Notes`,
        dataIndex: 'notes',
        key: 'notes',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: `Attached Company`,
        key: 'attachedCompanyName',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => {
            return (
              <Button type='link' onClick={() => openCompanyDetailsModal && openCompanyDetailsModal(row?.attachedCompanyId)} className='text-[blue]'>
                  {row?.attachedCompanyName}
              </Button>
            )
        }
    },
    {
        title: `Attachment Type`,
        dataIndex: 'attachmentType',
        key: 'attachmentType',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Attached At`,
        dataIndex: 'companyAttachedDate',
        key: 'companyAttachedDate',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setTashkentTime(date)
    },
    {
        title: `Attached User`,
        dataIndex: 'companyAttachedUserName',
        key: 'companyAttachedUserName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Created User`,
        dataIndex: 'createdUserName',
        key: 'createdUserName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setTashkentTime(date)
    },
    {
        title: `Updated User`,
        dataIndex: 'updatedUserName',
        key: 'updatedUserName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Updated At`,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setTashkentTime(date)
    },

    showOperations && {
        title: `Operation`,
        key: 'operation',
        align: 'center',
        width: 150,
        checked: true,
        fixed: 'right',
        render: (row) => {
            return (
              <div className="flex justify-end">
                  {
                    row?.attachedCompanyId &&
                    <Popconfirm
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      title={'Are you sure to detach company?'}
                      onConfirm={() => detachCompany(row?.id)}
                      okText="Yes"
                      cancelText="No"
                      className={'shadow-lg overflow-hidden'}
                    >
                        <Tooltip title={'Detach Company'}>
                            <div className="icon">
                                <GrDetach />
                            </div>
                        </Tooltip>
                    </Popconfirm>
                  }
                  <Tooltip title={'Attach Company'}>
                      <div className="icon"
                           onClick={() => openOneTimeCompanyAttachModal(row?.id, row?.issuedTo, row?.attachedCompanyId, row?.attachedCompanyName, row?.attachmentType, row?.refNo)}>
                          <GrAttachment />
                      </div>
                  </Tooltip>
                  <Popconfirm
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    title={'Are you sure to rollback money code?'}
                    onConfirm={() => rollback(row?.id)}
                    okText="Yes"
                    cancelText="No"
                    className={'shadow-lg overflow-hidden'}
                  >
                      <Tooltip title={'Rollback'}>
                          <div className="icon">
                              <FaCircleLeft />
                          </div>
                      </Tooltip>
                  </Popconfirm>
              </div>
            )
        }
    },
]