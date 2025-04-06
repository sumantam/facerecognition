// SimpleDialog.js
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import UserFormContent from './user-form-content';

const AddUserDialog = ({ open, onClose, selectedValue }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md'>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <UserFormContent email={selectedValue} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
