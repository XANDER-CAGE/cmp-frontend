import { Link } from "react-router-dom"
import { setTashkentTime } from "../../utils"
import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";

export const companiesColumns = (pageNumber, pageSize, deleteCompany, deleteLoading, openModal) => [
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
        key: 'name',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
        render: (row) => {
            return (
                <div className='flex align-center'>
                    {
                        row?.bankAccountsCount &&
                            row?.bankCardsCount &&
                            row?.companyAccountsCount &&
                            row?.companyAccountCardsCount ? null : (
                            <div className='w-[10px] h-[10px] bg-[red] rounded-full mr-2 mt-1'></div>
                        )
                    }
                    <Link to={`company/${row?.id}`} className='text-[blue]'>
                        {row?.name}
                    </Link>
                </div>
            )
        }
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        type: 'string',
        width: 200,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>,
    },
    {
        title: `Agent`,
        dataIndex: ['agent', 'name'],
        key: 'agent',
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
        title: `Address`,
        dataIndex: 'address',
        key: 'address',
        type: 'string',
        align: 'center',
        width: 300,
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
        dataIndex: 'phoneNumbers',
        key: 'phoneNumbers',
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
        title: `Owner Names`,
        dataIndex: 'ownerNames',
        key: 'ownerNames',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (owners) => {
            return (
                <>
                    {
                        owners?.map((owner, index) => {
                            return <div key={index}>{owner}</div>
                        })
                    }
                </>
            )
        }
    },
    {
        title: `Is Trusted`,
        dataIndex: 'isTrusted',
        key: 'isTrusted',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (isTrusted) => {
            if (isTrusted === true) return <>Yes</>
            else if (isTrusted === false) return <>No</>
            else return <></>
        }
    },
    {
        title: `Untrusted Reason`,
        dataIndex: 'untrustedReason',
        key: 'untrustedReason',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Updated User`,
        dataIndex: 'updatedUser',
        key: 'updatedUser',
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
        render: (updatedAt) => <>{updatedAt ? setTashkentTime(updatedAt) : null}</>
    },
    {
        title: `Website`,
        dataIndex: 'website',
        key: 'website',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Credit Score`,
        dataIndex: 'creditScore',
        key: 'creditScore',
        type: 'string',
        align: 'center',
        width: 200,
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
        title: `Status`,
        dataIndex: 'companyStatus',
        key: 'companyStatus',
        type: 'string',
        align: 'center',
        width: 150,
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
                        onConfirm={() => deleteCompany(row?.id)}
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