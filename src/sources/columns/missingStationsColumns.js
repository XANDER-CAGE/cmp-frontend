import { MdAdd } from 'react-icons/md'

export const missingStationsColumns = (pageNumber, pageSize, openModal) => [
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
        title: `Station Name`,
        dataIndex: 'stationName',
        key: 'stationName',
        type: 'string',
        align: 'center',
        width: 300,
        checked: true,
    },
    {
        title: `State`,
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `City`,
        dataIndex: 'city',
        key: 'city',
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
                    <div className="icon" onClick={() => openModal(row?.stationName, row?.state, row?.city)}>
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