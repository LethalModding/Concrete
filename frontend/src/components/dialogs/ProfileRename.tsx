import { type Profile } from '@/store'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useCallback, useEffect, useState, type ChangeEvent } from 'react'

type Props = {
  onCancel: () => void
  onClose: () => void
  onSubmit: (name: string) => void
  open: boolean
  profile: Profile
}

export default function ProfileRenameDialog(props: Props) {
  const { onClose, onCancel, onSubmit, open, profile } = props

  const [name, setName] = useState(profile.name)
  useEffect(() => {
    // Reset the name when the profile changes
    setName(profile.name)

    // Focus the input when the dialog opens
    if (open) {
      document.getElementById('profile-rename-input')?.focus()
    }
  }, [open, profile.name])

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
    >
      <DialogTitle>Rename Profile</DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          id="profile-rename-input"
          label="New Profile Name"
          margin="normal"
          onChange={handleChangeName}
          placeholder={profile.name}
          value={name}
        />
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleClickRename}
        >
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  )
}
