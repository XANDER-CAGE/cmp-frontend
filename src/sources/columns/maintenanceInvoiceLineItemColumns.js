import { Popconfirm, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { MdOutlineDelete } from "react-icons/md";
import { setTashkentTime } from '../../utils';
import React from 'react';

export const maintenanceInvoiceLineItemColumns = (pageNumber, pageSize, deleteLoading, deleteLineItem, calculateExtPrice) => [
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
        title: `Description`,
        dataIndex: 'description',
        key: 'description',
        type: 'string',
        align: 'left',
        width: 220,
        checked: true,
        editable: true,
        ellipsis: {
            showTitle: false,
        },
        render: (description) => (
          <Tooltip placement="topLeft" title={description}>
              {description}
          </Tooltip>
        ),
    },
    {
        title: `UOM`,
        dataIndex: 'uomType',
        key: 'uom_type',
        type: 'string',
        align: 'center',
        width: 80,
        checked: true,
    },

    {
        title: `Quantity`,
        dataIndex: 'quantity',
        key: 'quantity',
        type: 'number',
        align: 'center',
        width: 100,
        checked: true,
        editable: true,
    },
    {
        title: `Retail Price`,
        dataIndex: 'retailPrice',
        key: 'retailPrice',
        type: 'number',
        align: 'center',
        width: 120,
        checked: true,
        editable: true,
    },
    {
        title: `Discounted`,
        dataIndex: 'discountedPrice',
        key: 'discountedPrice',
        type: 'number',
        align: 'center',
        width: 120,
        checked: true,
        editable: true,
    },
    {
        title: `Ext. Price`,
        dataIndex: 'extPrice',
        key: 'extPrice',
        type: 'number',
        align: 'center',
        width: 120,
        checked: true,
        editable: !calculateExtPrice
    },
    {
        title: `Created User`,
        dataIndex: 'createdUserName',
        key: 'createdUserName',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Created At`,
        dataIndex: 'createdAt',
        key: 'createdAt',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{setTashkentTime(date)}</>
    },
    {
        title: `Updated User`,
        dataIndex: 'updatedUserName',
        key: 'updatedUserName',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
    },
    {
        title: `Updated At`,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        type: 'string',
        align: 'center',
        width: 150,
        checked: true,
        render: (date) => <>{date ? setTashkentTime(date) : ''}</>
    },

    {
        title: ``,
        key: 'operations',
        fixed: 'right',
        align: 'center',
        width: 60,
        render: (row) => {
            return (
              <div className="flex justify-center">
                  {
                    !row.isDefault && (
                      <Popconfirm
                        isLoading={deleteLoading}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        title={'Are you sure to delete?'}
                        onConfirm={() => deleteLineItem(row?.key)}
                        okText="Yes"
                        cancelText="No"
                        className={'shadow-lg overflow-hidden'}
                      >
                          <div className="icon">
                              <MdOutlineDelete />
                          </div>
                      </Popconfirm>
                    )
                  }
              </div>
            );
        },
        checked: true,
    },
]