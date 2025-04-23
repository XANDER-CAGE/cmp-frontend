import { setTashkentTime } from "../../utils"
import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";

export const bankAccountsColumns = (pageNumber, pageSize, deleteBankAccount, deleteLoading, openModal) => [
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
        title: `Company`,
        dataIndex: 'company',
        key: 'company',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
        render: (row) => {
            return (
                <Link to={`/companies/company/${row?.id}`} className="text-[blue]">{row?.name}</Link>
            )
        }
    },
    {
        title: `Bank Account Name`,
        dataIndex: 'bankAccountName',
        key: 'bankAccountName',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: `Bank Account Number`,
        dataIndex: 'bankAccountNumber',
        key: 'bankAccountNumber',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: `Routing Number`,
        dataIndex: 'routingNumber',
        key: 'routingNumber',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Tax Id`,
        dataIndex: 'taxId',
        key: 'taxId',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Unit Number`,
        dataIndex: 'unitNumber',
        key: 'unitNumber',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
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
                        onConfirm={() => deleteBankAccount(row?.id)}
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