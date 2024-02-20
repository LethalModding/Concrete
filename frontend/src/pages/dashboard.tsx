import ProfileDetailsPane from '@/components/ProfileDetailsPane'
import BugReportDialog from '@/components/dialogs/BugReport'
import SettingsDialog from '@/components/dialogs/Settings'
import { useStore } from '@/store'
import BugReportIcon from '@mui/icons-material/BugReport'
import HelpIcon from '@mui/icons-material/Help'
import PlayIcon from '@mui/icons-material/PlayArrow'
import SettingsIcon from '@mui/icons-material/Settings'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState, type MouseEvent } from 'react'

const sidebarMinWidth = 150
const sidebarMaxWidth = 300

import { GetConfig } from '@/../wailsjs/go/gui/App'
import { DoLaunchGame } from '@/../wailsjs/go/launcher/Launcher'
import { types } from '../../wailsjs/go/models'

export default function DashboardPage() {
  //
  // Sidebar
  //

  const [sidebarDragging, setSidebarDragging] = useState(false)
  // const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(150)

  const onSidebarDrag = useCallback(
    (e: MouseEvent) => {
      if (sidebarDragging) {
        const newWidth = Math.min(
          Math.max(sidebarMinWidth, e.clientX),
          sidebarMaxWidth
        )

        setSidebarWidth(newWidth)
      }
    },
    [sidebarDragging]
  )

  const onStartSidebarDrag = useCallback(() => {
    setSidebarDragging(true)
  }, [])
  const onStopSidebarDrag = useCallback(() => {
    setSidebarDragging(false)
  }, [])

  //
  // Profiles
  //

  const [selectedProfileID, setSelectedProfileID] = useState<string>('')
  const selectedProfile = useStore(state =>
    state.profiles.find(x => x.id === selectedProfileID)
  )
  const sortedProfiles = useStore(state =>
    state.profiles
      .filter(x => x.visible)
      .sort((a, b) => {
        if (a.order < b.order) return -1
        if (a.order > b.order) return 1
        return 0
      })
  )

  // Select the first profile if the selected profile is not visible or non-existent
  useEffect(() => {
    if (sortedProfiles.length === 0) return

    if (
      selectedProfileID === '' ||
      !sortedProfiles.some(x => x.id === selectedProfileID)
    ) {
      setSelectedProfileID(sortedProfiles[0].id)
    }
  }, [selectedProfileID, sortedProfiles])

  const addProfile = useStore(state => state.addProfile)
  const recommendedMods = useStore(state =>
    state.mods.filter(x => x.recommended)
  )
  const createProfile = useCallback(
    (useRecommended: boolean = true) => {
      addProfile({
        enabledMods: useRecommended ? recommendedMods.map(mod => mod.id) : [],
        name: 'Default Profile',
        order: 1,
        visible: true,
      })
    },
    [addProfile, recommendedMods]
  )

  //
  // Dialogs
  //

  const [bugReporterShown, setBugReporterShown] = useState(false)
  const showBugReport = useCallback(() => {
    setBugReporterShown(true)
  }, [])

  const [helpShown, setHelpShown] = useState(false)
  const showHelp = useCallback(() => {
    setHelpShown(true)
  }, [])

  const [settingsShown, setSettingsShown] = useState(false)
  const showSettings = useCallback(() => {
    setSettingsShown(true)
  }, [])

  //
  // Navigation
  //

  const router = useRouter()
  const navigateProfiles = useCallback(() => {
    router.push('/profiles')
  }, [router])

  const [libraryPath, setLibraryPath] = useState('')
  const [steamPath, setSteamPath] = useState('')
  useEffect(() => {
    GetConfig().then((config: types.Config) => {
      console.log('Loaded config', config)

      setLibraryPath(config.libraryPath)
      setSteamPath(config.steamPath)
    })
  }, [])

  const [loading, setLoading] = useState(false)
  const playGame = useCallback(() => {
    setLoading(true)
    DoLaunchGame(libraryPath, steamPath, JSON.stringify(selectedProfile))
      .catch(x => {
        console.error(x)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [libraryPath, steamPath, selectedProfile])

  return (
    <Box
      onMouseMove={onSidebarDrag}
      onMouseUp={onStopSidebarDrag}
      sx={{
        display: 'grid',
        gridTemplateColumns: sortedProfiles.length
          ? `${sidebarWidth}px 1fr`
          : '1fr',

        flex: 1,

        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <BugReportDialog
        open={bugReporterShown}
        onClose={() => setBugReporterShown(false)}
      />

      <SettingsDialog
        open={settingsShown}
        onClose={() => setSettingsShown(false)}
      />

      <Backdrop
        open={loading}
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.80)',

          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 1,
          justifyContent: 'center',

          zIndex: 1,
        }}
      >
        <CircularProgress size="4em" />

        <Typography
          color="text.secondary"
          component="h3"
          variant="h4"
        >
          Launching Game
        </Typography>

        <Typography
          color="text.secondary"
          component="p"
          variant="body1"
        >
          This may take a few moments.
        </Typography>
      </Backdrop>

      {sortedProfiles.length ? (
        <>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              position: 'absolute',
              bottom: 0,
              width: sidebarWidth - 2,
              zIndex: 1001,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                m: 1,
              }}
            >
              <IconButton
                onClick={showBugReport}
                title="Report Bug"
              >
                <BugReportIcon />
              </IconButton>
              <IconButton
                onClick={showHelp}
                title="Get Help"
              >
                <HelpIcon />
              </IconButton>
              <IconButton
                onClick={showSettings}
                title="Settings"
              >
                <SettingsIcon />
              </IconButton>
            </Box>

            <ListItemButton
              onClick={playGame}
              sx={{
                bgcolor: 'primary.main',
              }}
            >
              <ListItemText
                primary={
                  <>
                    <PlayIcon sx={{ ml: -1.5, mr: 0.5 }} />
                    <Box>Play</Box>
                  </>
                }
                primaryTypographyProps={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  variant: 'h5',
                }}
              />
            </ListItemButton>
          </Paper>

          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRight: 2,
              borderColor: 'primary.main',
              position: 'relative',

              zIndex: 1000,
            }}
          >
            <Box
              sx={{
                height: 'auto',
                minHeight: '100%',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  cursor: 'ew-resize',
                  position: 'absolute',

                  bottom: 0,
                  top: 0,
                  right: 0,
                  width: 8,
                  zIndex: 1000,
                }}
                onMouseDown={onStartSidebarDrag}
                onMouseUp={onStopSidebarDrag}
              />

              <List disablePadding>
                <List
                  disablePadding
                  subheader={
                    <ListSubheader disableGutters>
                      <ListItemButton onClick={navigateProfiles}>
                        <ListItemText>Profiles</ListItemText>
                      </ListItemButton>
                    </ListSubheader>
                  }
                >
                  {sortedProfiles.map(x => (
                    <ListItemButton
                      key={x.id}
                      onClick={() => setSelectedProfileID(x.id)}
                      selected={x.id === selectedProfileID}
                    >
                      <ListItemText>{x.name}</ListItemText>
                    </ListItemButton>
                  ))}
                </List>
              </List>
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              pb: 1.5,

              overflow: 'hidden',
              overflowY: 'auto',
            }}
          >
            <ProfileDetailsPane profileID={selectedProfileID} />
          </Box>
        </>
      ) : (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          <Typography
            align="center"
            variant="h3"
          >
            Create Your First Profile
          </Typography>

          <Typography
            align="center"
            color="textSecondary"
            variant="h6"
          >
            Get started by creating a new profile.
          </Typography>

          <Button
            onClick={() => createProfile(true)}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Recommended Mods
          </Button>

          <Button
            onClick={() => createProfile(false)}
            variant="outlined"
          >
            No Mods (Empty)
          </Button>
        </Box>
      )}
    </Box>
  )
}
