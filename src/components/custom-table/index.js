import React, { useEffect, useMemo, useState } from 'react'
import { Checkbox, Table, Popover, Pagination } from 'antd'
import { BsFilter } from "react-icons/bs"
import { useLocalStorageState } from 'ahooks'
import { useLanguage } from '../../contexts/LanguageContext'
import { translations } from '../../translations'
import { t } from '../../utils/transliteration'

const CustomTable = (props) => {
    const { name, data, columns, size, rowClassName, isLoading, setPageNumber, setPageSize, pageNumber, totalCount, pageSize, scrollY,
        showPagination = true, showFilter = true, isRowSelection = false, onRowSelection, expandable,
        rowKey = 'id',
        className = '',
        rowSelection,
        onSort,
        footer,
        components
    } = props

    const { language } = useLanguage();
    const [filterColumns, setFilterColumns] = useLocalStorageState(`table-columns-${name}`, {
        defaultValue: {},
    });
    const [isOpenFilterDropdown, setIsOpenFilterDropdown] = useState(false)

    const mergedColumns = useMemo(() => {
        return columns.map((col) => {
            return {
                ...col,
                onCell: (record) => ({
                    record,
                    title: col?.title,
                }),
            };
        })
    }, [columns])

    useEffect(() => {
        if (filterColumns && Object.keys(filterColumns).length > 1) return
        let obj = {};
        mergedColumns.forEach((item) => {
            obj[item.key] = { key: item.key, checked: !item.hide };
        })

        setFilterColumns(obj)
        // eslint-disable-next-line
    }, [mergedColumns, filterColumns])

    const filteredColumns = useMemo(
        () =>
            mergedColumns.filter((item) => showFilter === false || (filterColumns && filterColumns[item.key]?.checked)),
        [mergedColumns, filterColumns],
    )

    const items = mergedColumns.map((item) => ({
        key: item.key,
        label: (
            <>
                <Checkbox
                    checked={filterColumns && !!filterColumns[item.key]?.checked}
                    onChange={(e) => { }}
                    className={'mr-2'}
                ></Checkbox>
                {item.title}
            </>
        ),
    }))

    const onFilterColumn = (checked, key) => {
        setFilterColumns({ ...filterColumns, [key]: { key: key, checked } });
    }

    return (
        <>
            {
                showFilter ? (
                    <Popover
                        content={
                            <ul>
                                {
                                    items?.map((e, index) => {
                                        return (
                                            <li key={index} onClick={() => onFilterColumn(!!filterColumns && !filterColumns[e.key]?.checked, e.key)}>{e.label}</li>
                                        )
                                    })
                                }
                            </ul>
                        }
                        trigger="click"
                        open={isOpenFilterDropdown}
                        onOpenChange={(flag) => {
                            setIsOpenFilterDropdown(flag)
                        }}
                        className='custom-popover'
                        placement="bottomLeft"
                    >
                        <div className='icon mb-3 ml-auto'>
                            <BsFilter />
                        </div>
                    </Popover>
                ) : null
            }
            <Table
                className={className}
                name={name}
                dataSource={data}
                columns={filteredColumns}
                size={size}
                loading={isLoading}
                expandable={expandable}
                rowKey={rowKey}
                pagination={showPagination && !!!totalCount ? { defaultPageSize: pageSize, total: totalCount, current: pageNumber, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] } : false}
                onChange={(e, filters, sorter, extra) => {
                  if (onSort) {
                    onSort(sorter)
                  }
                }}
                scroll={{
                    x: 'scroll',
                    y: scrollY
                }}
                rowClassName={rowClassName}
                onRow={(row) => {
                    return {
                        onClick: () => isRowSelection && onRowSelection ? onRowSelection(row) : null
                    }
                }}
                rowSelection={isRowSelection ? rowSelection : null}
                showSorterTooltip={
                  onSort && { target: 'sorter-icon' }
                }
                footer={footer}
                components={components}
            />
            <div className='text-center mt-5'>
                {
                    showPagination && !!totalCount ? (
                        <Pagination
                            total={totalCount}
                            current={pageNumber}
                            pageSize={pageSize}
                            showSizeChanger={true}
                            pageSizeOptions={['10', '20', '50', '100']}
                            placement={true}
                            size='small'
                            onChange={(pageNumber) => {
                                setPageNumber(pageNumber)
                            }}
                            onShowSizeChange={(current, pageSize) => {
                                setPageSize(pageSize)
                            }}
                            showTotal={(total, range) => 
                                language === 'en' 
                                    ? `${range[0]}-${range[1]} of ${total} items` 
                                    : `${range[0]}-${range[1]} из ${total} элементов`
                            }
                        />
                    ) : null
                }
            </div>
        </>
    )
}

export default CustomTable