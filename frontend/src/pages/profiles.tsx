import ProfileListItem from '@/components/ProfileListItem'
import ProfileRenameDialog from '@/components/dialogs/ProfileRename'
import { useStore, type Profile } from '@/store'
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import AddIcon from '@mui/icons-material/Add'
import BackIcon from '@mui/icons-material/ArrowBack'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

export default function ProfilesPage() {
  const [editing, setEditing] = useState<Profile | null>(null)
  const handleCancelRename = useCallback(() => {
    setEditing(null)
  }, [])

  const updateProfile = useStore(state => state.updateProfile)
  const handleSubmitRename = useCallback(
    (name: string) => {
      if (editing === null) return

      setEditing(null)
      updateProfile(editing.id, {
        name,
      })
    },
    [editing, updateProfile]
  )

  //
  // Drag and Drop
  //

  const reorderProfile = useStore(state => state.reorderProfile)
  const sortedProfiles = useStore(state => state.profiles).sort((a, b) => {
    if (a.order < b.order) return -1
    if (a.order > b.order) return 1
    return 0
  })

  const addProfile = useStore(state => state.addProfile)
  const handleClickAdd = useCallback(() => {
    const n = sortedProfiles.length + 1

    addProfile({
      name: `Profile ${n}`,
      order: n,
      visible: true,
    })
  }, [addProfile, sortedProfiles])

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      if (!e.active) return

      const sourceId = e.active.id.toString().split('profile-')[1]
      const sourceIndex = sortedProfiles.findIndex(x => x.id === sourceId)

      const delta = e.delta.y / 75
      const targetIndex = Math.max(
        0,
        Math.min(sortedProfiles.length - 1, sourceIndex + delta)
      )

      reorderProfile(sourceIndex, targetIndex)
    },
    [sortedProfiles, reorderProfile]
  )

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  })

  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor)

  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
    pointerSensor
  )

  //
  // Navigation
  //

  const router = useRouter()
  const navigateHome = useCallback(() => {
    router.push('/dashboard')
  }, [router])

  return (
    <>
      <ProfileRenameDialog
        onCancel={handleCancelRename}
        onClose={handleCancelRename}
        onSubmit={handleSubmitRename}
        open={editing !== null}
        profile={editing || ({ id: '', name: '' } as Profile)}
      />

      <Paper
        sx={{
          borderRadius: 0,
          p: 2,
          pb: 1.5,
        }}
      >
        <Typography variant="h4">
          <Tooltip title="Back to Dashboard">
            <IconButton
              onClick={navigateHome}
              sx={{ mr: 1.5, mt: -0.5 }}
            >
              <BackIcon />
            </IconButton>
          </Tooltip>
          Profile Management
        </Typography>
      </Paper>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          mx: 1,
          mt: 1,
        }}
      >
        <Button
          color="primary"
          fullWidth
          onClick={handleClickAdd}
          size="large"
          startIcon={<AddIcon />}
          variant="contained"
        >
          Create New
        </Button>

        <Button
          color="primary"
          fullWidth
          size="large"
          startIcon={<ImportExportIcon />}
          variant="contained"
        >
          Import / Export
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: 1,
          m: 1,
          overflowX: 'hidden',
        }}
      >
        <DndContext
          autoScroll
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          {sortedProfiles.map(x => (
            <ProfileListItem
              detailed
              draggable
              key={x.id}
              onClickRename={() => setEditing(x)}
              profileID={x.id}
            />
          ))}
        </DndContext>
      </Box>
    </>
  )
}
