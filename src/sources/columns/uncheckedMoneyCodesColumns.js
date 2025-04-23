import { setTashkentTime, setUTCTime } from "../../utils";
import { Popconfirm, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { GrAttachment } from 'react-icons/gr';
import { IoIosSkipForward } from 'react-icons/io';
import React from 'react';

export const uncheckedMoneyCodesColumns = (pageNumber, pageSize, showOperations, skipMoneyCode, openCompanyAttachModal) => [
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
        title: `Voide`,
        dataIndex: 'voide',
        key: 'voide',
        align: 'center',
        width: 100,
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
        title: `Issued By`,
        dataIndex: 'issuedBy',
        key: 'issuedBy',
        align: 'center',
        width: 150,
        checked: true,
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
        title: `Issued Date`,
        dataIndex: 'issuedDate',
        key: 'issuedDate',
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
        title: `Date Used`,
        dataIndex: 'dateUsed',
        key: 'dateUsed',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setUTCTime(date)
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
        title: `Created User`,
        dataIndex: 'createdUser',
        key: 'createdUser',
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

    showOperations && {
        title: `Operation`,
        key: 'operation',
        align: 'center',
        fixed: 'right',
        width: 150,
        checked: true,
        render: (row) => {
            return (
              <div className="flex justify-end">
                  <Tooltip title={'Attach Company'}>
                      <div className="icon"
                           onClick={() => openCompanyAttachModal(row?.id, row?.issuedTo, row?.attachedCompanyId, row?.attachedCompanyName, row?.attachmentType, row?.refNo)}>
                          <GrAttachment />
                      </div>
                  </Tooltip>
                  <Popconfirm
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    title={'Are you sure to skip?'}
                    onConfirm={() => skipMoneyCode(row?.id)}
                    okText="Yes"
                    cancelText="No"
                    className={'shadow-lg overflow-hidden'}
                  >
                      <Tooltip title={'Skip'}>
                          <div className="icon">
                              <IoIosSkipForward />
                          </div>
                      </Tooltip>
                  </Popconfirm>
              </div>
            );
        },
    },
]