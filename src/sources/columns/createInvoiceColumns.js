import { Checkbox } from "antd"

export const createInvoiceColumns = (pageNumber, pageSize, setIsAllChecked, isAllChecked, setUnselectedIDs, setSelectedIDs, isChecked) => [
    {
        title: (
            <Checkbox
                onClick={() => {
                    setIsAllChecked(!isAllChecked)
                    setUnselectedIDs([])
                    setSelectedIDs([])
                }}
                checked={isAllChecked}
            />
        ),
        dataIndex: 'id',
        key: 'id',
        render: (id) => {
            return <Checkbox checked={isChecked(id)}></Checkbox>
        },
        width: 40,
    },
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
        title: `Organization`,
        dataIndex: ['organization', 'name'],
        key: 'organization',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `EFS Account`,
        dataIndex: ['efsAccount', 'name'],
        key: 'efsAccount',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Company`,
        dataIndex: ['company', 'name'],
        key: 'company',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Pricing Models`,
        dataIndex: 'pricingModel',
        key: 'pricingModel',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: `Billing Cycle`,
        dataIndex: 'billingCycle',
        key: 'billingCycle',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: `Billing Type`,
        dataIndex: 'billingType',
        key: 'billingType',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: `Discount`,
        dataIndex: 'discount',
        key: 'discount',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `Fees Type`,
        dataIndex: 'feesType',
        key: 'feesType',
        align: 'center',
        width: 100,
        checked: true,
    },
]