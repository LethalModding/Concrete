import LoginButtons from '@/components/LoginButtons'
import { useStore } from '@/store'
import CheckIcon from '@mui/icons-material/Check'
import CrossIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import LinearProgress from '@mui/material/LinearProgress'
import ListSubheader from '@mui/material/ListSubheader'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import {
  BrowseDirectory,
  GetConfig,
  GetRecommendedMods,
  GetSteam,
  GetTSMod,
  SetConfigValue,
} from '@/../wailsjs/go/gui/App'

import {
  ValidateLibraryPath,
  ValidateSteamPath,
} from '@/../wailsjs/go/steam/Steam'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [steamPathChoice, setSteamPathChoice] = useState('')
  const [libraryPathChoice, setLibraryPathChoice] = useState('')

  const [oobeStep, setOOBEStep] = useState(0)
  useEffect(() => {
    GetConfig().then(value => {
      setSteamPathChoice(value.steamPath)
      setLibraryPathChoice(value.libraryPath)

      if (value.dismissLogin) setOOBEStep(1)
      if (value.steamPath && value.libraryPath) setOOBEStep(2)

      setLoading(false)
    })
  }, [])

  //
  // OOBE Step 0
  //

  const dismissLoginRequest = useCallback(() => {
    SetConfigValue('DismissLogin', 'true')
    setOOBEStep(1)
  }, [])

  //
  // OOBE Step 1
  //

  const browseSteamPath = useCallback(() => {
    BrowseDirectory('Select Steam Directory').then(choice => {
      if (choice) setSteamPathChoice(choice)
    })
  }, [])

  const [steamPathValid, setSteamPathValid] = useState(false)
  useEffect(() => {
    ValidateSteamPath(steamPathChoice).then(isValid =>
      setSteamPathValid(isValid)
    )
  }, [steamPathChoice])

  //
  // OOBE Step 2
  //

  const [detectedLibraryPaths, setDetectedLibraryPaths] = useState<string[]>([])
  // const [detectedSteamPath, setDetectedSteamPath] = useState('')
  useEffect(() => {
    GetSteam().then(value => {
      setDetectedLibraryPaths(value.libraryFolders)
      // setDetectedSteamPath(value.installPath)
    })
  })

  const browseLibraryPath = useCallback(() => {
    BrowseDirectory('Select Library Directory').then(choice => {
      if (choice) setLibraryPathChoice(choice)
    })
  }, [])

  const [libraryPathValid, setLibraryPathValid] = useState(false)
  useEffect(() => {
    ValidateLibraryPath(libraryPathChoice).then(isValid =>
      setLibraryPathValid(isValid)
    )
  }, [libraryPathChoice])

  //
  // OOBE
  //

  const addMod = useStore(state => state.addMod)
  const [loadedMods, setLoadedMods] = useState(0)
  const [totalMods, setTotalMods] = useState(0)
  useEffect(() => {
    setLoading(true)

    const loadAllMods = async () => {
      const recommendedMods = await GetRecommendedMods()
      setLoadedMods(0)
      setTotalMods(recommendedMods.length)

      for (const mod of recommendedMods) {
        const modData = await GetTSMod(mod)
        const parsedMod = JSON.parse(modData)

        addMod({
          id: `ts-${parsedMod.full_name}`,
          created: parsedMod.date_created,
          updated: parsedMod.date_updated,

          description: parsedMod.latest.description,
          owner: `ts-${parsedMod.namespace}`,
          name: parsedMod.name,
          recommended: true,
          tags:
            parsedMod.community_listings.filter(
              (x: { community: string }) => x.community === 'lethal-company'
            )?.[0]?.categories || [],

          dependencies: parsedMod.latest.dependencies.map(
            (x: string) => `ts-${x}`
          ),
          version: parsedMod.latest.version_number,
        })

        // dropped the following properties on the floor:
        // - package_url
        // - rating_score
        // - is_pinned
        // - is_deprecated
        // - total_downloads
        /*
          "package_url": "https://thunderstore.io/package/EliteMasterEric/SlimeTamingFix/",
          "rating_score": -1,
          "is_pinned": false,
          "is_deprecated": false,
          "total_downloads": -1,
        */
        // - latest.icon
        // - latest.download_url
        // - latest.downloads
        // - latest.website_url
        // - latest.is_active (???)
        /*
          "latest": {
              "icon": "https://gcdn.thunderstore.io/live/repository/icons/EliteMasterEric-SlimeTamingFix-1.0.2.png",
              "download_url": "https://thunderstore.io/package/download/EliteMasterEric/SlimeTamingFix/1.0.2/",
              "downloads": 461144,
              "website_url": "https://github.com/EliteMasterEric/SlimeTamingFix",
              "is_active": true
          },
        */
        // - community_listings[].has_nsfw_content
        // - community_listings[].review_status
        /*
          "community_listings": [
              {
                  "has_nsfw_content": false,
                  "review_status": "unreviewed"
              }
          ]
        */

        setLoadedMods(loaded => loaded + 1)
      }

      setLoading(false)
    }

    loadAllMods()
  }, [addMod])

  const router = useRouter()
  const advanceOOBE = useCallback(() => {
    setOOBEStep(step => {
      switch (step) {
        case 0:
          SetConfigValue('SteamPath', steamPathChoice)
          break

        case 1:
          SetConfigValue('LibraryPath', libraryPathChoice)
          break

        case 2:
          // Create a default profile if none exist
          const interval = setInterval(() => {
            if (loading) return // Wait for the mods to load

            router.push('/dashboard')
            clearInterval(interval)
          }, 200)

          break
      }

      return step + 1
    })
  }, [libraryPathChoice, loading, router, steamPathChoice])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        flexDirection: 'column',

        flex: 1,
        mx: 2,
        textAlign: 'center',
      }}
    >
      <Collapse in={loading}>
        <Typography
          component="h1"
          gutterBottom
          variant="h3"
        >
          Concrete - LethalModding.com
        </Typography>
        <Typography
          color="text.secondary"
          component="h2"
          variant="h5"
        >
          Your source for Lethal Company mods
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',

            gap: 2,
            mt: 3,
          }}
        >
          <CircularProgress size="2em" />

          <Typography
            color="text.secondary"
            component="h3"
            variant="h6"
          >
            Loading...
          </Typography>
        </Box>
      </Collapse>

      <Collapse in={oobeStep === 0 && !loading}>
        <Typography
          color="text.secondary"
          component="h3"
          sx={{ mb: 2 }}
          variant="h6"
        >
          To get started, please login (or don&apos;t).
        </Typography>

        <LoginButtons onDontClick={dismissLoginRequest} />
      </Collapse>

      <Collapse in={oobeStep > 0 && !loading}>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,

            mx: `calc(40% - 150px)`,
            p: 2,
          }}
        >
          {oobeStep === 1 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                flexDirection: 'row',
              }}
            >
              <TextField
                error={!steamPathValid}
                fullWidth
                InputProps={{
                  startAdornment: steamPathValid ? (
                    <CheckIcon
                      color="success"
                      sx={{ mr: 0.5 }}
                    />
                  ) : (
                    <CrossIcon
                      color="error"
                      sx={{ mr: 0.5 }}
                    />
                  ),
                }}
                label="Path to your Steam Executable"
                onChange={e => setSteamPathChoice(e.target.value)}
                value={steamPathChoice}
                variant="standard"
              />
              <Button onClick={browseSteamPath}>Browse</Button>
            </Box>
          ) : null}

          {oobeStep === 2 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                flexDirection: 'row',
              }}
            >
              <FormControl
                error={!libraryPathValid}
                fullWidth
                variant="standard"
              >
                <InputLabel>
                  Path to your Steam Library containing Lethal Company
                </InputLabel>
                <Select
                  displayEmpty
                  onChange={e => setLibraryPathChoice(e.target.value)}
                  startAdornment={
                    libraryPathValid ? (
                      <CheckIcon
                        color="success"
                        sx={{ mr: 0.5 }}
                      />
                    ) : (
                      <CrossIcon
                        color="error"
                        sx={{ mr: 0.5 }}
                      />
                    )
                  }
                  sx={{
                    textAlign: 'left',
                  }}
                  value={libraryPathChoice}
                >
                  <ListSubheader>Detected from Steam</ListSubheader>
                  {detectedLibraryPaths.map(folder => (
                    <MenuItem
                      key={folder}
                      value={folder}
                    >
                      {folder}
                    </MenuItem>
                  ))}
                  {detectedLibraryPaths.indexOf(libraryPathChoice) === -1 ? (
                    <>
                      <ListSubheader>Manually Selected</ListSubheader>
                      <MenuItem value={libraryPathChoice}>
                        {libraryPathChoice}
                      </MenuItem>
                    </>
                  ) : null}
                </Select>
              </FormControl>
              <Button onClick={browseLibraryPath}>Browse</Button>
            </Box>
          ) : null}

          {oobeStep === 3 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Typography
                color="text.secondary"
                component="h3"
                variant="h6"
              >
                Loading recommended mods...
              </Typography>
              <Typography
                color="text.secondary"
                component="h3"
                variant="h6"
              >
                {loadedMods} / {totalMods}
              </Typography>

              <LinearProgress value={(loadedMods / totalMods) * 100} />
            </Box>
          ) : null}

          {oobeStep < 3 ? (
            <Button
              disabled={
                (oobeStep === 1 && !steamPathValid) ||
                (oobeStep === 2 && !libraryPathValid)
              }
              fullWidth
              onClick={advanceOOBE}
              variant="contained"
            >
              Continue
            </Button>
          ) : null}
        </Paper>
      </Collapse>
    </Box>
  )
}
