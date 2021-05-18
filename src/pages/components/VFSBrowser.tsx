import {
    ChonkyActions,
    FileActionHandler,
    FullFileBrowser
} from 'chonky';
import React, { useEffect, useState } from 'react';
import api from '../../api';
import CustomDropzone from './Dropzone/Dropzone';
import { getToken } from './Login/UseToken';
import { getParent, removeItemS3, sendFolderS3 } from './utils';

const token = getToken()

const VFSBrowser: React.FC = (props) => {
    const [fileMap, setFileMap] = useState({})
    const [files, setFile] = useState([])
    const [folderChain, setFolderChain] = useState([])
    const [currentFolderId, setCurrentFolderId] = useState('')
    useEffect(() => {
        async function apiCall() {
            const response = await api.get('content', {
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
    }, [null]) // chamado apenas uma

    async function removeFiles(data) {
        const newFileMap = { ...fileMap };
        const path = await getParent(currentFolderId, fileMap)
        data.state.selectedFiles.forEach(async (file) => {
            const fileRemoved = await removeItemS3(path, file.name)
            if (fileRemoved.data.response) {
                delete newFileMap[file.id]; // Delete file from the file map.
                const parentId = file.parentId
                if (parentId) {
                    const parent = newFileMap[parentId]!;
                    const newChildrenIds = parent.childrenIds!.filter((id) => id !== file.id);
                    newFileMap[parentId] = {
                        ...parent,
                        childrenIds: newChildrenIds,
                        childrenCount: newChildrenIds.length,
                    };
                }
            }
            await setFileMap(newFileMap)
            const childrenIds = newFileMap[currentFolderId].childrenIds!;
            const newFiles = childrenIds.map((fileId: string) => newFileMap[fileId]);
            await setFile(newFiles)
        });
    }

    async function createFolder(folderName) {
        const newFileMap = { ...fileMap };
        const newFolderId = `new-folder-${Math.random()}`;
        const parent = newFileMap[currentFolderId];
        newFileMap[newFolderId] = {
            id: newFolderId,
            name: folderName,
            isDir: true,
            modDate: new Date(),
            parentId: parent['name'],
            childrenIds: [],
            childrenCount: 0,
        };

        // Update parent folder to reference the new folder.
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
        const path = await getParent(currentFolderId, fileMap)
        await sendFolderS3(folderName, path)
    }

    function setCurrentPathFolder(data) {
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
    }

    const handleAction: FileActionHandler = async (data) => {
        if (data.id === ChonkyActions.OpenFiles.id && data.payload.targetFile['isDir']) {
            setCurrentPathFolder(data)
        } else if (data.id === ChonkyActions.DeleteFiles.id) {
            removeFiles(data)
        } else if (data.id === ChonkyActions.CreateFolder.id) {
            const folderName = prompt('digite o nome da pasta:');
            if (folderName) { createFolder(folderName) }
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

    function getCurrentFolder() { return currentFolderId }
    function getFileMap() { return fileMap }

    const fileActions = [
        ChonkyActions.CreateFolder,
        ChonkyActions.DownloadFiles,
        ChonkyActions.DeleteFiles
    ]
    return (
        <>
            <div style={{ height: 350 }}>
                <CustomDropzone path={getCurrentFolder} func={setItemFileMap} fileMap={getFileMap} token={token} />
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

export default VFSBrowser
