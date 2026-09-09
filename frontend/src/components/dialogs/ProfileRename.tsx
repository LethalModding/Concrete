import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { type ChangeEvent, useCallback, useEffect, useId, useState } from 'react'
import type { Profile } from '@/store'

type Props = {
  onCancel: () => void
  onClose: () => void
  onSubmit: (name: string) => void
  open: boolean
  profile: Profile
}

export default function ProfileRenameDialog(props: Props) {
  const { onClose, onCancel, onSubmit, open, profile } = props

  const inputId = useId()
  const [name, setName] = useState(profile.name)
  useEffect(() => {
    // Focus the input when the dialog opens
    if (open) {
      document.getElementById(inputId)?.focus()
    }
  }, [inputId, open])

  const handleChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    if (value.length > 64) {
      value = value.slice(0, 64)
    }

    setName(value)
  }, [])

  const handleClickRename = useCallback(() => {
    onSubmit(name.trim())
  }, [name, onSubmit])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle>Rename Profile</DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          id={inputId}
          label="New Profile Name"
          margin="normal"
          onChange={handleChangeName}
          placeholder={profile.name}
          value={name}
        />
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleClickRename}>
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  )
}
