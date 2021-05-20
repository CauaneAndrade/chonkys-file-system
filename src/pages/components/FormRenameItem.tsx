import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { changeFileName } from './utils';

export default function FormDialog({ isFormOpen, setIsFormOpen, fileData, checkItemNameExists, handleFileExists }) {
    const { isDir, name, parentId } = fileData
    const [error, setError] = useState(false)
    const handleClose = () => {
        setIsFormOpen(false);
    };

    const handleError = () => {
        setError(!error);
    };

    const checkIsDir = (fileName) => {
        if (!isDir) {
            const fileNameList = fileName.split('.')
            return `.${fileNameList[fileNameList.length - 1]}`
        } else return '/';
    }

    const handleRenameItem = async () => {
        const fileType = checkIsDir(name)
        const currentFilePath = `${parentId}${name}${isDir ? '/' : ''}`
        const inputValue = (document.getElementById('name') as HTMLInputElement).value;
        const exists = await checkItemNameExists(parentId, `${isDir ? inputValue : inputValue + fileType}`)
        if (exists) {
            handleFileExists(); return;
        }

        if (inputValue.includes('/')) {
            handleError(); return;
        }
        const newFileName = inputValue + fileType
        await changeFileName(currentFilePath, newFileName)
        setIsFormOpen(false)
        window.location.reload()
    };

    return (
        <div>
            <Dialog open={error} onClose={handleError} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Tente novamente</DialogTitle>
                <DialogContent>
                    Não é permitido usar '/'
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleError} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isFormOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Renomear</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={name}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleRenameItem} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
