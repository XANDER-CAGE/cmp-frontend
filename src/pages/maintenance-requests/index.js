import React, { useState } from 'react'
import { Tabs } from 'antd'
import RequestsLists from './requests-lists'
import MissingInInvoices from './missing-in-invoices'
import Unpaid from './unpaid';


const MaintenanceRequests = () => {

    const [tabType, setTabType] = useState("requests-list")

    const items = [
        {
            key: 'requests-list',
            label: 'Requests List',
        },
        {
            key: 'missing-in-invoices',
            label: 'Missing in Invoices',
        },
        {
            key: 'unpaid',
            label: 'Unpaid',
        },
    ]

    return (
        <div className='box'>
            <Tabs
                items={items}
                onChange={(e) => setTabType(e)}
                defaultActiveKey={tabType}
            />
            {tabType === "requests-list" ? <RequestsLists /> : null}
            {tabType === "missing-in-invoices" ? <MissingInInvoices /> : null}
            {tabType === "unpaid" ? <Unpaid /> : null}
        </div>
    )
}

export default MaintenanceRequests