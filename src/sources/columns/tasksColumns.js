import { Popconfirm, Tag } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from "../../utils";

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

export const tasksColumns = (pageNumber, pageSize, deleteTask, deleteLoading, openModal, openStatusModal) => [
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
        title: `Task Number`,
        dataIndex: 'taskNumber',
        key: 'taskNumber',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Title`,
        dataIndex: 'title',
        key: 'title',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Description`,
        dataIndex: 'description',
        key: 'description',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: `Status`,
        key: 'status',
        type: 'string',
        align: 'center',
        render(row) {
            return (
                <Tag
                    color={setTagColor(row?.status)}
                    onClick={() => openStatusModal(row?.status, row?.id)}
                    style={{ cursor: 'pointer' }}
                    title="Change Status"
                >
                    {row?.status}
                </Tag>
            );
        },
        width: 200,
        checked: true,
    },
    {
        title: `Priority`,
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
        title: `Due Date`,
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
        title: `Assigned User`,
        dataIndex: 'assignedUserName',
        key: 'assignedUserName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Watchers`,
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
        title: `Completed Date`,
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
        title: `Completed User`,
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
        title: `Updated Date`,
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
        title: `Updated User`,
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
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        type: 'string',
        align: 'center',
        render: (date) => setTashkentTime(date),
        width: 250,
        checked: true,
    },
    {
        title: `Created By`,
        dataIndex: 'createdUserName',
        key: 'createdUserName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Cancelled Date`,
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
        title: `Cancelled User`,
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
        title: `Cancelled Reason`,
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
        title: `Operations`,
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
                        title={'Are you sure to delete?'}
                        onConfirm={() => deleteTask(row?.id)}
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
                </div>
            )
        },
        checked: true,
    },
]