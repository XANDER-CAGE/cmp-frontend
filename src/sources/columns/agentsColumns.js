import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from "../../utils";
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

export const agentsColumns = (pageNumber, pageSize, deleteAgent, deleteLoading, openModal, language = 'en') => [
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
        dataIndex: 'name',
        key: 'name',
        type: 'string',
        align: 'center',
        width: 200,
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
        dataIndex: 'phones',
        key: 'phones',
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
        title: t(translations, 'address', language),
        dataIndex: 'address',
        key: 'address',
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
                        onConfirm={() => deleteAgent(row?.id)}
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