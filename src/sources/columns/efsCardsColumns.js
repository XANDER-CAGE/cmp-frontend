import { setTashkentTime } from "../../utils"
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

export const efsCardsColumns = (pageNumber, pageSize, language = 'en') => [
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
        title: t(translations, 'accountName', language),
        dataIndex: 'accountName',
        key: 'accountName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'cardNumber', language),
        dataIndex: 'cardNumber',
        key: 'cardNumber',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'cardStatus', language),
        dataIndex: 'cardStatus',
        key: 'cardStatus',
        type: 'string',
        align: 'center',
        width: 200,
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
        title: t(translations, 'driverName', language),
        dataIndex: 'driverName',
        key: 'driverName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: t(translations, 'driverId', language),
        dataIndex: 'driverId',
        key: 'driverId',
        type: 'string',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: t(translations, 'unitNumber', language),
        dataIndex: 'unitNumber',
        key: 'unitNumber',
        type: 'string',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: t(translations, 'syncTime', language),
        dataIndex: 'syncTime',
        key: 'syncTime',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (row) => setTashkentTime(row)
    },
    {
        title: t(translations, 'createdAt', language),
        dataIndex: 'createdAt',
        key: 'createdAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (row) => setTashkentTime(row)
    },
    {
        title: t(translations, 'createdUser', language),
        dataIndex: ['createdUser', 'username'],
        key: 'createdUser',
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
        render: (row) => row ? setTashkentTime(row) : null
    },
    {
        title: t(translations, 'updatedUser', language),
        dataIndex: ['updatedUser', 'username'],
        key: 'updatedUser',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
]