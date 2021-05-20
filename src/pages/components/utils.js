import axios from 'axios';
import fileDownload from 'js-file-download';
import api from '../../api';
import { getToken } from './Login/UseToken';

const token = getToken()

function getParent(currentPath, fileMap) {
    const currentObj = fileMap[currentPath]
    return currentObj['id']
}

const sendFolderS3 = async (name, path) => {
    const dataForm = { name, path }
    const response = await api.post('content/folder', dataForm, {
        headers: { 'auth-token': token }
    })
}

const removeItemS3 = async (path, fileName) => {
    const response = await api.delete('content', {
        headers: { 'auth-token': token },
        data: { path, fileName }
    })
    return response
}

const handleDownload = (url, filename) => {
    axios
        .get(url, {
            responseType: 'blob'
        })
        .then((res) => {
            fileDownload(res.data, filename)
        })
}

const changeFileName = async (path, newName) => {
    const dataForm = { path, newName }
    const response = await api.post('content/update', dataForm, {
        headers: { 'auth-token': token }
    })
}

export { getParent, sendFolderS3, removeItemS3, handleDownload, changeFileName };

