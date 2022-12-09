import { Dialog, Button, DialogTitle, DialogActions, DialogContent } from '@mui/material';

export default function Modal(props) {
  const { onOpen, onClose, title, content, action } = props;
  return (
    <Dialog fullWidth maxWidth="xs" open={onOpen} onClose={onClose}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
        {action}
      </DialogActions>
    </Dialog>
  );
}
