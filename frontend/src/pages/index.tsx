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
  const [loadedMods, setLoadedMods] = useState(0)
  const [totalMods, setTotalMods] = useState(0)

  const [chosenSteamPath, setChosenSteamPath] = useState('')
  const [chosenLibraryPath, setChosenLibraryPath] = useState('')
  const [detectedLibraryPaths, setDetectedLibraryPaths] = useState<string[]>([])

  const [oobeStep, setOOBEStep] = useState(0)
  useEffect(() => {
    GetConfig().then(config => {
      setChosenSteamPath(config.steamPath)
      setChosenLibraryPath(config.libraryPath)

      if (config.dismissLogin) setOOBEStep(1)
      if (config.steamPath && config.libraryPath) setOOBEStep(2)

      GetSteam().then(steam => {
        if (!config.steamPath) {
          setChosenSteamPath(steam.installPath)
        }

        setDetectedLibraryPaths(steam.libraryFolders)
        if (!config.libraryPath) {
          setChosenLibraryPath(steam.libraryFolders?.[0] || '')
        }

        setLoading(false)
      })
    })
  }, [])

  //
  // OOBE
  //

  const router = useRouter()
  const advanceOOBE = useCallback(() => {
    setOOBEStep(step => {
      switch (step) {
        case 1:
          SetConfigValue('SteamPath', chosenSteamPath)
          break

        case 2:
          SetConfigValue('LibraryPath', chosenLibraryPath)

          const interval = setInterval(() => {
            if (loadedMods < totalMods) return // Wait for the mods to load

            router.push('/dashboard')
            clearInterval(interval)
          }, 250)

          break
      }

      return step + 1
    })
  }, [chosenLibraryPath, chosenSteamPath, loadedMods, router, totalMods])

  //
  // OOBE Step 0
  //

  const dismissLoginRequest = useCallback(() => {
    SetConfigValue('DismissLogin', 'true')
    advanceOOBE()
  }, [advanceOOBE])

  //
  // OOBE Step 1
  //

  const [steamPathValid, setSteamPathValid] = useState(false)
  const browseSteamPath = useCallback(() => {
    BrowseDirectory('Select Steam Directory').then(choice => {
      if (choice) setChosenSteamPath(choice)
    })
  }, [])
  useEffect(() => {
    ValidateSteamPath(chosenSteamPath).then(isValid => {
      setSteamPathValid(isValid)
    })
  }, [chosenSteamPath])

  //
  // OOBE Step 2
  //

  const [libraryPathValid, setLibraryPathValid] = useState(false)
  const browseLibraryPath = useCallback(() => {
    BrowseDirectory('Select Library Directory').then(choice => {
      if (!choice) setChosenLibraryPath(choice)
    })
  }, [])
  useEffect(() => {
    ValidateLibraryPath(chosenLibraryPath).then(isValid => {
      setLibraryPathValid(isValid)
    })
  }, [chosenLibraryPath])

  //
  // OOBE Step 3
  //

  const addMod = useStore(state => state.addMod)
  useEffect(() => {
    setLoading(true)

    const loadAllMods = async () => {
      if (loading) return

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
  }, [addMod, loading])

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
                  readOnly: true,
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
                onChange={e => setChosenSteamPath(e.target.value)}
                value={chosenSteamPath}
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
                  onChange={e => setChosenLibraryPath(e.target.value)}
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
                  value={chosenLibraryPath}
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
                  <ListSubheader>Manually Selected</ListSubheader>
                  {chosenLibraryPath !== '' &&
                  detectedLibraryPaths.indexOf(chosenLibraryPath) === -1 ? (
                    <MenuItem value={chosenLibraryPath}>
                      {chosenLibraryPath}
                    </MenuItem>
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
