import { Popconfirm, Tooltip } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { GrAttachment, GrDetach } from 'react-icons/gr';

export const attachedCompaniesColumns = (pageNumber, pageSize, openCompanyAttachModal, detachAll) => [
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
        title: `Issued To`,
        dataIndex: 'issuedTo',
        key: 'issuedTo',
        type: 'string',
        align: 'left',
        checked: true,
    },
    {
        title: `Attached Company`,
        dataIndex: 'attachedCompanyName',
        key: 'attachedCompanyName',
        type: 'string',
        checked: true,
    },
    {
        title: `Attachment Type`,
        dataIndex: 'attachmentType',
        key: 'attachmentType',
        type: 'string',
        checked: true,
    },
    {
        title: `Operation`,
        key: 'operation',
        align: 'center',
        render: (row) => {
            if (row?.isEditable && row.attachmentType === 'Always') {
                return (
                    <div className='flex justify-center'>
                        <Popconfirm
                          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                          title={'Are you sure to unplug company?'}
                          onConfirm={() => detachAll(row?.issuedTo, row?.attachedCompanyId, row?.attachmentType)}
                          okText="Yes"
                          cancelText="No"
                          className={'shadow-lg overflow-hidden'}
                        >
                            <Tooltip title={'Detach All'}>
                                <div className="icon">
                                    <GrDetach />
                                </div>
                            </Tooltip>
                        </Popconfirm>
                        <Tooltip title={'Attach Company for All'}>
                            <div className="icon"
                                 onClick={() =>
                                   openCompanyAttachModal(
                                     row?.issuedTo,
                                     row?.attachedCompanyId,
                                     row?.attachedCompanyName,
                                     row?.attachmentType)}>
                                <GrAttachment />
                            </div>
                        </Tooltip>
                    </div>
                )
            } else {
                return null
            }
        },
        fixed: 'right',
        width: 100,
        checked: true,
    },
]