import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useCallback } from 'react'

type Props = {
  open: boolean
  onClose: () => void
}

export default function BugReportDialog(props: Props) {
  const { open, onClose } = props

  const submitBugReport = useCallback(() => {
    //!! TODO: Implement
    onClose()
  }, [onClose])

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { bgcolor: 'rgba(0, 0, 0, 0.75)' },
        },
      }}
      TransitionComponent={Grow}
    >
      <DialogTitle>Bug Report</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={onClose}
        size="small"
        sx={{
          color: 'text.secondary',
          position: 'absolute',
          right: 16,
          top: 16,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent
        dividers
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <DialogContentText>
          It looks like you&apos;ve found a bug! Please fill out the form below
          to report the issue. We&apos;ll do our best to fix it as soon as
          possible.
        </DialogContentText>

        <TextField
          autoFocus
          fullWidth
          label="What were you doing when the bug occurred?"
          multiline
          rows={1}
          variant="filled"
        />

        <TextField
          fullWidth
          label="What did you expect to happen?"
          multiline
          rows={1}
          variant="filled"
        />

        <TextField
          fullWidth
          label="What actually happened?"
          multiline
          rows={1}
          variant="filled"
        />

        <Divider />

        <TextField
          fullWidth
          label="Additional Information (optional)"
          multiline
          rows={1}
          variant="filled"
        />
      </DialogContent>

      <DialogActions>
        <FormControlLabel
          control={<Checkbox color="primary" />}
          label="Include Screenshot"
          sx={{ ml: 0, mr: 'auto' }}
        />
        <Button onClick={submitBugReport}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}
