import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from "../../utils";

export const merchantFeeColumns = (pageNumber, pageSize, deleteMerchantFee, deleteLoading, openModal) => [
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
        title: `Fee Percentage`,
        dataIndex: 'feePercentage',
        key: 'feePercentage',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Organization Name`,
        dataIndex: 'organizationName',
        key: 'organizationName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Created User`,
        dataIndex: 'createdUserName',
        key: 'createdUserName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>
    },
    {
        title: `Updated User`,
        dataIndex: 'updatedUserName',
        key: 'updatedUserName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Updated At`,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        type: 'string',
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
                        onConfirm={() => deleteMerchantFee(row?.id)}
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