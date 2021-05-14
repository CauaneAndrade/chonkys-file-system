import { useDropzone } from 'react-dropzone';
import api from '../../api';
import getParent from './utils';

function CustomDropzone(props) {
    const sendFile = async (file, path) => {
        const dataForm = new FormData();
        dataForm.append('file', file, file.name)
        dataForm.append('path', path)
        const response = await api
            .post('content/file', dataForm, { headers: { 'auth-token': props.token } })
        return response
    };

    const onDrop = async (acceptedFiles) => {
        const currentPath = props.path()
        const name = acceptedFiles[0].name // only one file at time
        const fileMap = await props.fileMap()
        const finalPath = await getParent(currentPath, fileMap, [])
        await sendFile(acceptedFiles[0], finalPath.reverse().join('/'))
        props.func(name, currentPath)
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()} style={{
            boxShadow: 'inset rgba(49, 63, 190, 0.6) 0 100px 0',
            lineHeight: '100px',
            textAlign: 'center',
            fontSize: '1.4em',
            marginBottom: 20,
            borderRadius: 4,
            color: '#ffffff',
            height: 100,
        }}>
        <input {...getInputProps()} />
        {
            isDragActive ?
            <p>Solte o arquivo aqui</p> :
            <p>Arraste e solte o arquivo aqui ou clique para selecionar um arquivo</p>
        }
        </div>
        )
}

export default CustomDropzone
