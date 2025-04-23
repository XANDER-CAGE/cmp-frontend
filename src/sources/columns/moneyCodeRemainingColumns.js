import { reFormatWithSpace } from "../../utils"

export const moneyCodeRemainingColumns = (pageNumber, pageSize) => [
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
        title: `Organization Name`,
        dataIndex: 'organizationName',
        key: 'organizationName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `EFS Account Name`,
        dataIndex: 'efsAccountName',
        key: 'efsAccountName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Company Name`,
        dataIndex: 'companyName',
        key: 'companyName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Total Amount`,
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (row) => reFormatWithSpace(row?.toFixed(2))
    },
    {
        title: `Total Amount 20 %`,
        dataIndex: 'totalAmount20Percent',
        key: 'totalAmount20Percent',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        // sortDirections: ['descend', 'ascend'],
        // sorter: true,
        render: (row) => reFormatWithSpace(row?.toFixed(2))
    },
    {
        title: `Total Money Code Used`,
        dataIndex: 'totalMoneyCodeUsed',
        key: 'totalMoneyCodeUsed',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (row) => row ? reFormatWithSpace(row?.toFixed(2)) : "-"
    },
    {
        title: `Money Code Remaining`,
        dataIndex: 'moneyCodeRemaining',
        key: 'moneyCodeRemaining',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (row) => row ? reFormatWithSpace(row?.toFixed(2)) : "-"
    },
]