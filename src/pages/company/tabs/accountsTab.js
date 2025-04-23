import React from 'react'
import CompanyAccounts from '../../company-accounts'

const AccountsTab = (props) => {
    const { openedCompanyId } = props
    return (
        <CompanyAccounts openedCompanyId={openedCompanyId}/>
    )
}

export default AccountsTab