import React, { ReactElement } from 'react'
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material'
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material'
import Popover from '@mui/material/Popover'
import ShoppingCart from './ShoppingCart'

const NavBar: React.FC = (): ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Bobalicious
          </Typography>
          <p color='inherit' style={{ marginRight: '10px' }}>
            Welcome back, Tom!
          </p>
          <Button
            aria-describedby={id}
            variant='contained'
            onClick={handleClick}
          >
            <ShoppingCartIcon style={{ cursor: 'pointer' }} />
          </Button>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
          >
            <ShoppingCart />
          </Popover>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default NavBar
