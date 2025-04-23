import { Progress, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { FiUpload } from 'react-icons/fi'
import { BASE_URL } from '../../constants'
import http from '../../utils/axiosInterceptors'

const UploadFile = (props) => {
    const { onSuccess: onSuccessEvent, onError: onErrorEvent, defaultFile, uploadPath, accept, multiple, fileKeyName } = props

    const [progress, setProgress] = useState(0)
    const [fileList, setFileList] = useState([])

    useEffect(() => {
        if (fileList.length === 0 && onSuccessEvent) onSuccessEvent(null)
    }, [fileList, onSuccessEvent])

    useEffect(() => {
        setFileList(
            defaultFile
                ? [
                    {
                        uid: '1',
                        name: 'rasm',
                        status: 'done',
                        url: `${BASE_URL}${defaultFile}`,
                    },
                ]
                : [],
        )
        if (onSuccessEvent) onSuccessEvent(defaultFile ? { name: '', uploadPath: 'public/' + defaultFile } : null)

    }, [defaultFile, onSuccessEvent])

    const uploadImage = async (options) => {
        const { onSuccess, onError, file, onProgress } = options

        const fmData = new FormData()

        fmData.append(fileKeyName || 'file', file)
        try {
            const res = await http({
                method: 'post',
                url: uploadPath,
                data: fmData,
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (event) => {
                    const percent = Math.floor((event.loaded / event.total) * 100)
                    setProgress(percent)
                    if (percent === 100) {
                        setTimeout(() => setProgress(0), 1000)
                    }
                    onProgress({ percent: (event.loaded / event.total) * 100 })
                },
            })

            onSuccess('Ok')
            if (onSuccessEvent) onSuccessEvent(res?.data || {})
        } catch (err) {
            const error = new Error('Some error')
            console.log(error)
            onError({ err })
            if (onErrorEvent) onErrorEvent({ err } || { err: 'Error' })
        }
    }

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList)
        if (onSuccessEvent && newFileList.length === 0) onSuccessEvent(null)
    }

    return (
        <div>
            <Upload
                accept={accept}
                customRequest={uploadImage}
                listType="picture-card"
                onChange={handleChange}
                fileList={fileList}
                multiple={multiple}
            >
                {fileList.length === 0 && (
                    <div className={'flex items-center'}>
                        <FiUpload className={'mr-1'} /> Upload
                    </div>
                )}
            </Upload>
            {progress > 0 ? <Progress percent={progress} /> : null}
        </div>
    )
}

export default UploadFile