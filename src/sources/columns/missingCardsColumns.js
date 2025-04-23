import { MdAdd } from 'react-icons/md'

export const missingCardsColumns = (pageNumber, pageSize, openModal) => [
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
        title: `Card Number`,
        dataIndex: 'cardNumber',
        key: 'cardNumber',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Driver Name`,
        dataIndex: 'driverName',
        key: 'driverName',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Unit Number`,
        dataIndex: 'unitNumber',
        key: 'unitNumber',
        align: 'center',
        width: 200,
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
        title: `Operation`,
        key: 'operation',
        align: 'center',
        render: (row) => {
            return (
                <div className='flex justify-center'>
                    <div className="icon" onClick={() => openModal(row?.cardNumber, row?.driverName, row?.unitNumber)}>
                        <MdAdd />
                    </div>
                </div>
            )
        },
        fixed: 'right',
        width: 100,
        checked: true,
    },
]