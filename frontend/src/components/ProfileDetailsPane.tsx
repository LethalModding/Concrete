import { useStore } from '@/store'
import PencilIcon from '@mui/icons-material/Edit'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { type Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useCallback, useMemo, useState, type SyntheticEvent } from 'react'
import ModListItem from './ModListItem'

type Props = {
  profileID: string
}

export default function ProfileDetailsPane(props: Props) {
  const { profileID } = props

  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const [selectedTab, setSelectedTab] = useState(1)
  const handleTabChange = useCallback(
    (_event: SyntheticEvent, newValue: number) => {
      setSelectedTab(newValue)
    },
    []
  )

  const profile = useStore(state =>
    state.profiles.find(x => x.id === profileID)
  )
  const recommendedMods = useStore(state =>
    state.mods.filter(x => x.recommended)
  )
  const enabledMods = useStore(state => {
    if (!profile) return []

    return state.mods.filter(x => profile.enabledMods.includes(x.id))
  })
  const missingRecommendedMods = useMemo(() => {
    const missing = []
    for (const mod of recommendedMods) {
      if (!enabledMods.find(x => x.id === mod.id)) {
        missing.push(mod)
      }
    }

    return missing
  }, [enabledMods, recommendedMods])

  const updateProfile = useStore(state => state.updateProfile)
  const addRecommendedMods = useCallback(() => {
    if (!profile) return
    0.0
    const newEnabledMods = [
      ...profile.enabledMods,
      ...missingRecommendedMods.map(x => x.id),
    ]

    updateProfile(profile.id, {
      enabledMods: newEnabledMods,
    })
  }, [missingRecommendedMods, profile, updateProfile])

  if (!profile) {
    return (
      <Paper
        sx={{
          borderRadius: 0,
          p: 2,
          mt: -2,
          mx: -2,
        }}
      >
        <Typography variant="h4">Profile {profileID} not found</Typography>
      </Paper>
    )
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          m: -2,
          mb: 0,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isTablet
              ? 'repeat(2, minmax(0, 1fr))'
              : 'repeat(4, minmax(0, 1fr))',
            gap: isTablet ? 1 : 2,
            placeItems: 'end stretch',

            height: isTablet ? 200 : 300,
            p: isTablet ? 2 : 4,
            py: isTablet ? 2 : 3,
            position: 'relative',
            zIndex: -1,

            '&:after': {
              backgroundImage: `url(${
                profile.cover ??
                `https://picsum.photos/seed/${profile.id}/1920/1080`
              })`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              content: '""',
              filter: 'blur(1px) brightness(0.75) opacity(0.5)',

              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
            },

            '& > .MuiPaper-root': {
              gridColumn: isTablet ? 1 / 2 : 1 / 4,
              p: isTablet ? 0 : 1,
              px: isTablet ? 1 : 2,
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContents: 'flex-end',
              flex: 1,

              gridColumnStart: 1,
              gridColumnEnd: isTablet ? 3 : 5,
              gridRowStart: 1,
              gridRowEnd: isTablet ? 0 : 8,
              zIndex: 1,
            }}
          >
            <Tooltip
              sx={{
                position: 'absolute',
                top: 8,
                right: 10,
              }}
              title="Manage Mods"
            >
              <IconButton
                onClick={() => {
                  console.log('TODO: open mod manager')
                }}
                size="small"
              >
                <PencilIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{
                color: 'transparent',
                fontWeight: 'bold',
                position: 'relative',
                // huge white glow
                textShadow: `0 0 32px rgba(255, 255, 255, 0.5)`,

                '&:before': {
                  content: `"${profile.name}"`,
                  display: 'block',
                  flex: 1,
                  position: 'absolute',
                  textShadow: '2px 2px 2px rgba(255, 255, 255, 0.75)',
                },
              }}
              variant={isTablet ? 'h4' : 'h2'}
            >
              {profile.name}
            </Typography>
            <Typography>{profile.description}</Typography>
          </Box>

          {profile.updated ? (
            <Paper>
              <ListItemText
                primary="Updated At"
                secondary={new Date(profile.updated).toLocaleString()}
              />
            </Paper>
          ) : (
            <Paper>
              <ListItemText
                primary="Created At"
                secondary={new Date(profile.created).toLocaleString()}
              />
            </Paper>
          )}

          {profile.owner !== 'local' ? (
            <Paper>
              <ListItemText
                primary="Owner"
                secondary={profile.owner}
              />
            </Paper>
          ) : null}

          {profile.tags ? (
            <Paper>
              <ListItemText
                primary="Tags"
                secondary={profile.tags.join(', ')}
              />
            </Paper>
          ) : null}
        </Box>
      </Box>

      <Box sx={{ mx: -2 }}>
        <AppBar position="static">
          <Tabs
            centered
            onChange={handleTabChange}
            value={selectedTab}
            variant="fullWidth"
          >
            <Tab label="Details" />
            <Tab label="Mods" />
          </Tabs>
        </AppBar>
      </Box>

      {selectedTab === 0 ? (
        <Paper
          sx={{
            borderRadius: 0,
            py: 0.5,
            px: 1,
            mx: -1.25,
            mr: -1,
            mt: 0.5,
          }}
        >
          <Typography
            color="text.secondary"
            variant="body1"
          >
            {profile.description ?? 'No description provided.'}
          </Typography>

          <Typography
            sx={{ mt: 2 }}
            variant="h6"
          >
            README
          </Typography>

          <Paper
            elevation={2}
            sx={{ my: 0.5, p: 1, px: 1.5 }}
          >
            <Typography variant="body1">
              {profile.instructions ?? 'No README provided.'}
            </Typography>
          </Paper>
        </Paper>
      ) : selectedTab === 1 ? (
        <>
          <Box
            sx={{
              display: 'grid',
              gap: isMobile ? 0.25 : isTablet ? 0.5 : 0.75,
              gridTemplateColumns: `repeat(auto-fill, minmax(${
                isMobile ? 240 : isTablet ? 250 : 330
              }px, 1fr))`,
              mb: -0.5,
              mt: isMobile ? 0.25 : isTablet ? 0.5 : 1,
              mx: isMobile ? -1.5 : isTablet ? -1.25 : -0.5,
            }}
          >
            {profile.enabledMods.length ||
            profile.disabledMods?.length ? null : (
              <Typography
                sx={{ mb: 2, ml: 0.5 }}
                variant="h6"
              >
                Profile contains no mods (yet).
              </Typography>
            )}

            {profile.enabledMods.map(id => (
              <ModListItem
                imageSize={isMobile ? 48 : isTablet ? 64 : 96}
                key={id}
                modID={id}
                profileID={profile.id}
              />
            ))}

            {profile.disabledMods?.map(id => (
              <ModListItem
                imageSize={48}
                key={id}
                modID={id}
                profileID={profile.id}
              />
            ))}
          </Box>

          {missingRecommendedMods?.length ? (
            <>
              <Divider sx={{ mt: 4 }} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  gap: 1,

                  my: 1,
                  p: 2,
                }}
              >
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="h6"
                >
                  Missing {missingRecommendedMods.length} recommended mods.
                </Typography>

                <Button
                  onClick={addRecommendedMods}
                  size="small"
                  variant="contained"
                >
                  Add Recommended Mods
                </Button>
              </Box>
            </>
          ) : null}
        </>
      ) : null}
    </>
  )
}
