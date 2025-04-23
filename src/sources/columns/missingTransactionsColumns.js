import { setUTCTime } from "../../utils";
import { HiOutlineTableCells } from "react-icons/hi2";

export const missingTransactionsColumns = (pageNumber, pageSize, openModal) => [
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
        dataIndex: 'organizationName',
        key: 'organizationName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `EFS Account`,
        dataIndex: 'efsAccountName',
        key: 'efsAccountName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Company`,
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Transactions Count`,
        dataIndex: 'transactionsCount',
        key: 'transactionsCount',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Total Amount`,
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Period`,
        key: 'period',
        align: 'center',
        width: 150,
        checked: true,
        render: (row) => {
            return (
                <>
                    {setUTCTime(row?.startPeriod, 'YYYY-MM-DD')}
                    <br />
                    {setUTCTime(row?.endPeriod, 'YYYY-MM-DD')}
                </>
            )
        }
    },
    {
        title: `Operation`,
        key: 'operations',
        align: 'center',
        width: 100,
        checked: true,
        fixed: 'right',
        render: (row) => {
            return (
                <div className='flex justify-center'>
                    <div className='icon' onClick={() =>
                        openModal(
                            row?.organizationId,
                            row?.efsAccountId,
                            row?.companyId,
                            setUTCTime(row?.startPeriod, 'YYYY-MM-DD'),
                            setUTCTime(row?.endPeriod, 'YYYY-MM-DD')
                        )
                    }>
                        <HiOutlineTableCells />
                    </div>
                </div>
            )
        },
    },
]