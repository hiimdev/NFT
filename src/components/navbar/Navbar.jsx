import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Link } from "react-router-dom";

const drawerWidth = 240;
const navItems = ['swap', 'tokens', 'nfts', 'pools'];

const Navbar = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // Search input
  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    border: '1px solid #c5baba',
    borderRadius: 10,
    color: 'black',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      borderColor: '#3e62df',
    },
    marginRight: '20rem',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#69728E'
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: 400,
      [theme.breakpoints.down('md')]: { 
        width: '20ch',
      },
    },
  }));

  const [network, setNetwork] = React.useState('');
  const handleChangeNetwork = (event) => {
    setNetwork(event.target.value);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link to='/' style={{ color: '#69728E', fontWeight: 'bold', textDecoration:'none' }}>LOGO</Link>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <Link style={{ width: '100%', textAlign: 'center', color: '#69728E', fontWeight: 'bold', textDecoration:'none' }} to={item}>
                <ListItemText primary={item} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Select
        value={network}
        onChange={handleChangeNetwork}
        displayEmpty  
        inputProps={{ 'aria-label': 'Without label' }}
        sx={{ color: '#69728E' }}
      >
        <MenuItem value="">
          <em>Ethereum</em>
        </MenuItem>
        <MenuItem value={10}>Polygon</MenuItem>
        <MenuItem value={20}>Optimism</MenuItem>
        <MenuItem value={30}>Arbitrum</MenuItem>
        <MenuItem value={30}>Celo</MenuItem>
        <MenuItem value={30}>BNB Chain</MenuItem>
      </Select>
      <Button sx={{ color: '#FF15CE', fontWeight: 'bold', background: '#FFD5EC', marginLeft: 2 }}>
        Connect
      </Button>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;


  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar component="nav" sx={{ background: 'white', color: '#69728E'}}>
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, marginRight: 10 }}>
            <Button
              sx={{ display: { xs: 'none', sm: 'block'} }}
            >
              <Link style={{ color: '#69728E', fontWeight: 'bold', textDecoration:'none' }} to='/'>LOGO</Link>
            </Button>
            {navItems.map((item) => (
              <Button>
                <Link style={{ color: '#69728E', fontWeight: 'bold', textDecoration:'none' }} to={item}>{item}</Link>
              </Button>
            ))}
          </Box>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search tokens and NFT collections"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Select
              value={network}
              onChange={handleChangeNetwork}
              displayEmpty  
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ color: '#69728E' }}
            >
              <MenuItem value="">
                <em>Ethereum</em>
              </MenuItem>
              <MenuItem value={10}>Polygon</MenuItem>
              <MenuItem value={20}>Optimism</MenuItem>
              <MenuItem value={30}>Arbitrum</MenuItem>
              <MenuItem value={30}>Celo</MenuItem>
              <MenuItem value={30}>BNB Chain</MenuItem>
            </Select>
            <Button sx={{ color: '#FF15CE', fontWeight: 'bold', background: '#FFD5EC', marginLeft: 2 }}>
              Connect
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default Navbar;
