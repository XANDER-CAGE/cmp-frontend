import React from 'react'
import CompanyAccountCards from '../../company-account-cards'

const AccountCardsTab = (props) => {
    const { openedCompanyId } = props
    return (
        <CompanyAccountCards openedCompanyId={openedCompanyId}/>
    )
}

export default AccountCardsTab