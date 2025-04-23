export const efsPopoverColumns = (totalCount, successCount, createdCount, existingCount, failCount) => [
    {
        title: 'Account Name',
        dataIndex: 'accountName',
        key: 'accountName',
        align: 'center',
        render: (row) => <b>{row}</b>,
    },
    {
        title: () => <>Total Count <span className="text-[blue]">({totalCount})</span></>,
        dataIndex: 'totalCount',
        key: 'totalCount',
        align: 'center',
    },
    {
        title: () => <>Success Count <span className="text-[green]">({successCount})</span></>,
        dataIndex: 'successCount',
        key: 'successCount',
        align: 'center',
    },
    {
        title: () => <>Failed Count <span className="text-[red]">({failCount})</span></>,
        dataIndex: 'failedCount',
        key: 'failedCount',
        align: 'center',
    },
    {
        title: () => <>Created Count <span className="text-[grey]">({createdCount})</span></>,
        dataIndex: 'createdCount',
        key: 'createdCount',
        align: 'center',
    },
    {
        title: () => <>Existing Count <span className="text-[orange]">({existingCount})</span></>,
        dataIndex: 'existingCount',
        key: 'existingCount',
        align: 'center',
    },
]

export const formSitePopoverColumns = (totalCount, successCount, createdCount, updatedCount, failCount) => [
    {
        title: 'Form Name',
        dataIndex: 'formName',
        key: 'formName',
        align: 'center',
        render: (row) => <b>{row}</b>,
    },
    {
        title: () => <>Total Count <span className="text-[blue]">({totalCount})</span></>,
        dataIndex: 'totalCount',
        key: 'totalCount',
        align: 'center',
    },
    {
        title: () => <>Success Count <span className="text-[green]">({successCount})</span></>,
        dataIndex: 'successCount',
        key: 'successCount',
        align: 'center',
    },
    {
        title: () => <>Failed Count <span className="text-[red]">({failCount})</span></>,
        dataIndex: 'failedCount',
        key: 'failedCount',
        align: 'center',
    },
    {
        title: () => <>Created Count <span className="text-[grey]">({createdCount})</span></>,
        dataIndex: 'createdCount',
        key: 'createdCount',
        align: 'center',
    },
    {
        title: () => <>Updated Count <span className="text-[orange]">({updatedCount})</span></>,
        dataIndex: 'updatedCount',
        key: 'updatedCount',
        align: 'center',
    },
]

export const formsiteFormResultsValidationErrorsColumns = [
    {
        title: 'Form Name',
        dataIndex: 'formName',
        key: 'formName',
        align: 'center',
        render: (row) => <b>{row}</b>,
    },
    {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        // render: (row) => <b>{row}</b>,
    },
    {
        title: 'Field',
        dataIndex: 'fieldName',
        key: 'fieldName',
        align: 'center',
        // render: (row) => <b>{row}</b>,
    },
    {
        title: 'Error Message',
        dataIndex: 'errorMessage',
        key: 'errorMessage',
        align: 'center',
        // render: (row) => <b>{row}</b>,
    },
    {
        title: 'Attempted Value',
        dataIndex: 'attemptedValue',
        key: 'attemptedValue',
        align: 'center',
        // render: (row) => <b>{row}</b>,
    },
]