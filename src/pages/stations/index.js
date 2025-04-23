import React, { useEffect, useMemo, useState } from 'react'
import http from '../../utils/axiosInterceptors'
import CustomTable from '../../components/custom-table'
import { Button, Col, Collapse, Input, Row, Select } from 'antd';
import { toast } from 'react-toastify';
import StationsModal from '../../modals/stations';
import { stationsColumns } from '../../sources/columns/stationsColumns';
import { makeOptions } from '../../utils';
import { FaFilter } from 'react-icons/fa';

const Stations = () => {
    const [stations, setStations] = useState([])
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [editId, setEditId] = useState(null)

    const [chains, setChains] = useState([])
    const [chainId, setChainId] = useState(null)
    const [status, setStatus] = useState(null)
    const [isOpenFilter, setIsOpenFilter] = useState(true)

    const openModal = (id) => {
        setIsOpenModal(true)
        setEditId(id)
    }

    const closeModal = () => {
        setIsOpenModal(false)
        setEditId(null)
    }

    const getStationChains = async () => {
        try {
            const response = await http.get("StationChains")
            setChains(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getStations = async () => {
        setIsLoading(true)
        try {
            const response = await http.post("Stations/filter", filters)
            setStations(response?.data?.items)
            setTotalCount(response?.data?.totalCount)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteStations = async (id) => {
        setDeleteLoading(true)
        try {
            const response = await http.delete(`Stations/${id}`)
            if (response?.success) {
                toast.success('Succesfully deleted!')
                getStations()
            } else {
                toast.error(response?.error)
            }
        } catch (error) {
            toast.error(error?.response?.data?.error ?? error?.response?.statusText ?? 'Server Error!')
        } finally {
            setDeleteLoading(false)
        }
    }

    const filters = useMemo(() => {
        return {
            pageNumber,
            pageSize,
            searchTerm,
            chains: chainId ? [chainId] : null,
            type: status
        }
    },
        [pageNumber, pageSize, searchTerm, chainId, status]
    )


    const filterItems = [
        {
            key: '1',
            label: 'Tap to Filter',
            children:
              <Row gutter={[16, 16]}>
                  <Col span={8}>
                      <Select
                        className='w-[100%]'
                        placeholder="Station Chain"
                        options={makeOptions(chains, 'name')}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                          (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={chainId}
                        onChange={(e) => setChainId(e)}
                      />
                  </Col>
                  <Col span={8}>
                      <Select
                        className='w-[100%]'
                        placeholder="Status"
                        options={[
                            { value: "NonDiscount", label: "NonDiscount" },
                            { value: "Discount", label: "Discount" }
                        ]}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                          (option?.label || '').toLowerCase().includes(input.toLowerCase())
                        }
                        value={status}
                        onChange={(e) => setStatus(e)}
                      />
                  </Col>
              </Row>,
        }
    ];

    useEffect(() => {
        getStations()

        // eslint-disable-next-line
    }, [pageNumber, pageSize, searchTerm, status, chainId])

    useEffect(() => {
        setPageNumber(1)
    }, [searchTerm, status, chainId])

    useEffect(() => {
        getStationChains()
    }
    , [])

    return (
        <div className='box'>
            <Row className='mb-5'>
                <Col span={18}>
                    <Collapse
                      style={{ width: '100%' }}
                      items={filterItems}
                      bordered={false}
                      activeKey={isOpenFilter ? ['1'] : null}
                      size='small'
                      expandIconPosition='end'
                      expandIcon={() => <FaFilter />}
                      onChange={() => setIsOpenFilter(!isOpenFilter)}
                    />
                </Col>
                <Col className='ml-auto mr-3'>
                    <Input.Search
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder='Search'
                        allowClear
                    />
                </Col>
                <Col>
                    <Button
                        type='primary'
                        onClick={() => openModal(null)}
                    >
                        + Add
                    </Button>
                </Col>
            </Row>

            <CustomTable
                name="stations"
                columns={stationsColumns(pageNumber, pageSize, deleteStations, deleteLoading, openModal)}
                data={stations}
                size="small"
                setPageNumber={setPageNumber}
                setPageSize={setPageSize}
                isLoading={isLoading}
                pageSize={pageSize}
                pageNumber={pageNumber}
                totalCount={totalCount}
                scrollY="60vh"
            />

            {/* STATIONS MODAL */}
            {
                isOpenModal ? (
                    <StationsModal
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                        getStations={getStations}
                        editId={editId}
                    />
                ) : null
            }
        </div>
    )
}

export default Stations