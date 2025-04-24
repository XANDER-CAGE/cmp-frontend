import { setTashkentTime, setUTCTime } from "../../utils";
import { Popconfirm, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { GrAttachment } from 'react-icons/gr';
import { IoIosSkipForward } from 'react-icons/io';
import React from 'react';
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

export const uncheckedMoneyCodesColumns = (pageNumber, pageSize, showOperations, skipMoneyCode, openCompanyAttachModal, language = 'en') => [
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
        title: t(translations, 'refNo', language),
        dataIndex: 'refNo',
        key: 'refNo',
        type: 'string',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: t(translations, 'voide', language),
        dataIndex: 'voide',
        key: 'voide',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: t(translations, 'issueType', language),
        dataIndex: 'issueType',
        key: 'issueType',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'issuedBy', language),
        dataIndex: 'issuedBy',
        key: 'issuedBy',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'issuedTo', language),
        dataIndex: 'issuedTo',
        key: 'issuedTo',
        align: 'center',
        width: 300,
        checked: true,

    },
    {
        title: t(translations, 'issuedDate', language),
        dataIndex: 'issuedDate',
        key: 'issuedDate',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setUTCTime(date)
    },
    {
        title: t(translations, 'fee', language),
        dataIndex: 'fee',
        key: 'fee',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: t(translations, 'originalAmount', language),
        dataIndex: 'originalAmount',
        key: 'originalAmount',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'billDate', language),
        dataIndex: 'billDate',
        key: 'billDate',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setUTCTime(date)
    },
    {
        title: t(translations, 'checkNumber', language),
        dataIndex: 'checkNumber',
        key: 'checkNumber',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'dateUsed', language),
        dataIndex: 'dateUsed',
        key: 'dateUsed',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setUTCTime(date)
    },
    {
        title: t(translations, 'amountOfUsed', language),
        dataIndex: 'amountOfUsed',
        key: 'amountOfUsed',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'currency', language),
        dataIndex: 'currency',
        key: 'currency',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: t(translations, 'oneTimeUse', language),
        dataIndex: 'oneTimeUse',
        key: 'oneTimeUse',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'exactAmt', language),
        dataIndex: 'exactAmt',
        key: 'exactAmt',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: t(translations, 'expireDate', language),
        dataIndex: 'expireDate',
        key: 'expireDate',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setUTCTime(date)
    },
    {
        title: t(translations, 'phoneNumber', language),
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'state', language),
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'city', language),
        dataIndex: 'city',
        key: 'city',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'locationName', language),
        dataIndex: 'locationName',
        key: 'locationName',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: t(translations, 'contractId', language),
        dataIndex: 'contractId',
        key: 'contractId',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: t(translations, 'subContract', language),
        dataIndex: 'subContract',
        key: 'subContract',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: t(translations, 'fileName', language),
        dataIndex: 'fileName',
        key: 'fileName',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'notes', language),
        dataIndex: 'notes',
        key: 'notes',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: t(translations, 'createdUser', language),
        dataIndex: 'createdUser',
        key: 'createdUser',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'createdAt', language),
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => setTashkentTime(date)
    },

    showOperations && {
        title: t(translations, 'operation', language),
        key: 'operation',
        align: 'center',
        fixed: 'right',
        width: 150,
        checked: true,
        render: (row) => {
            return (
              <div className="flex justify-end">
                  <Tooltip title={t(translations, 'attachCompany', language)}>
                      <div className="icon"
                           onClick={() => openCompanyAttachModal(row?.id, row?.issuedTo, row?.attachedCompanyId, row?.attachedCompanyName, row?.attachmentType, row?.refNo)}>
                          <GrAttachment />
                      </div>
                  </Tooltip>
                  <Popconfirm
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    title={t(translations, 'areYouSureToSkip', language)}
                    onConfirm={() => skipMoneyCode(row?.id)}
                    okText={t(translations, 'yes', language)}
                    cancelText={t(translations, 'no', language)}
                    className={'shadow-lg overflow-hidden'}
                  >
                      <Tooltip title={t(translations, 'skip', language)}>
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