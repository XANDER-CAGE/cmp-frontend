import { Button, Result } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const Forbidden = () => {
  return (
    <div className=''>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you don't have permission to access this page."
        extra={
          <Link to='/my-profile'>
            <Button type="primary">Back Profile</Button>
          </Link>
        }
      />
    </div>
  )
}

export default Forbidden