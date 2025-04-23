import { Card } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { setTashkentTime } from '../../utils'

const TaskNewComment = (props) => {
    const { item, markAsRead } = props

    return (
        <Card
            type="inner"
            title={
                <>
                    <Link to={`/tasks?view=true&task_id=${item?.TaskId}`} className='text-[#00000060] text-[12px]'>Tasks &gt; {item?.TaskTitle}</Link>
                    <div className='mt-1'>{item?.Title}</div>
                </>
            }
            extra={!item?.IsRead ? <div onClick={() => markAsRead(item?.Id)}>Mark as Read</div> : null}
            style={{ width: '100%', cursor: 'pointer', transition: '0.2s', border: '1px solid #00000030' }}
            className='my-2 hover:shadow-lg'
        >
            <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                    <div className='w-[32px] h-[32px] bg-[#5714a7] text-[white] rounded-full flex items-center justify-center'>{item?.CommentedByUsername?.slice(0, 1)}</div>
                    <span className='ml-2'><b>{item?.CommentedByUsername}</b> commented: {item?.Comment}</span>
                </div>
                <span>{setTashkentTime(item?.CreatedAt)}</span>
            </div>
            <Card
                type="inner"
                className='mt-2'
                style={{ borderLeft: '3px solid #5714a7', borderBottom: '3px solid #5714a7' }}
            >
                {item?.Message}
            </Card>
        </Card>
    )
}

export default TaskNewComment