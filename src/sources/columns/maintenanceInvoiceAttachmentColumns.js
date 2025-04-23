import { Popconfirm, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from "../../utils";
import { PiDownloadBold } from "react-icons/pi";

export const maintenancesInvoiceAttachmentColumns = (pageNumber, pageSize, deleteMaintenanceRequestById, deleteLoading, openModal, downloadMaintenanceInvoiceAttachmentById) => [
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
        title: `Filename`,
        key: 'fileName',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
        render: (row) => {
            return (
                <span>{row?.fileName} { row.isManuallyInvoice && <Tag color='processing'>manually</Tag>}</span>
            )
        }
    },
    {
        title: `Notes`,
        dataIndex: 'notes',
        key: 'notes',
        type: 'string',
        align: 'center',
        width: 250,
        checked: true,
    },
    {
        title: `Created User`,
        dataIndex: 'createdUserName',
        key: 'createdUserName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>
    },
    {
        title: `Operations`,
        key: 'operations',
        fixed: 'right',
        align: 'center',
        width: 150,
        render: (row) => {
            return (
                <div className='flex justify-center'>
                    <Popconfirm
                        isLoading={deleteLoading}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        title={'Are you sure to delete?'}
                        onConfirm={() => deleteMaintenanceRequestById(row?.id)}
                        okText="Yes"
                        cancelText="No"
                        className={'shadow-lg overflow-hidden'}
                    >
                        <div className='icon'>
                            <MdOutlineDelete />
                        </div>
                    </Popconfirm>

                    {
                        !row.isManuallyInvoice && (
                        <div className="icon" onClick={() => openModal(row?.id)}>
                            <MdEdit />
                        </div>
                      )
                    }

                    <div className="icon" onClick={() => downloadMaintenanceInvoiceAttachmentById(row)}>
                        <PiDownloadBold />
                    </div>
                </div>
            )
        },
        checked: true,
    },
]