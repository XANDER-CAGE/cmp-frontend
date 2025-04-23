import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from "../../utils";

export const emailTemplatesColumns = (pageNumber, pageSize, deleteEmailTemplate, deleteLoading, openModal) => [
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
        title: `Name`,
        dataIndex: 'name',
        key: 'name',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Subject`,
        dataIndex: 'subject',
        key: 'subject',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: `Scheduled Date`,
        dataIndex: 'scheduleDate',
        key: 'scheduleDate',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date, 'YYYY-MM-DD') : null}</>
    },
    {
        title: `Organization`,
        dataIndex: 'organizations',
        key: 'organizations',
        align: 'center',
        width: 300,
        checked: true,
        render: (organizations) => {
            return (
                <>
                    {
                        organizations?.map((organization, index) => {
                            return <div key={index}>{organization?.name}</div>
                        })
                    }
                </>
            )
        }
    },
    {
        title: `Is Active`,
        dataIndex: 'isActive',
        key: 'isActive',
        align: 'center',
        width: 100,
        checked: true,
        render: (row) => <>{row ? "Yes" : "No"}</>
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>
    },
    {
        title: `Created User`,
        dataIndex: 'createdUserName',
        key: 'createdUserName',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Updated At`,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date) : null}</>
    },
    {
        title: `Updated User`,
        dataIndex: 'updatedUserName',
        key: 'updatedUserName',
        align: 'center',
        width: 250,
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
                        onConfirm={() => deleteEmailTemplate(row?.id)}
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