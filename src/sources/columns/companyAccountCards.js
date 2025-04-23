import { setTashkentTime } from "../../utils"
import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";

export const companyAccountCardsColumns = (pageNumber, pageSize, deleteCompanyAccountCard, deleteLoading, openModal) => [
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
        dataIndex: 'companyAccount',
        key: 'organization',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => row?.organization?.name
    },
    {
        title: `EFS Account`,
        dataIndex: 'companyAccount',
        key: 'efsAccount',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => row?.efsAccount?.name
    },
    {
        title: `Company`,
        dataIndex: 'companyAccount',
        key: 'company',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => {
            return (
                <Link to={`/companies/company/${row?.company?.id}`} className="text-[blue]">{row?.company?.name}</Link>
            )
        }
    },
    {
        title: `Company Status`,
        dataIndex: 'companyAccount',
        key: 'companyStatus',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (row) => row?.company?.companyStatus
    },
    {
        title: `Card Number`,
        dataIndex: 'cardNumber',
        key: 'cardNumber',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Driver Name`,
        dataIndex: 'driverName',
        key: 'driverName',
        type: 'string',
        align: 'center',
        width: 250,
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
        title: `Card Status`,
        dataIndex: 'cardStatus',
        key: 'cardStatus',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date) : null}</>
    },
    {
        title: `Created User`,
        dataIndex: 'createdUser',
        key: 'createdUser',
        align: 'center',
        width: 200,
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
        dataIndex: 'updatedUser',
        key: 'updatedUser',
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
                        onConfirm={() => deleteCompanyAccountCard(row?.id)}
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