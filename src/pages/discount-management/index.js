import React, { useState } from 'react'
import { Tabs } from 'antd'
import DailyDiscounts from './tabs/daily-discounts'
import StationDiscounts from './tabs/station-discounts'
import CompanyDiscounts from './tabs/companyDiscounts'
import StationChainCompanyDiscounts from './tabs/station-chain-company-discounts'
import StationChainDiscounts from './tabs/station-chain-discounts';

const DiscountManagement = () => {
    const [tabType, setTabType] = useState("daily-discounts")

    const items = [
        {
            key: 'daily-discounts',
            label: 'Daily Discounts',
        },
        {
            key: 'chain-discounts',
            label: 'Station Chain Discounts',
        },
        {
            key: 'station-discounts',
            label: 'Station Discounts',
        },
        {
            key: 'company-discounts',
            label: 'Company Discounts',
        },
        {
            key: 'station-chains-company-discounts',
            label: 'Station Chains + Company Discounts',
        },
    ]

    return (
        <div className='box'>
            <Tabs
                items={items}
                onChange={(e) => setTabType(e)}
                defaultActiveKey={tabType}
            />

            {tabType === "daily-discounts" ? <DailyDiscounts /> : null}
            {tabType === "station-discounts" ? <StationDiscounts /> : null}
            {tabType === "chain-discounts" ? <StationChainDiscounts /> : null}
            {tabType === "company-discounts" ? <CompanyDiscounts /> : null}
            {tabType === "station-chains-company-discounts" ? <StationChainCompanyDiscounts /> : null}
        </div>
    )
}

export default DiscountManagement