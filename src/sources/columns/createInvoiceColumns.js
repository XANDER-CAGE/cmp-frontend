import { Checkbox } from "antd"
import { translations } from "../../translations";
import { t } from "../../utils/transliteration";

export const createInvoiceColumns = (pageNumber, pageSize, setIsAllChecked, isAllChecked, setUnselectedIDs, setSelectedIDs, isChecked, language = 'en') => [
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
        title: t(translations, 'organization', language),
        dataIndex: ['organization', 'name'],
        key: 'organization',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: t(translations, 'efsAccount', language),
        dataIndex: ['efsAccount', 'name'],
        key: 'efsAccount',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: t(translations, 'company', language),
        dataIndex: ['company', 'name'],
        key: 'company',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: t(translations, 'pricingModels', language),
        dataIndex: 'pricingModel',
        key: 'pricingModel',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: t(translations, 'billingCycle', language),
        dataIndex: 'billingCycle',
        key: 'billingCycle',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: t(translations, 'billingType', language),
        dataIndex: 'billingType',
        key: 'billingType',
        align: 'center',
        width: 120,
        checked: true,
    },
    {
        title: t(translations, 'discount', language),
        dataIndex: 'discount',
        key: 'discount',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: t(translations, 'feesType', language),
        dataIndex: 'feesType',
        key: 'feesType',
        align: 'center',
        width: 100,
        checked: true,
    },
]