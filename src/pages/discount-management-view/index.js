import React, { useState } from 'react'
import { Tabs } from 'antd'
import DailyDiscountsView from './tabs/dailyDiscountsView'
import StationDiscountsView from './tabs/stationDiscountsView'
import CompanyDiscountsView from './tabs/companyDiscountsView'
import StationChainCompanyDiscountsView from './tabs/stationChainCompanyDiscountView'
import StationChainDiscountsView from './tabs/stationChainDiscountsView';

const DiscountManagementView = () => {
    const [tabType, setTabType] = useState("daily-discounts")

    const items = [
        {
            key: 'daily-discounts',
            label: 'Daily Discounts',
        },
        {
            key: 'station-chain-discounts',
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

            {tabType === "daily-discounts" ? <DailyDiscountsView /> : null}
            {tabType === "station-chain-discounts" ? <StationChainDiscountsView /> : null}
            {tabType === "station-discounts" ? <StationDiscountsView /> : null}
            {tabType === "company-discounts" ? <CompanyDiscountsView /> : null}
            {tabType === "station-chains-company-discounts" ? <StationChainCompanyDiscountsView /> : null}
        </div>
    )
}

export default DiscountManagementView