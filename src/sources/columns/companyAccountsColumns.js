import { setTashkentTime } from "../../utils"
import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";

export const companyAccountsColumns = (pageNumber, pageSize, deleteCompanyAccount, deleteLoading, openModal) => [
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
        title: `Organization`,
        dataIndex: 'organization',
        key: 'organization',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
        render: (row) => row?.name
    },
    {
        title: `EFS Account`,
        dataIndex: 'efsAccount',
        key: 'efsAccount',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
        render: (row) => row?.name
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
        title: `Billing Cycle`,
        dataIndex: 'billingCycle',
        key: 'billingCycle',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Company Status`,
        dataIndex: 'company',
        key: 'companyStatus',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (row) => row?.companyStatus
    },
    {
        title: `Fees Type`,
        dataIndex: 'feesType',
        key: 'feesType',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Discount`,
        dataIndex: 'discount',
        key: 'discount',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Pricing Model`,
        dataIndex: 'pricingModel',
        key: 'pricingModel',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Billing Type`,
        dataIndex: 'billingType',
        key: 'billingType',
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
        title: `Updated At`,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date) : null}</>
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
                        onConfirm={() => deleteCompanyAccount(row?.id)}
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