import { AppBar, Typography, Box, Grid, Link } from '@mui/material'
import React from 'react'
import config from "../../config";

export const Footer = () => {
  return (
    <AppBar position="relative" sx={{ top: 0, bottom: 0, bgcolor: '#2276AC', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box>
        <Typography variant='caption' textAlign='center' className={'versionAlign'}>
          {config.version}
        </Typography>
        <Typography variant='caption' textAlign='center'>
          &nbsp; NASA Official: &nbsp;
        </Typography>
        <Link target='_blank' href='mailto:david.l.meyer@nasa.gov' variant='caption' color='inherit' underline='hover' textAlign='center'>
          {' David Meyer '}
        </Link>
        <Link target='_blank' href='http://www.nasa.gov/about/highlights/HP_Privacy.html'
          variant='caption' color='inherit' underline='hover' textAlign='center' sx={{ ml: 2 }}>
          Web Privacy Policy
        </Link>
        <Link target='_blank' href='http://science.nasa.gov/earth-science/earth-science-data/data-information-policy'
          variant='caption' color='inherit' underline='hover' textAlign='center' sx={{ ml: 2 }}>
          Data & information Policy
        </Link>
        <Link target='_blank' href='http://www.nasa.gov/audience/formedia/features/communication_policy.html'
          variant='caption' color='inherit' underline='hover' textAlign='center' sx={{ ml: 2 }}>
          Communications Policy
        </Link>
        <Link target='_blank' href='http://www.nasa.gov/FOIA/index.html'
          variant='caption' color='inherit' underline='hover' textAlign='center' sx={{ ml: 2 }}>
          Freedom of Information Act
        </Link>
        <Link target='_blank' href='http://www.usa.gov/'
          variant='caption' color='inherit' underline='hover' textAlign='center' sx={{ ml: 2 }}>
          USA.gov
        </Link>
        <Link target='_blank' href='https://ghrc.nsstc.nasa.gov/home/ghrc-docs/cloud_browse_tutorial/'
          variant='caption' color='inherit' underline='hover' textAlign='center' sx={{ ml: 2 }}>
          User Guide
        </Link>
      </Box>
    </AppBar>
  )
}
