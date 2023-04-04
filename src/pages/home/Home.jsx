import React from 'react'
import { Grid, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
      <Grid container>
      <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 5 }}>
          <Typography component="h1" variant="h3" color="inherit" sx={{ maxWidth: 900, margin: '0 auto', fontSize: 72, fontWeight: 900, background: 'linear-gradient(10deg, rgb(255, 79, 184) 0%, rgb(255, 159, 251) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'  }}>
            Trade crypto & NFTs with confidence
          </Typography>
          <Typography variant="h5" color="inherit" paragraph sx={{ margin: '28px 0', fontSize: 20, color: 'rgb(119, 128, 160)' }}>
            Buy, sell, and explore tokens and NFTs
          </Typography>
          <Button
          sx={{ margin: '0 auto', background: 'linear-gradient(93.06deg, rgb(255, 0, 199) 2.66%, rgb(255, 159, 251) 98.99%)', textTransform: 'initial', width: 250, height: 50, borderRadius: 24 }}
          >
            <Link style={{ color: 'white', fontWeight: 'bold', textDecoration:'none', fontSize: 20 }} to='/swap'>Get Started</Link>
          </Button>
        </Grid>
      </Grid>
  )
}

export default Home