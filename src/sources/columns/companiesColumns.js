import { Link } from "react-router-dom"
import { setTashkentTime } from "../../utils"
import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

export const companiesColumns = (pageNumber, pageSize, deleteCompany, deleteLoading, openModal, language = 'en') => [
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
        title: t(translations, 'name', language),
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
        title: t(translations, 'createdAt', language),
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        type: 'string',
        width: 200,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>,
    },
    {
        title: t(translations, 'agent', language),
        dataIndex: ['agent', 'name'],
        key: 'agent',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'description', language),
        dataIndex: 'description',
        key: 'description',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: t(translations, 'address', language),
        dataIndex: 'address',
        key: 'address',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: t(translations, 'emails', language),
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
        title: t(translations, 'phones', language),
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
        title: t(translations, 'ownerNames', language),
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
        title: t(translations, 'isTrusted', language),
        dataIndex: 'isTrusted',
        key: 'isTrusted',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (isTrusted) => {
            if (isTrusted === true) return <>{t(translations, 'yes', language)}</>
            else if (isTrusted === false) return <>{t(translations, 'no', language)}</>
            else return <></>
        }
    },
    {
        title: t(translations, 'untrustedReason', language),
        dataIndex: 'untrustedReason',
        key: 'untrustedReason',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'updatedUser', language),
        dataIndex: 'updatedUser',
        key: 'updatedUser',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'updatedAt', language),
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (updatedAt) => <>{updatedAt ? setTashkentTime(updatedAt) : null}</>
    },
    {
        title: t(translations, 'website', language),
        dataIndex: 'website',
        key: 'website',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'creditScore', language),
        dataIndex: 'creditScore',
        key: 'creditScore',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'notes', language),
        dataIndex: 'notes',
        key: 'notes',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: t(translations, 'status', language),
        dataIndex: 'companyStatus',
        key: 'companyStatus',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (status) => {
            if (status === 'Active') return t(translations, 'statusActive', language);
            if (status === 'Inactive') return t(translations, 'statusInactive', language);
            return status;
        }
    },
    {
        title: t(translations, 'operations', language),
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
                        title={t(translations, 'areYouSureToDelete', language)}
                        onConfirm={() => deleteCompany(row?.id)}
                        okText={t(translations, 'yes', language)}
                        cancelText={t(translations, 'no', language)}
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