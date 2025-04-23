import { Popconfirm, Tooltip } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { GrAttachment } from "react-icons/gr"
import { IoIosSkipForward } from "react-icons/io"

export const missingCompaniesColumns = (pageNumber, pageSize, openModal, skipAllByIssuedTo) => [
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
        render: (row) => row
    },
    {
        title: `Operation`,
        key: 'operation',
        align: 'center',
        render: (row) => {
            return (
                <div className='flex justify-center'>
                    <Tooltip title={'Attach Company for All'}>
                        <div className="icon" onClick={() => openModal(row?.issuedTo)}>
                            <GrAttachment />
                        </div>
                    </Tooltip>
                    <Popconfirm
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        title={'Are you sure to skip all?'}
                        onConfirm={() => skipAllByIssuedTo(row?.issuedTo)}
                        okText="Yes"
                        cancelText="No"
                        className={'shadow-lg overflow-hidden'}
                    >
                        <Tooltip title={'Skip All'}>
                            <div className="icon">
                                <IoIosSkipForward />
                            </div>
                        </Tooltip>
                    </Popconfirm>
                </div>
            )
        },
        fixed: 'right',
        width: 100,
        checked: true,
    },
]