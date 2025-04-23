import React from 'react'
import BankAccounts from '../../bank-accounts'

const BankAccountsTab = (props) => {
    const { openedCompanyId } = props
    return (
        <BankAccounts openedCompanyId={openedCompanyId}/>
    )
}

export default BankAccountsTab