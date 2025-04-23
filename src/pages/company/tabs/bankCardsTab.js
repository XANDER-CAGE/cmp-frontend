import React from 'react'
import BankCards from '../../bank-cards'

const BankCardsTab = (props) => {
    const { openedCompanyId } = props
    return (
        <BankCards openedCompanyId={openedCompanyId}/>
    )
}

export default BankCardsTab