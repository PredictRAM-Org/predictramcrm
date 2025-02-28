import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

function ImageViewModal({ msg, src, open, alt, handleClose }) {
  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
      {msg && <DialogTitle>{msg}</DialogTitle>}
      <DialogContent>
        <img alt={alt} src={src} />
      </DialogContent>
    </Dialog>
  );
}

export default ImageViewModal;
