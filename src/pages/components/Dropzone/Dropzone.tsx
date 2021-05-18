import { useDropzone } from 'react-dropzone';
import api from '../../../api';
import { getParent } from '../utils';
import { DropContainer } from './styles';

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
        const finalPath = await getParent(currentPath, fileMap)
        const resp = await sendFile(acceptedFiles[0], finalPath)
        if (resp.data['data']) props.func(name, currentPath)
        else alert('já existe um arquivo com o mesmo nome nesta pasta')
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <DropContainer>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Solte o arquivo aqui</p> :
                        <p>Arraste o arquivo aqui ou clique para selecionar</p>
                }
            </div>
        </DropContainer>
    )
}

export default CustomDropzone
