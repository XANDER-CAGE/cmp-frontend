import { useLocalStorageState } from 'ahooks';
import { Button, Checkbox, Dropdown, Empty } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BsFilter } from 'react-icons/bs';
import { useBlockLayout, useTable } from 'react-table';
import { FixedSizeList } from 'react-window';

export const scrollbarWidth = () => {
    const scrollDiv = document.createElement('div');
    scrollDiv.setAttribute('style', 'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;');
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
};

export default function VirtualTable({
    columns,
    data,
    total,
    name,
    noFilterColumns,
    rowSelection,
}) {
    const [filterColumns, setFilterColumns] = useLocalStorageState(`table-columns-${name}`, {
        defaultValue: {},
    });
    const [openFilterDropdown, setOpenFilterDropdown] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState({});

    const defaultColumn = useMemo(
        () => ({
            width: 150,
        }),
        [],
    );

    const scrollBarSize = useMemo(() => scrollbarWidth(), []);

    useEffect(() => {
        setSelectedRowKeys({});
        rowSelection?.onChange([]);
    }, [rowSelection]);

    useEffect(() => {
        if (noFilterColumns || (filterColumns && Object.keys(filterColumns).length > 1)) return;
        let obj = {};
        columns.forEach((item) => {
            obj[item.Header] = { key: item.Header, checked: !item.hide };
        });

        setFilterColumns(obj);
    }, [columns, noFilterColumns, setFilterColumns, filterColumns]);

    const filteredColumns = useMemo(
        () =>
            noFilterColumns
                ? columns
                : columns.filter((item) => filterColumns && filterColumns[item.Header]?.checked),
        [columns, filterColumns, noFilterColumns],
    );

    const allSelectedRowKeys = useMemo(() => {
        return (
            data?.reduce(
                (previousValue, currentValue) => ({
                    ...previousValue,
                    [currentValue.key]: true,
                }),
                {},
            ) || {}
        );
    }, [data]);

    const visibleColumns = useMemo(
        () => [
            ...(rowSelection
                ? [
                    {
                        id: 'checkbox',
                        Header: (
                            <Checkbox
                                indeterminate={
                                    rowSelection.selectedRowKeys.length > 0 && rowSelection.selectedRowKeys.length < (data?.length || 0)
                                }
                                checked={!!data?.length && rowSelection.selectedRowKeys.length === (data?.length || 0)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedRowKeys(allSelectedRowKeys);
                                        rowSelection.onChange(data?.map((row) => row.key) || []);
                                    } else {
                                        setSelectedRowKeys({});
                                        rowSelection.onChange([]);
                                    }
                                }}
                            />
                        ),
                        accessor: (row) => (
                            <Checkbox
                                checked={selectedRowKeys[row.key]}
                                onChange={(e) => {
                                    const keys = { ...selectedRowKeys, [row.key]: e.target.checked };
                                    setSelectedRowKeys(keys);
                                    rowSelection.onChange(
                                        Object.entries(keys)
                                            .filter(([key, value]) => !!value)
                                            .map(([key]) => key),
                                    );
                                }}
                            />
                        ),
                        width: 50,
                    },
                ]
                : []),
            ...filteredColumns,
        ],

        // eslint-disable-next-line
        [rowSelection, filteredColumns, selectedRowKeys],
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, totalColumnsWidth, prepareRow } = useTable(
        {
            columns: visibleColumns,
            data: data || [],
            defaultColumn,
        },
        useBlockLayout,
    );

    const RenderRow = useCallback(
        ({ index, style }) => {
            const row = rows[index];
            prepareRow(row);
            return (
                <div {...row.getRowProps({ style })} className="tr">
                    {row.cells.map((cell, index) => {
                        return (
                            <div {...cell.getCellProps()} className="td" key={index}>
                                {cell.render('Cell')}
                            </div>
                        );
                    })}
                </div>
            );
        },
        [prepareRow, rows],
    );

    const onFilterColumn = (checked, key) => {
        setFilterColumns({ ...filterColumns, [key]: { key: key, checked } });
        // localStorage
    };

    const items = columns.map((item) => ({
        key: item.Header,
        label: (
            <>
                <Checkbox
                    checked={filterColumns && !!filterColumns[item.Header]?.checked}
                    onChange={(e) => { }}
                    className={'mr-2'}
                ></Checkbox>
                {item.Header}
            </>
        ),
    }));

    return (
        <div>
            <div className={'flex justify-between items-center mb-2 gap-2'}>
                <div className={'flex items-center gap-2'}>
                    <>
                        {!noFilterColumns && (
                            <Dropdown
                                menu={{
                                    items,
                                    onClick: (e) => {
                                        onFilterColumn(!!filterColumns && !filterColumns[e.key]?.checked, e.key);
                                    },
                                }}
                                placement="bottomRight"
                                arrow
                                open={openFilterDropdown}
                                onOpenChange={(flag) => {
                                    setOpenFilterDropdown(flag);
                                }}
                            >
                                <Button>
                                    <BsFilter />
                                </Button>
                            </Dropdown>
                        )}
                    </>
                </div>
            </div>
            {!data?.length ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                <div {...getTableProps()} className="table">
                    <div>
                        {headerGroups.map((headerGroup, index) => (
                            <div {...headerGroup.getHeaderGroupProps()} className="tr" key={index}>
                                {headerGroup.headers.map((column, indexColumn) => (
                                    <div {...column.getHeaderProps()} className="th" key={indexColumn}>
                                        {column.render('Header')}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div {...getTableBodyProps()}>
                        <FixedSizeList height={500} itemCount={rows.length} itemSize={35} width={totalColumnsWidth + scrollBarSize}>
                            {RenderRow}
                        </FixedSizeList>
                    </div>
                </div>
            )}
            {total && <p className={'font-bold'}>Total: {total}</p>}
        </div>
    );
}