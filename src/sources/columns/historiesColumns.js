import { setLocalTime } from "../../utils";

export const historiesColumns = (pageNumber, pageSize) => [
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
        title: `File Name`,
        dataIndex: 'fileName',
        key: 'fileName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Total Transactions Count`,
        dataIndex: 'totalTransactionCount',
        key: 'totalTransactionCount',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `New Transactions Count`,
        dataIndex: 'newTransactionCount',
        key: 'newTransactionCount',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Existing Transactions Count`,
        dataIndex: 'existingTransactionCount',
        key: 'existingTransactionCount',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Error Transactions Count`,
        dataIndex: 'errorTransactionCount',
        key: 'errorTransactionCount',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Min Transaction Date`,
        dataIndex: 'minTransactionDate',
        key: 'minTransactionDate',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (transactionDate) => setLocalTime(transactionDate, 'YYYY-MM-DD')
    },
    {
        title: `Max Transaction Date`,
        dataIndex: 'maxTransactionDate',
        key: 'maxTransactionDate',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (transactionDate) => setLocalTime(transactionDate, 'YYYY-MM-DD')
    },
    {
        title: `Uploaded User`,
        dataIndex: 'uploadedUser',
        key: 'uploadedUser',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (row) => <>{row?.name} {row?.surname}</>
    },
    {
        title: `Uploaded Date`,
        dataIndex: 'uploadedAt',
        key: 'uploadedAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => setLocalTime(date)
    },
]