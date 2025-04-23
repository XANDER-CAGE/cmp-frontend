import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from "../../utils";
import Authorize from '../../utils/Authorize';
import { PERMISSIONS } from '../../constants';

export const invoiceGroupsColumns = (pageNumber, pageSize, deleteInvoiceGroup, deleteLoading, permissions) => [
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
        title: `Invoices Count`,
        dataIndex: 'invoicesCount',
        key: 'invoicesCount',
        type: 'string',
        align: 'center',
        width: 100,
        checked: true,
    },
    {
        title: `Period`,
        key: 'period',
        type: 'string',
        align: 'center',
        width: 100,
        checked: true,
        render: (row) => {
            return (
                <>
                    {setTashkentTime(row?.startPeriod, 'YYYY-MM-DD')}
                    <br />
                    {setTashkentTime(row?.endPeriod, 'YYYY-MM-DD')}
                </>
            )
        }
    },
    {
        title: `Due Date`,
        dataIndex: 'dueDate',
        key: 'dueDate',
        type: 'string',
        align: 'center',
        width: 100,
        checked: true,
        render: (date) => setTashkentTime(date, 'YYYY-MM-DD')
    },
    {
        title: `Invoice Date`,
        dataIndex: 'invoiceDate',
        key: 'invoiceDate',
        type: 'string',
        align: 'center',
        width: 100,
        checked: true,
        render: (date) => setTashkentTime(date, 'YYYY-MM-DD')
    },
    {
        title: `Performer`,
        dataIndex: ['user', 'username'],
        key: 'performer',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Department`,
        dataIndex: ['user', 'department'],
        key: 'department',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    Authorize(permissions, [PERMISSIONS.INVOICE.CANCEL], false) &&
    {
        title: `Operations`,
        key: 'operations',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: (row) => {
            return (
              Authorize(permissions, [PERMISSIONS.INVOICE.CANCEL]) &&
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
                        onConfirm={() => deleteInvoiceGroup(row?.invoiceIds)}
                        okText="Yes"
                        cancelText="No"
                        className={'shadow-lg overflow-hidden'}
                    >
                        <div className='icon'>
                            <MdOutlineDelete />
                        </div>
                    </Popconfirm>
                </div>
            )
        },
        checked: true,
    },
]