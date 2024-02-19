/* eslint-disable @next/next/no-img-element */
import GitHubIcon from '@mui/icons-material/GitHub'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

type Props = {
  onDontClick?: () => void
}

export default function LoginButtons(props: Props) {
  const { onDontClick } = props

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      <Button variant="contained">
        Discord
        <img
          alt="Discord"
          src="/discord-mark-white.svg"
          style={{
            height: '16px',
            marginLeft: '0.5em',
            width: 'auto',
          }}
        />
      </Button>

      <Button variant="contained">
        Github
        <GitHubIcon
          color="action"
          sx={{ ml: '0.25em' }}
        />
      </Button>

      {onDontClick ? (
        <Button
          variant="outlined"
          onClick={onDontClick}
        >
          Don&apos;t
        </Button>
      ) : null}
    </Box>
  )
}
