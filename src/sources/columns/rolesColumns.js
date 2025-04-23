import { Popconfirm } from "antd"
import { BiSolidShow } from "react-icons/bi"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";

export const rolesColumns = (pageNumber, pageSize, tabType, openModal, deleteRole, deleteLoading) => [
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
        title: `Operations`,
        key: 'operations',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (row) => {
            return (
                <div className='flex justify-center'>
                    {
                        tabType === "system" ? (
                            <div className='icon' onClick={() => openModal(row?.id)}>
                                <BiSolidShow />
                            </div>
                        ) : (
                            <>
                                <Popconfirm
                                    isLoading={deleteLoading}
                                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                    title={'Are you sure to delete?'}
                                    onConfirm={() => deleteRole(row?.id)}
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
                            </>
                        )
                    }
                </div>
            )
        },
        checked: true,
    },
]