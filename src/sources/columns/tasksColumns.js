import { Popconfirm, Tag } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from "../../utils";
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

const setTagColor = (type) => {
    switch (type) {
        case 'Open':
            return '';
        case 'InProgress':
            return 'blue';
        case 'Completed':
            return 'green';
        case 'Cancelled':
            return 'red';
        case 'Deferred':
            return 'orange';
        case 'Low':
            return 'green';
        case 'Medium':
            return 'orange';
        case 'High':
            return 'red';
        default:
            return 0;
    }
}

export const tasksColumns = (pageNumber, pageSize, deleteTask, deleteLoading, openModal, openStatusModal, language = 'en') => [
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
        title: t(translations, 'taskNumber', language),
        dataIndex: 'taskNumber',
        key: 'taskNumber',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'title', language),
        dataIndex: 'title',
        key: 'title',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'description', language),
        dataIndex: 'description',
        key: 'description',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: t(translations, 'status', language),
        key: 'status',
        type: 'string',
        align: 'center',
        render(row) {
            return (
                <Tag
                    color={setTagColor(row?.status)}
                    onClick={() => openStatusModal(row?.status, row?.id)}
                    style={{ cursor: 'pointer' }}
                    title={t(translations, 'changeStatus', language)}
                >
                    {row?.status}
                </Tag>
            );
        },
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'priority', language),
        dataIndex: 'priority',
        key: 'priority',
        type: 'string',
        align: 'center',
        render(priority) {
            return (
                <Tag color={setTagColor(priority)}>{priority}</Tag>
            );
        },
        width: 100,
        checked: true,
    },
    {
        title: t(translations, 'dueDate', language),
        key: 'dueDate',
        type: 'string',
        align: 'center',
        render: (row) => {
            return <span style={{ color: row?.isTaskOverdue ? 'red' : '' }}>{setTashkentTime(row?.dueDate)}</span>
        },
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'assignedUser', language),
        dataIndex: 'assignedUserName',
        key: 'assignedUserName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'watchers', language),
        dataIndex: 'watchers',
        key: 'watchers',
        type: 'string',
        align: 'center',
        width: 250,
        render: (row) => {
            return (
                <>
                    {row?.map((item, index) => {
                        return <div key={index}>{item?.userName}</div>
                    })}
                </>
            );
        },
        checked: true,
    },
    {
        title: t(translations, 'completedDate', language),
        dataIndex: 'completedDate',
        key: 'completedDate',
        type: 'string',
        align: 'center',
        render: (completedDate) => {
            return <span>{completedDate ? setTashkentTime(completedDate) : null}</span>
        },
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'completedUser', language),
        dataIndex: 'completedUserName',
        key: 'completedUserName',
        type: 'string',
        align: 'center',
        render: (completedUserName) => {
            return <div>{completedUserName ? completedUserName : null}</div>
        },
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'updatedDate', language),
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        type: 'string',
        align: 'center',
        render: (updatedAt) => {
            return <span>{updatedAt ? setTashkentTime(updatedAt) : null}</span>
        },
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'updatedUser', language),
        dataIndex: 'updatedUserName',
        key: 'updatedUserName',
        type: 'string',
        align: 'center',
        render: (updatedUserName) => {
            return <div>{updatedUserName ? updatedUserName : null}</div>
        },
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'createdAt', language),
        dataIndex: 'createdAt',
        key: 'createdAt',
        type: 'string',
        align: 'center',
        render: (date) => setTashkentTime(date),
        width: 250,
        checked: true,
    },
    {
        title: t(translations, 'createdBy', language),
        dataIndex: 'createdUserName',
        key: 'createdUserName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'cancelledDate', language),
        dataIndex: 'cancelledAt',
        key: 'cancelledAt',
        type: 'string',
        align: 'center',
        render: (cancelledAt) => {
            return <span>{cancelledAt ? setTashkentTime(cancelledAt) : null}</span>
        },
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'cancelledUser', language),
        dataIndex: 'cancelledUserName',
        key: 'cancelledUserName',
        type: 'string',
        align: 'center',
        render: (cancelledUserName) => {
            return <div>{cancelledUserName ? cancelledUserName : null}</div>
        },
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'cancelledReason', language),
        dataIndex: 'cancelledReason',
        key: 'cancelledReason',
        type: 'string',
        align: 'center',
        render: (cancelledReason) => {
            return <div>{cancelledReason ? cancelledReason : null}</div>
        },
        width: 300,
        checked: true,
    },
    {
        title: t(translations, 'operations', language),
        key: 'operations',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (row) => {
            return (
                <div className='flex justify-center'>
                    <Popconfirm
                        isLoading={deleteLoading}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        title={t(translations, 'areYouSureToDelete', language)}
                        onConfirm={() => deleteTask(row?.id)}
                        okText={t(translations, 'yes', language)}
                        cancelText={t(translations, 'no', language)}
                        className={'shadow-lg overflow-hidden'}
                    >
                        <div className='icon'>
                            <MdOutlineDelete />
                        </div>
                    </Popconfirm>
                    <div className='icon' onClick={() => openModal(row?.id)}>
                        <MdEdit />
                    </div>
                </div>
            )
        },
        checked: true,
    },
]