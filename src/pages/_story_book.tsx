import axios from 'axios';
import {
    ChonkyActions,
    ChonkyFileActionData,
    FileArray,
    FileBrowserProps,
    FileData,
    FileHelper,
    FullFileBrowser
} from 'chonky';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const api = axios.create({
    baseURL: 'http://localhost:3001/user/'
})

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY2F1YW5lQGdtYWlsLmNvbSIsImlkIjoiNjA5YWZhNmJkMTIyNDFlNTYwYTY5YmE5IiwiaWF0IjoxNjIwNzY5Mzg5fQ.AGREDrsns0BsYhKqpaYr4tgLp12tVzfTnV_iswsleSw'

interface CustomFileData extends FileData {
    parentId?: string;
    childrenIds?: string[];
}
interface CustomFileMap {
    [fileId: string]: CustomFileData;
}

async function apiT() {
    const api = axios.create({
        baseURL: 'http://localhost:3001/user/'
    })
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY2F1YW5lQGdtYWlsLmNvbSIsImlkIjoiNjA5YWZhNmJkMTIyNDFlNTYwYTY5YmE5IiwiaWF0IjoxNjIwNzY5Mzg5fQ.AGREDrsns0BsYhKqpaYr4tgLp12tVzfTnV_iswsleSw'
    const response = await api.get('abacate', {
        headers: { 'auth-token': token }
    })
    return response.data
}

const prepareCustomFileMap = () => {
    // const [baseFileMap, setBaseFileMap] = useState({})
    // const [rootFolderId, setRootFolderId] = useState()

    // useEffect(() => {
    //     api.get('abacate', {
    //         headers: { 'auth-token': token }
    //     }).then(response => {
    //         setRootFolderId(response.data.rootFolderId)
    //         setBaseFileMap((response.data.fileMap as unknown) as CustomFileMap)
    //     })
    // }, [])

    const DemoFsMapMock = {
        "rootFolderId": "609bc2659453724cd08f2693",
        "fileMap": {
          "609bc2659453724cd08f2693": {
            "id": "609bc2659453724cd08f2693",
            "name": "7f9b921d9ba0a8162bc6b0998d7dc05043da12a5",
            "isDir": true,
            "childrenIds": [
              "609bc2659453724cd08f2691",
              "609bc2659453724cd08f2692",
              "609bc2659453724cd08f268f"
            ],
            "childrenCount": 3
          },
          "609bc2659453724cd08f2691": {
            "id": "609bc2659453724cd08f2691",
            "name": "pasta1",
            "isDir": true,
            "childrenIds": [
              "609bc2659453724cd08f2690"
            ],
            "childrenCount": 1,
            "parentId": "609bc2659453724cd08f2693"
          },
          "609bc2659453724cd08f2690": {
            "id": "609bc2659453724cd08f2690",
            "name": "pasta1_1",
            "isDir": true,
            "childrenIds": [],
            "childrenCount": 0,
            "parentId": "609bc2659453724cd08f2691"
          },
          "609bc2659453724cd08f2692": {
            "id": "609bc2659453724cd08f2692",
            "name": "pasta2",
            "isDir": true,
            "childrenIds": [],
            "childrenCount": 0,
            "parentId": "609bc2659453724cd08f2693"
          },
          "609bc2659453724cd08f268f": {
            "id": "609bc2659453724cd08f268f",
            "name": "7f9b921d9ba0a8162bc6b0998d7dc05043da12a5",
            "parentId": "609bc2659453724cd08f2693"
          }
        }
      }

    const baseFileMap = (DemoFsMapMock.fileMap as unknown) as CustomFileMap;
    const rootFolderId = DemoFsMapMock.rootFolderId;
    return { baseFileMap, rootFolderId };
};

const useCustomFileMap = () => {
    const { baseFileMap, rootFolderId } = prepareCustomFileMap()

    // Setup the React state for our file map and the current folder.
    const [fileMap, setFileMap] = useState(baseFileMap);
    const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);

    const currentFolderIdRef = useRef(currentFolderId);
    useEffect(() => {
        currentFolderIdRef.current = currentFolderId;
    }, [currentFolderId]);

    const idCounter = useRef(0);
    const createFolder = useCallback((folderName: string) => {
        setFileMap((currentFileMap) => {
            const newFileMap = { ...currentFileMap };

            // Create the new folder
            const newFolderId = `new-folder-${idCounter.current++}`;
            newFileMap[newFolderId] = {
                id: newFolderId,
                name: folderName,
                isDir: true,
                modDate: new Date(),
                parentId: currentFolderIdRef.current,
                childrenIds: [],
                childrenCount: 0,
            };

            // Update parent folder to reference the new folder.
            const parent = newFileMap[currentFolderIdRef.current];
            newFileMap[currentFolderIdRef.current] = {
                ...parent,
                childrenIds: [...parent.childrenIds!, newFolderId],
            };
            return newFileMap;
        });
    }, []);

    return {
        fileMap,
        currentFolderId,
        setCurrentFolderId,
        createFolder,
    };
};

export const useFiles = (
    fileMap: CustomFileMap,
    currentFolderId: string
): FileArray => {
    return useMemo(() => {
        const currentFolder = fileMap[currentFolderId];
        const childrenIds = currentFolder.childrenIds!;
        const files = childrenIds.map((fileId: string) => fileMap[fileId]);
        return files;
    }, [currentFolderId, fileMap]);
};

export const useFolderChain = (
    fileMap: CustomFileMap,
    currentFolderId: string
): FileArray => {
    return useMemo(() => {
        const currentFolder = fileMap[currentFolderId];

        const folderChain = [currentFolder];

        let parentId = currentFolder.parentId;
        while (parentId) {
            const parentFile = fileMap[parentId];
            if (parentFile) {
                folderChain.unshift(parentFile);
                parentId = parentFile.parentId;
            } else {
                break;
            }
        }

        return folderChain;
    }, [currentFolderId, fileMap]);
};

export const useFileActionHandler = (
    setCurrentFolderId: (folderId: string) => void,
    createFolder: (folderName: string) => void
) => {
    return useCallback(
        (data: ChonkyFileActionData) => {
            if (data.id === ChonkyActions.OpenFiles.id) {
                const { targetFile, files } = data.payload;
                const fileToOpen = targetFile ?? files[0];
                if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
                    setCurrentFolderId(fileToOpen.id);
                    return;
                }
            } else if (data.id === ChonkyActions.CreateFolder.id) {
                const folderName = prompt('digite o nome da nova pasta:');
                if (folderName) createFolder(folderName);
            }
        },
        [createFolder, setCurrentFolderId]
    );
};

export type VFSProps = Partial<FileBrowserProps>;

export const VFSBrowser: React.FC<VFSProps> = (props) => {
    const {
        fileMap,
        currentFolderId,
        setCurrentFolderId,
        createFolder,
    } = useCustomFileMap();
    const files = useFiles(fileMap, currentFolderId); // []
    const folderChain = useFolderChain(fileMap, currentFolderId); // []
    const handleFileAction = useFileActionHandler(
        setCurrentFolderId,
        createFolder
    );
    const fileActions = [ChonkyActions.CreateFolder]
    return (
        <>
            <div style={{ height: 350 }}>
                <FullFileBrowser
                    files={files}
                    folderChain={folderChain}
                    fileActions={fileActions}
                    onFileAction={handleFileAction}
                    {...props}
                />
            </div>
        </>
    );
};
