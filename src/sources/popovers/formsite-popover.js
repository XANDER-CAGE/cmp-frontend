import { Col, Popover, Row, Table } from 'antd'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    formsiteFormResultsValidationErrorsColumns,
    formSitePopoverColumns,
} from '../columns/integrationsPopoverColumns';
import { setTashkentTime } from '../../utils';

const FormsitePopover = (props) => {
    const { res } = props

    const [open, setOpen] = useState(false)

    const [validationErrors, setValidationErrors] = useState([])

    useEffect(() => {
        if (res?.syncLog?.failCount > 0) {
            const allValidationErrors = [];

            res.syncLog.formResultLogs.forEach(log => {
                if (log.validationErrors && log.validationErrors.length > 0) {
                    allValidationErrors.push(...log.validationErrors);
                }
            });

            setValidationErrors(allValidationErrors);
        }
    }, []);

    return (
        <Popover
            open={open}
            onOpenChange={() => (res?.syncLog !== null ? setOpen(!open) : null)}
            content={
                <>
                    <Table
                        columns={formSitePopoverColumns(
                            res?.syncLog?.totalCount,
                            res?.syncLog?.successCount,
                            res?.syncLog?.createdCount,
                            res?.syncLog?.updatedCount,
                            res?.syncLog?.failCount
                        )}
                        dataSource={res?.syncLog?.formResultLogs?.map((item) => {
                            return {
                                ...item,
                                key: uuidv4()
                            }
                        })}
                        pagination={false}
                        size="small"
                    />

                    {validationErrors.length > 0 && (
                      <>
                      <Row>
                          <Col className='mt-8'>
                              <h3>Validation Errors</h3>
                          </Col>
                      </Row>
                      <Table
                        columns={formsiteFormResultsValidationErrorsColumns}
                        dataSource={validationErrors?.map((item) => {
                            return {
                                ...item,
                                key: uuidv4(),
                            };
                        })}
                        pagination={false}
                        size="small">
                      </Table>
                      </>
                    )
                    }

                    <Row>
                        <Col className='ml-auto text-[13px] mt-3 text-right'>
                            <p className='m-0'>Synced Time: <span className='font-[600]'>{setTashkentTime(res?.syncLog?.syncTime)}</span></p>
                            <p className='m-0'>Synced By User: <span className='font-[600]'>{res?.syncLog?.syncByUser?.username}</span></p>
                        </Col>
                    </Row>
                </>
            }
        >
            <div className='h-[100%]'>
                {/* GREEN */}
                {res?.syncLog?.successCount > 0 && res?.syncLog?.failCount === 0 && res?.syncLog?.jobSuccess !== false ? (
                    <div
                        className={clsx({
                            'font-bold': true,
                            'bg-green-200': true,
                            'h-full w-full p-3 rounded-t-lg': true,
                        })}
                    >
                        {`Success: ${res?.syncLog?.successCount}`}
                        <br />
                        {res?.syncLog?.failCount > 0 ? `Failed: ${res?.syncLog?.failCount}` : null}
                    </div>
                ) : null}

                {/* YELLOW */}
                {res?.syncLog?.successCount === 0 && res?.syncLog?.totalCount === 0 && res?.syncLog?.jobSuccess !== false ? (
                    <div
                        className={clsx({
                            'font-bold': true,
                            'bg-yellow-200': true,
                            'h-full w-full p-3 rounded-t-lg': true,
                        })}
                    >
                        No data
                    </div>
                ) : null}
                {/* RED */}
                {res?.syncLog?.failCount > 0 || res?.syncLog?.jobSuccess === false ? (
                    <div
                        className={clsx({
                            'font-bold': true,
                            'bg-red-200': true,
                            'h-full w-full p-3 rounded-t-lg': true,
                        })}
                    >
                        {`Success: ${res?.syncLog?.successCount}`}
                        <br />
                        {res?.syncLog?.failCount > 0 ? `Failed: ${res?.syncLog?.failCount}` : null}
                        <br />
                        {res?.syncLog?.jobSuccess === false ? `Job failed` : null}
                    </div>
                ) : null}
            </div>
        </Popover>
    )
}

export default FormsitePopover