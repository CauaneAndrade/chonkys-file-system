import axios from 'axios';
import {
    ChonkyActions, FileActionHandler, FullFileBrowser
} from 'chonky';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const api = axios.create({
    baseURL: 'http://localhost:3001/user/'
})
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY2F1YW5lQGdtYWlsLmNvbSIsImlkIjoiNjA5YWZhNmJkMTIyNDFlNTYwYTY5YmE5IiwiaWF0IjoxNjIwNzY5Mzg5fQ.AGREDrsns0BsYhKqpaYr4tgLp12tVzfTnV_iswsleSw'

function Dropzone(props) {
    const sendFile = async (file) => {
        const dataForm = new FormData();
        dataForm.append('file', file);
        const res = await fetch(`http://localhost:8001/upload`, {
            method: 'POST',
            body: dataForm,
        });
        const data = await res.json();
        console.log(data);
    };

    const onDrop = (acceptedFiles) => {
        const name = acceptedFiles[0].name
        const path = props.path()
        props.func(name, path)
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

const VFSBrowser: React.FC = (props) => {
    const [fileMap, setFileMap] = useState({})
    const [files, setFile] = useState([])
    const [folderChain, setFolderChain] = useState([])
    const [currentFolderId, setCurrentFolderId] = useState('')

    useEffect(() => {
        async function apiCall() {
            const response = await api.get('abacate', {
                headers: { 'auth-token': token }
            })
            const data = response.data
            const rootFolderId = data.rootFolderId
            const fM = data.fileMap; setFileMap(fM)
            const currentFolder = fM[rootFolderId];
            setCurrentFolderId(rootFolderId); setFolderChain([currentFolder])
            const childrenIds = currentFolder.childrenIds!;
            const files = childrenIds.map((fileId: string) => fM[fileId]); setFile(files)
        }
        apiCall()
    }, [null])

    const fileActions = [
        ChonkyActions.CreateFolder,
        ChonkyActions.DownloadFiles,
        ChonkyActions.DeleteFiles
    ]
    const handleAction: FileActionHandler = (data) => {
        if (data.id === ChonkyActions.OpenFiles.id && data.payload.targetFile['isDir']) {
            const targetFile = data.payload.targetFile
            const currentFolder = fileMap[targetFile['id']];
            const childrenIds = currentFolder.childrenIds!;
            const files = childrenIds.map((fileId: string) => fileMap[fileId]);
            setFile(files); setCurrentFolderId(currentFolder['id']);
            setFolderChain((currentFileMap) => {
                let newCurrentFileMap = [...currentFileMap]
                if (newCurrentFileMap.includes(targetFile)) {
                    newCurrentFileMap.pop(); newCurrentFileMap.pop() // não sei o porquê, mas assim funciona
                }
                return [...newCurrentFileMap, targetFile]
            })
        } else if (data.id === ChonkyActions.DeleteFiles.id) {
            const newFileMap = { ...fileMap };
            data.state.selectedFiles.forEach((file) => {
                delete newFileMap[file.id]; // Delete file from the file map.
                const parentId = file.parentId
                if (parentId) {
                    const parent = newFileMap[parentId]!;
                    const newChildrenIds = parent.childrenIds!.filter(
                        (id) => id !== file.id
                    );
                    newFileMap[parentId] = {
                        ...parent,
                        childrenIds: newChildrenIds,
                        childrenCount: newChildrenIds.length,
                    };
                }
            });
            setFileMap(newFileMap)
            const childrenIds = newFileMap[currentFolderId].childrenIds!;
            const newFiles = childrenIds.map((fileId: string) => newFileMap[fileId]); setFile(newFiles)
        } else if (data.id === ChonkyActions.CreateFolder.id) {
            const folderName = prompt('digite o nome da pasta:');
            if (folderName) {
                const newFileMap = { ...fileMap };
                const newFolderId = `new-folder-${Math.random()}`;
                newFileMap[newFolderId] = {
                    id: newFolderId,
                    name: folderName,
                    isDir: true,
                    modDate: new Date(),
                    parentId: currentFolderId,
                    childrenIds: [],
                    childrenCount: 0,
                };

                // Update parent folder to reference the new folder.
                const parent = newFileMap[currentFolderId];
                const newChildren = [...parent.childrenIds!, newFolderId]
                newFileMap[currentFolderId] = {
                    ...parent,
                    childrenIds: newChildren,
                    childrenCount: newChildren.length
                };
                const childrenIds = newFileMap[currentFolderId].childrenIds!;
                const files = childrenIds.map((fileId: string) => newFileMap[fileId]);
                setFileMap(newFileMap)
                setFile(files)
            }
        }
    };
    function setItemFileMap(folderName, currentFolderIdTest) {
        const newFileMap = { ...fileMap };
        const newFolderId = `new-file-test-${Math.random()}`;
        newFileMap[newFolderId] = {
            id: newFolderId,
            name: folderName,
            isDir: false,
            modDate: new Date(),
            parentId: currentFolderIdTest,
        };
        // Update parent folder to reference the new folder.
        const parent = newFileMap[currentFolderIdTest];
        const newChildren = [...parent.childrenIds!, newFolderId]
        newFileMap[currentFolderIdTest] = {
            ...parent,
            childrenIds: newChildren,
            childrenCount: newChildren.length
        };
        const childrenIds = newFileMap[currentFolderIdTest].childrenIds!;
        const files = childrenIds.map((fileId: string) => newFileMap[fileId]);
        setFileMap(newFileMap); setFile(files)
    }
    function path() {
        return currentFolderId
    }
    return (
        <>
            <div style={{ height: 350 }}>
                <Dropzone path={path} func={setItemFileMap} />
                <FullFileBrowser
                    files={files}
                    folderChain={folderChain}
                    fileActions={fileActions}
                    onFileAction={handleAction}
                    {...props}
                />
            </div>
        </>
    );
};

const ComponenteFinal: React.FC = () => {
    return (
        <div>
            <VFSBrowser />
        </div>
    );
};

export default ComponenteFinal
