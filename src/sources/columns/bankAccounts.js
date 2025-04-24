import { setTashkentTime } from "../../utils"
import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

export const bankAccountsColumns = (pageNumber, pageSize, deleteBankAccount, deleteLoading, openModal, language = 'en') => [
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
        title: t(translations, 'bankAccountName', language),
        dataIndex: 'bankAccountName',
        key: 'bankAccountName',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: t(translations, 'bankAccountNumber', language),
        dataIndex: 'bankAccountNumber',
        key: 'bankAccountNumber',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: t(translations, 'routingNumber', language),
        dataIndex: 'routingNumber',
        key: 'routingNumber',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: t(translations, 'taxId', language),
        dataIndex: 'taxId',
        key: 'taxId',
        type: 'string',
        align: 'center',
        width: 200,
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
                        onConfirm={() => deleteBankAccount(row?.id)}
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