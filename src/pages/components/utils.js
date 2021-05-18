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
    console.log(response)
}

const removeItemS3 = async (path, fileName) => {
    const response = await api.delete('content', {
        headers: { 'auth-token': token },
        data: { path, fileName }
    })
    return response
}

export { getParent, sendFolderS3, removeItemS3 };

