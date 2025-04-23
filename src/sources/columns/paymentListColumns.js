import { setTashkentTime } from "../../utils"
import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdOutlineDelete } from "react-icons/md";

export const paymentListColumns = (pageNumber, pageSize, deletePayment, deleteLoading) => [
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
        title: `Amount`,
        dataIndex: 'amount',
        key: 'amount',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Payment Date`,
        dataIndex: 'paymentDate',
        key: 'paymentDate',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date) : null} </>
    },
    {
        title: `Notes`,
        dataIndex: 'notes',
        key: 'notes',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date) : null} </>
    },
    {
        title: `Created User`,
        dataIndex: ['createdUser', 'username'],
        key: 'createdUser',
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
                    <Popconfirm
                        isLoading={deleteLoading}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        title={'Are you sure to delete?'}
                        onConfirm={() => deletePayment(row?.id)}
                        okText="Yes"
                        cancelText="No"
                        className={'shadow-lg overflow-hidden'}
                    >
                        <div className='icon'>
                            <MdOutlineDelete />
                        </div>
                    </Popconfirm>
                </div>
            )
        },
        checked: true,
    },
]