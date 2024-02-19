import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'
import { useCallback, useEffect, useState } from 'react'

import { GetConfig } from '@/../wailsjs/go/gui/App'

import { types } from '@/../wailsjs/go/models'
import Box from '@mui/material/Box'

type Props = {
  open: boolean
  onClose: () => void
}

export default function SettingsDialog(props: Props) {
  const { open, onClose } = props

  const [config, setConfig] = useState<types.Config | null>(null)
  useEffect(() => {
    GetConfig().then(setConfig)
  }, [])

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
      <DialogTitle>Settings</DialogTitle>

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
        <Box
          sx={{
            bgcolor: 'background.default',
            borderRadius: 1,
            px: 2,
          }}
        >
          <pre>
            Loopback Server Port:{`\t`}
            {config?.loopbackServerPort} <br />
            Library Path:{`\t\t`}
            {config?.libraryPath || '<empty string>'} <br />
            Steam Path:{`\t\t`}
            {config?.steamPath || '<empty string>'} <br />
          </pre>
        </Box>
        <DialogContentText>
          No settings yet (to change your Steam directory, restart the app.)
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={submitBugReport}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}
