/* eslint-disable @next/next/no-img-element */
import Link from '@/components/mui/Link'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function GlobalAppBar() {
  return (
    <AppBar
      enableColorOnDark
      position="static"
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 0.5,
        pr: 1,
      }}
    >
      <Link
        color="inherit"
        href="https://lethalmodding.com"
        style={{ display: 'flex' }}
        target="_blank"
      >
        <img
          alt="LethalModding.com"
          src="https://lethalmodding.com/icons/favicon.ico"
          style={{
            height: '100%',
            width: 'auto',
          }}
        />
      </Link>
      <Typography
        sx={{ flex: 1 }}
        variant="h6"
      >
        Concrete
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Avatar
          alt="User"
          color="inherit"
          sx={{ height: 32, width: 32 }}
          variant="rounded"
        >
          <img
            alt="User"
            src="/discord-mark-white.svg"
            style={{
              height: '50%',
              width: 'auto',
            }}
          />
        </Avatar>
      </Box>
    </AppBar>
  )
}
