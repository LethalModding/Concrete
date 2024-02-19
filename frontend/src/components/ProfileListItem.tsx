import { useStore } from '@/store'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import EditIcon from '@mui/icons-material/Edit'
import PublishIcon from '@mui/icons-material/Publish'
import VisibleIcon from '@mui/icons-material/Visibility'
import InvisibleIcon from '@mui/icons-material/VisibilityOff'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useCallback } from 'react'

type Props = {
  detailed?: boolean
  draggable?: boolean
  onClickRename?: () => void
  profileID: string
}

export default function ProfileListItem(props: Props) {
  const { detailed, draggable, onClickRename, profileID } = props

  const profile = useStore(state =>
    state.profiles.find(x => x.id === profileID)
  )

  const addProfile = useStore(state => state.addProfile)
  const deleteProfile = useStore(state => state.deleteProfile)
  const updateProfile = useStore(state => state.updateProfile)

  const duplicateProfile = useCallback(() => {
    if (!profile) return

    addProfile({
      ...profile,
      id: undefined,
      name: `${profile.name} (Copy)`,
      owner: undefined,
      version: undefined,
      visible: true,
    })
  }, [addProfile, profile])

  const toggleProfileVisibility = useCallback(() => {
    if (!profile) return

    updateProfile(profile.id, {
      visible: !profile.visible,
    })
  }, [profile, updateProfile])

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `profile-${profile?.id || 'invalid'}`,
  })

  return (
    <>
      <Paper
        elevation={profile?.visible ? 2 : 0}
        key={profile?.id || 'invalid'}
        ref={setNodeRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          gap: 0.5,

          color: profile?.visible ? 'text.primary' : 'text.disabled',
          px: 1,
          py: 0.5,
          transform: CSS.Translate.toString(transform),
        }}
        {...listeners}
        {...attributes}
      >
        {profile ? (
          <>
            {draggable ? (
              <Tooltip title="Drag to Reorder">
                <DragIndicatorIcon sx={{ cursor: 'grab' }} />
              </Tooltip>
            ) : null}

            <Typography
              sx={{ mx: 1 }}
              variant="h5"
            >
              {profile.name}
            </Typography>

            {onClickRename ? (
              <Tooltip title="Rename">
                <IconButton onClick={onClickRename}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null}

            <Divider sx={{ mx: 'auto' }} />

            <Tooltip title="Duplicate">
              <IconButton onClick={duplicateProfile}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>

            {detailed ? (
              <>
                <Tooltip title={profile.visible ? 'Hide' : 'Show'}>
                  <IconButton onClick={toggleProfileVisibility}>
                    {profile.visible ? <VisibleIcon /> : <InvisibleIcon />}
                  </IconButton>
                </Tooltip>

                {/* TODO: PUBLISH */}
                <Tooltip title="Publish (Coming Soon)">
                  <IconButton disabled>
                    <PublishIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => deleteProfile(profile.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : null}
          </>
        ) : (
          <Typography variant="h5">Invalid Profile</Typography>
        )}
      </Paper>
    </>
  )
}
