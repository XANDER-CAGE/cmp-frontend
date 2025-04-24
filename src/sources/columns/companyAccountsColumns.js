import { setTashkentTime } from "../../utils"
import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

export const companyAccountsColumns = (pageNumber, pageSize, deleteCompanyAccount, deleteLoading, openModal, language = 'en') => [
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
        dataIndex: 'organization',
        key: 'organization',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
        render: (row) => row?.name
    },
    {
        title: t(translations, 'efsAccount', language),
        dataIndex: 'efsAccount',
        key: 'efsAccount',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
        render: (row) => row?.name
    },
    {
        title: t(translations, 'company', language),
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
        title: t(translations, 'billingCycle', language),
        dataIndex: 'billingCycle',
        key: 'billingCycle',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'companyStatus', language),
        dataIndex: 'company',
        key: 'companyStatus',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (row) => {
            const status = row?.companyStatus;
            if (status === 'Active') return t(translations, 'statusActive', language);
            if (status === 'Inactive') return t(translations, 'statusInactive', language);
            return status;
        }
    },
    {
        title: t(translations, 'feesType', language),
        dataIndex: 'feesType',
        key: 'feesType',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'discount', language),
        dataIndex: 'discount',
        key: 'discount',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'pricingModel', language),
        dataIndex: 'pricingModel',
        key: 'pricingModel',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: t(translations, 'billingType', language),
        dataIndex: 'billingType',
        key: 'billingType',
        type: 'string',
        align: 'center',
        width: 150,
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
        title: t(translations, 'createdAt', language),
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>
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
                        onConfirm={() => deleteCompanyAccount(row?.id)}
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