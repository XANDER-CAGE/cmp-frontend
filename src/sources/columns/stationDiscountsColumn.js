import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from "../../utils";

export const stationDiscountsColumns = (pageNumber, pageSize, deleteStationDiscount, deleteLoading, openModal) => [
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
        title: `Modified At`,
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>
    },
    {
        title: `Discount`,
        dataIndex: 'discount',
        key: 'discount',
        type: 'string',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `Performer`,
        dataIndex: ['user', 'name'],
        key: 'performer',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Department`,
        dataIndex: ['modifiedUser', 'department'],
        key: 'department',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Stations Count`,
        dataIndex: 'stationsCount',
        key: 'stationsCount',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `From Date`,
        dataIndex: 'fromDate',
        key: 'fromDate',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `To Date`,
        dataIndex: 'toDate',
        key: 'toDate',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Operations`,
        key: 'operations',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (row) => {
            return (
                <div className='flex justify-center'>
                    <Popconfirm
                        isLoading={deleteLoading}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        title={(
                            <>
                                The line contains the generated customer invoice.
                                <br />
                                Are you confirming that you want to perform this action?
                            </>
                        )}
                        onConfirm={() => deleteStationDiscount(row)}
                        okText="Yes"
                        cancelText="No"
                        className={'shadow-lg overflow-hidden'}
                    >
                        <div className='icon'>
                            <MdOutlineDelete />
                        </div>
                    </Popconfirm>
                    <div className='icon' onClick={() => openModal(row)}>
                        <MdEdit />
                    </div>
                </div>
            )
        },
        checked: true,
    },
]