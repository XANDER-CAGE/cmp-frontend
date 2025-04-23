import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants';

const token = Cookies.get('acces_token') ?? null

class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
        this.url = `${BASE_URL}InvoiceEmailTemplate/upload-image`;
    }
    upload() {
        return new Promise((resolve, reject) => {
            this.loader.file.then((file) => {
                this._initRequest();
                this._initListeners(resolve, reject);
                this._sendRequest(file);
            });
        });
    }

    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    _initRequest() {
        const xhr = (this.xhr = new XMLHttpRequest());
        xhr.open('POST', this.url, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Authorization', `Bearer` + { token });
    }

    _initListeners(resolve, reject) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${loader.file.name}.`;

        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;

            if (!response || !response.success) {
                return reject(response && response.error ? response.error : genericErrorText);
            }
            resolve({
                default: response.data,
            });
        });

        if (xhr.upload) {
            xhr.upload.addEventListener('progress', (evt) => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    _sendRequest(file) {
        const data = new FormData();
        data.append('file', file);
        this.xhr.send(data);
    }
}

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

const editorConfiguration = {
    extraPlugins: [MyCustomUploadAdapterPlugin],
};

function CustomEditor(props) {
    const { onChange, data } = props;

    return (
        <CKEditor
            editor={Editor}
            config={editorConfiguration}
            data={data}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange({ event, editor, data });
            }}
        />
    );
}

export default CustomEditor;
