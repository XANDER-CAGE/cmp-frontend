import { setUTCTime } from "../../utils";
import { HiOutlineTableCells } from "react-icons/hi2";

export const missingMoneyCodesColumns = (pageNumber, pageSize, openModal) => [
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
        title: `Company`,
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Count`,
        dataIndex: 'count',
        key: 'count',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Total Fee`,
        dataIndex: 'totalFee',
        key: 'totalFee',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Total Amount Used`,
        dataIndex: 'totalAmountOfUsed',
        key: 'totalAmountOfUsed',
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