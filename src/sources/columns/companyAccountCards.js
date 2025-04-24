import { setTashkentTime } from "../../utils"
import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

export const companyAccountCardsColumns = (pageNumber, pageSize, deleteCompanyAccountCard, deleteLoading, openModal, language = 'en') => [
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
        title: t(translations, 'organization', language),
        dataIndex: 'companyAccount',
        key: 'organization',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => row?.organization?.name
    },
    {
        title: t(translations, 'efsAccount', language),
        dataIndex: 'companyAccount',
        key: 'efsAccount',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => row?.efsAccount?.name
    },
    {
        title: t(translations, 'company', language),
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
        title: t(translations, 'companyStatus', language),
        dataIndex: 'companyAccount',
        key: 'companyStatus',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (row) => {
            const status = row?.company?.companyStatus;
            if (status === 'Active') return t(translations, 'statusActive', language);
            if (status === 'Inactive') return t(translations, 'statusInactive', language);
            return status;
        }
    },
    {
        title: t(translations, 'cardNumber', language),
        dataIndex: 'cardNumber',
        key: 'cardNumber',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: t(translations, 'driverName', language),
        dataIndex: 'driverName',
        key: 'driverName',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: t(translations, 'unitNumber', language),
        dataIndex: 'unitNumber',
        key: 'unitNumber',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'cardStatus', language),
        dataIndex: 'cardStatus',
        key: 'cardStatus',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (status) => {
            if (status === 'Active') return t(translations, 'statusActive', language);
            if (status === 'Inactive') return t(translations, 'statusInactive', language);
            if (status === 'Hold') return t(translations, 'statusHold', language);
            if (status === 'Deleted') return t(translations, 'statusDeleted', language);
            return status;
        }
    },
    {
        title: t(translations, 'createdAt', language),
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date) : null}</>
    },
    {
        title: t(translations, 'createdUser', language),
        dataIndex: 'createdUser',
        key: 'createdUser',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'updatedAt', language),
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date) : null}</>
    },
    {
        title: t(translations, 'updatedUser', language),
        dataIndex: 'updatedUser',
        key: 'updatedUser',
        align: 'center',
        width: 200,
        checked: true,
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
                        onConfirm={() => deleteCompanyAccountCard(row?.id)}
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