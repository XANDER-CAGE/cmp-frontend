import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from "../../utils";

export const organizationsColumns = (pageNumber, pageSize, deleteOrganization, deleteLoading, openModal) => [
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
        title: `Description`,
        dataIndex: 'description',
        key: 'description',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Emails`,
        dataIndex: 'emails',
        key: 'emails',
        align: 'center',
        width: 300,
        checked: true,
        render: (emails) => {
            return (
                <>
                    {
                        emails?.map((email, index) => {
                            return <div key={index}>{email}</div>
                        })
                    }
                </>
            )
        }
    },
    {
        title: `Phones`,
        dataIndex: 'phones',
        key: 'phones',
        align: 'center',
        width: 200,
        checked: true,
        render: (phones) => {
            return (
                <>
                    {
                        phones?.map((phone, index) => {
                            return <div key={index}>{phone}</div>
                        })
                    }
                </>
            )
        }
    },
    {
        title: `Address`,
        dataIndex: 'address',
        key: 'address',
        align: 'center',
        width: 300,
        checked: true,
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
                        onConfirm={() => deleteOrganization(row?.id)}
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