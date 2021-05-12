import axios from 'axios';
import {
    ChonkyActions,
    FileBrowser, FileContextMenu, FileList, FileNavbar,
    FileToolbar
} from 'chonky';
import React, { useEffect, useMemo, useState } from 'react';

const api = axios.create({
    baseURL: 'http://localhost:3001/user/'
})

const MyFileBrowser = () => {
    const [files, setFiles] = useState([{ id: '', name: '', isDir: true, thumbnailUrl: '' }]);

    useEffect(() => {
        async function setUploaded() {
            const response = await api.request({
                method: 'GET',
                url: 'content',
                headers: { 'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY2F1YW5lQGdtYWlsLmNvbSIsImlkIjoiNjA5OWIyYzk3M2Y1MzJjNjc0YWRlN2JhIiwiaWF0IjoxNjIwNjg1NTE1fQ.KiDEJW-6OR-bHIYbr4y_NAfd79wa8Oh51bo7XZzAa5c' }
            })
            setFiles(response.data.data)
        }
        setUploaded()
    }, [])
    const folderChain = [{ id: 'xcv', name: 'Demo', isDir: true }];
    const fileActions = useMemo(
        () => [ChonkyActions.CreateFolder, ChonkyActions.DeleteFiles],
        []
    );

    return (
        <div style={{ height: 300 }}>
            <FileBrowser files={files} folderChain={folderChain} fileActions={fileActions}>
                <FileNavbar />
                <FileToolbar />
                <FileList />
                <FileContextMenu />
            </FileBrowser>
        </div>
    );
};

export default MyFileBrowser
