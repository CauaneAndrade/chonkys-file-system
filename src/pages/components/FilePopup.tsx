import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { handleDownload } from './utils';

export default function FilePopup({ isFileOpen, setIsFileOpen, fileData }) {
  const {thumbnailUrl, name, isDir} = fileData
  const handleClose = () => {
    setIsFileOpen(false);
  };

  const handleFileDownload = () => {
    handleDownload(thumbnailUrl, name)
  };

  const getUserTypeContent = () => {
      if (!isDir) {
          const l = name.split('.')
          return l[l.length - 1]
      }
  }

  return (
    <div>
      <Dialog open={isFileOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{name}</DialogTitle>
        <DialogContent>

aaa
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
          <Button onClick={handleFileDownload} color="primary">
            Baixar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
