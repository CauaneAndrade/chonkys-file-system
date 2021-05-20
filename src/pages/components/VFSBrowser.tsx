import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
    ChonkyActions, ChonkyIconName, defineFileAction, FileActionHandler, FileBrowser, FileContextMenu, FileList, FileNavbar, FileToolbar
} from 'chonky';
import React, { useEffect, useState } from 'react';
import api from '../../api';
import CustomDropzone from './Dropzone/Dropzone';
import FilePopup from './FilePopup';
import FormDialog from './FormRenameItem';
import { getToken } from './Login/UseToken';
import { getParent, handleDownload, removeItemS3, sendFolderS3 } from './utils';

const token = getToken()

const VFSBrowser: React.FC = (props) => {
  const [fileMap, setFileMap] = useState({})
  const [files, setFile] = useState([])
  const [folderChain, setFolderChain] = useState([])
  const [currentFolderId, setCurrentFolderId] = useState('')
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
  useEffect(() => {
    apiCall()
  }, [null]) // chamado apenas uma

  async function removeFiles(data) {
    const newFileMap = { ...fileMap };
    const path = await getParent(currentFolderId, fileMap)
    data.state.selectedFiles.forEach(async (file) => {
      const fileRemoved = await removeItemS3(path, file.name)
      if (fileRemoved.data.data) {
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

  const checkItemNameExists = async (parentId, name) => {
    var hasElement = []
    await fileMap[parentId].childrenIds.forEach((element) => {
        if (fileMap[element]['name'] == name) {
            hasElement.push(true)
        }
    });
    return hasElement.length !== 0
  }

  async function createFolder(folderName) {
    const newFileMap = { ...fileMap };
    const parent = newFileMap[currentFolderId];
    const newFolderId = parent['id'] + folderName + '/'

    if (newFileMap[newFolderId]) {
      setError(true)
      return;
    }
    newFileMap[newFolderId] = {
      id: newFolderId,
      name: folderName,
      isDir: true,
      modDate: new Date(),
      parentId: parent['id'],
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
    await setFileMap(newFileMap)
    await setFile(files)
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

  const renameItem = defineFileAction({
    id: 'rename_item_name',
    requiresSelection: true,
    button: {
      name: 'Renomear',
      contextMenu: true,
      icon: ChonkyIconName.word,
    },
  })

  const handleAction: FileActionHandler = async (data) => {
    if (data.id === ChonkyActions.OpenFiles.id && data.payload.targetFile['isDir']) {
      setCurrentPathFolder(data)
    } else if (data.id === ChonkyActions.DeleteFiles.id) {
      removeFiles(data)
    } else if (data.id === ChonkyActions.CreateFolder.id) {
      const folderName = prompt('digite o nome da pasta:');
      if (folderName) { createFolder(folderName) }
    } else if (data.id === ChonkyActions.OpenFiles.id) {
      await setFileData(data.payload.targetFile)
      setIsFileOpen(true)
    } else if (data.id === ChonkyActions.DownloadFiles.id) {
      console.log(data)
      const file = data.state.contextMenuTriggerFile;
      if (file.isDir) return;
      handleDownload("https://uploads.codesandbox.io/uploads/user/0a499576-5ab0-407d-83b1-2a35fc1cbc34/EnCy-Anj.png", 'test.png')
      // handleDownload(file.thumbnailUrl, file.name)
    } else if (data.id === renameItem.id) {
      await setIsFormOpen(true)
      await setFileData(data.state.contextMenuTriggerFile)
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
    ChonkyActions.DeleteFiles,
    ChonkyActions.OpenFiles,
    ChonkyActions.EnableGridView,
    ChonkyActions.EnableListView,
    ChonkyActions.SortFilesByName,
    renameItem
  ]
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [error, setError] = useState(false);
  const [fileData, setFileData] = useState({});

  const handleFileExists = () => {
    setError(!error);
  };

  return (
    <>
      <Dialog open={error} onClose={handleFileExists} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Tente novamente</DialogTitle>
        <DialogContent>
          item com o mesmo nome já existe
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFileExists} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <FilePopup isFileOpen={isFileOpen} setIsFileOpen={setIsFileOpen} fileData={fileData} />
      <FormDialog isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} fileData={fileData} checkItemNameExists={checkItemNameExists} handleFileExists={handleFileExists} />
      <div style={{ height: 550 }}>
        <FileBrowser
          files={files}
          folderChain={folderChain}
          fileActions={fileActions}
          onFileAction={handleAction}
          disableDefaultFileActions={true}
          {...props}
        >
          <FileToolbar />
          <CustomDropzone path={getCurrentFolder} func={setItemFileMap} fileMap={getFileMap} token={token} />
          <FileNavbar />
          <FileList />
          <FileContextMenu />
        </FileBrowser>

      </div>
    </>
  );
};

export default VFSBrowser
