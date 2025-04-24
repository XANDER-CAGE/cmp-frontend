import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from "../../utils";
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

export const companyDiscountsColumns = (pageNumber, pageSize, deleteCompanyDiscount, deleteLoading, openModal, language = 'en') => [
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
        title: t(translations, 'modifiedAt', language),
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>
    },
    {
        title: t(translations, 'discount', language),
        dataIndex: 'discount',
        key: 'discount',
        type: 'string',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: t(translations, 'performer', language),
        dataIndex: ['user', 'name'],
        key: 'performer',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'department', language),
        dataIndex: ['modifiedUser', 'department'],
        key: 'department',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'companiesCount', language),
        dataIndex: 'companiesCount',
        key: 'companiesCount',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'fromDate', language),
        dataIndex: 'fromDate',
        key: 'fromDate',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'toDate', language),
        dataIndex: 'toDate',
        key: 'toDate',
        type: 'string',
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
                        title={(
                            <>
                                {t(translations, 'lineContainsInvoice', language)}
                                <br />
                                {t(translations, 'confirmAction', language)}
                            </>
                        )}
                        onConfirm={() => deleteCompanyDiscount(row)}
                        okText={t(translations, 'yes', language)}
                        cancelText={t(translations, 'no', language)}
                        className={'shadow-lg overflow-hidden'}
                    >
                        <div className='icon'>
                            <MdOutlineDelete />
                        </div>
                    </Popconfirm>
                    <div className='icon' onClick={() => openModal(row)}>
                        <MdEdit />
                    </div>
                </div>
            )
        },
        checked: true,
    },
]