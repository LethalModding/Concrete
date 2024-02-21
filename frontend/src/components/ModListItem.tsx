import { useStore } from '@/store'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import { useCallback, useMemo } from 'react'

type Props = {
  detailed?: boolean
  draggable?: boolean
  imageSize: number
  modID: string
  profileID: string
}

export default function ModListItem(props: Props) {
  const { detailed, draggable, imageSize, profileID } = props

  const profile = useStore(state =>
    state.profiles.find(x => x.id === profileID)
  )

  const updateProfile = useStore(state => state.updateProfile)
  const deleteMod = useCallback(
    (modID: string) => {
      if (!profile) return

      updateProfile(profile.id, {
        enabledMods: profile.enabledMods.filter(x => x !== modID),
        disabledMods: profile.disabledMods?.filter(x => x !== modID) || [],
      })
    },
    [profile, updateProfile]
  )

  const mod = useStore(state => state.mods.find(x => x.id === props.modID))

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `mod-${profile?.id || 'invalid'}`,
  })

  const modIcon = useMemo(() => {
    if (!mod) return ''

    let owner = mod.owner
    if (owner.startsWith('ts-')) {
      owner = owner.slice(3)
    }

    return `https://gcdn.thunderstore.io/live/repository/icons/${owner}-${mod.name}-${mod.version}.png`
  }, [mod])

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
          justifyContent: 'center',

          color: profile?.visible ? 'text.primary' : 'text.disabled',
          transform: CSS.Translate.toString(transform),
        }}
        {...listeners}
        {...attributes}
      >
        {profile && mod ? (
          <>
            {draggable ? (
              <Tooltip title="Drag to Reorder">
                <DragIndicatorIcon sx={{ cursor: 'grab' }} />
              </Tooltip>
            ) : null}

            <Box
              sx={{
                // m: -0.5,
                m: 0.5,

                '&, & > img': {
                  borderRadius: 1,
                  height: `${imageSize}px`,
                  overflow: 'hidden',
                  width: `${imageSize}px`,
                },
              }}
            >
              <Image
                alt={mod.name}
                height={imageSize}
                loading="lazy"
                quality={100}
                src={modIcon}
                width={imageSize}
              />
            </Box>

            <Box
              sx={{
                borderLeft: '1px solid',
                borderColor: 'divider',
                pl: imageSize / 96,
              }}
            >
              <Typography
                sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}
                variant="h6"
              >
                {mod.name.replace(/_/g, ' ')}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: -0.75 }}
                variant="subtitle1"
              >
                {mod.owner}
                <Typography
                  color="text.secondary"
                  sx={{ ml: 0.5 }}
                  variant="caption"
                >
                  ({mod.version})
                </Typography>
              </Typography>
            </Box>

            <Divider sx={{ mx: 'auto' }} />

            {detailed ? (
              <>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => deleteMod(mod.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : null}
          </>
        ) : (
          <Typography variant="h5">Invalid Mod</Typography>
        )}
      </Paper>
    </>
  )
}
