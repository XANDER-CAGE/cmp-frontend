import { setTashkentTime } from "../../utils"

export const efsCardsColumns = (pageNumber, pageSize) => [
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
        title: `Account Name`,
        dataIndex: 'accountName',
        key: 'accountName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Card Number`,
        dataIndex: 'cardNumber',
        key: 'cardNumber',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Card Status`,
        dataIndex: 'cardStatus',
        key: 'cardStatus',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Driver Name`,
        dataIndex: 'driverName',
        key: 'driverName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Driver Id`,
        dataIndex: 'driverId',
        key: 'driverId',
        type: 'string',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `Unit Number`,
        dataIndex: 'unitNumber',
        key: 'unitNumber',
        type: 'string',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: `Sync Time`,
        dataIndex: 'syncTime',
        key: 'syncTime',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (row) => setTashkentTime(row)
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (row) => setTashkentTime(row)
    },
    {
        title: `Created User`,
        dataIndex: ['createdUser', 'username'],
        key: 'createdUser',
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
        render: (row) => row ? setTashkentTime(row) : null
    },
    {
        title: `Updated User`,
        dataIndex: ['updatedUser', 'username'],
        key: 'updatedUser',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
]