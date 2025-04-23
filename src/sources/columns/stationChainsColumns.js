import { Popconfirm } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdEdit, MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from "../../utils";

export const stationChainsColumns = (pageNumber, pageSize, deleteStationChains, deleteLoading, openModal) => [
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
        title: `Name`,
        dataIndex: 'name',
        key: 'name',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Alias Name`,
        dataIndex: 'aliasName',
        key: 'aliasName',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Organization`,
        dataIndex: 'organizations',
        key: 'organizations',
        align: 'center',
        width: 300,
        checked: true,
        render: (organizations) => {
            return (
              <>
                  {
                      organizations?.map((organization, index) => {
                          return <div key={index}>{organization?.name}</div>
                      })
                  }
              </>
            )
        }
    },
    {
        title: `Additional Gallons`,
        dataIndex: 'additionalGallons',
        key: 'additionalGallons',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Description`,
        dataIndex: 'description',
        key: 'description',
        type: 'string',
        align: 'center',
        width: 200,
        checked: true,
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
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
        width: 100,
        render: (row) => {
            return (
                <div className='flex justify-center'>
                    <Popconfirm
                        isLoading={deleteLoading}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        title={'Are you sure to delete?'}
                        onConfirm={() => deleteStationChains(row?.id)}
                        okText="Yes"
                        cancelText="No"
                        className={'shadow-lg overflow-hidden'}
                    >
                        <div className='icon'>
                            <MdOutlineDelete />
                        </div>
                    </Popconfirm>
                    <div className='icon' onClick={() => openModal(row?.id)}>
                        <MdEdit />
                    </div>
                </div>
            )
        },
        checked: true,
    },
]