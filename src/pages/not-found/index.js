import { Button, Result } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className=''>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link to='/my-profile'>
                        <Button type="primary">Back Profile</Button>
                    </Link>
                }
            />
        </div>
    )
}

export default NotFound