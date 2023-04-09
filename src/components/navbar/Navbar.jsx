import React, { useState, useEffect } from 'react';
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
import ConnectButton from '../ConnectButton';
import { ethers } from 'ethers'
import { useSelector, useDispatch } from 'react-redux'
import { connect } from '../../redux/connectSlice';
import web3 from 'web3';

const drawerWidth = 240;
const navItems = ['swap', 'tokens', 'nfts', 'pools'];

const Navbar = (props) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined)
  const [signerAddress, setSignerAddress] = useState(undefined)
  const [balance, setBalance] = useState(0);

  const isConnected = useSelector((state) => state.connect.connected)
  const address = useSelector((state) => state.connect.address)
  const dispatch = useDispatch()

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

  const [network, setNetwork] = React.useState('Ethereum');
  // const container = window !== undefined ? () => window().document.body : undefined;

  useEffect(() => {
    const onLoad = async () => {
      const { ethereum } = window
      const provider = await new ethers.providers.Web3Provider(ethereum)
      setProvider(provider)
    }
    onLoad()
  }, [])

  const getSigner = async (provider) => {
    if (!window.ethereum) {
      alert('MetaMask not detected. Please install MetaMask first.');
      return;
    }
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setSigner(signer)
  }

  const getWalletAddress = () => {
    signer.getAddress()
      .then(addrr => {
        setSignerAddress(addrr)
      })
  }

  const getBalance = async () => {
    // Tạo instance của Web3
    const Web3 = new web3(window.ethereum);
    // console.log(Web3.eth.getChainId())

    // Lấy số dư của tài khoản hiện tại
    const balance = await Web3.eth.getBalance(signerAddress);

    // Chuyển đổi đơn vị từ wei sang ether và cập nhật state
    setBalance(Web3.utils.fromWei(balance, 'ether'));
  };

  const getNetWork = async () => {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId === '0x1') {
      setNetwork('Ethereum')
    } else {
      setNetwork('Wrong network')
    }

    window.ethereum.on('chainChanged', (chainId) => {
      if (chainId === '0x1') {
        setNetwork('Ethereum')
      } else {
        setNetwork('Wrong network')
      }
    });
  }

  window.ethereum.on('accountsChanged', () => {
    if (signer !== undefined) {
      getWalletAddress()
      getBalance()
    }
  });
    
  if (signer !== undefined) {
    getWalletAddress()
    getBalance()
    getNetWork()
    dispatch(connect(signerAddress))
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link to='/' style={{ color: '#69728E', fontWeight: 'bold', textDecoration:'none' }}>Home</Link>
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
        <span style={{ marginBottom: 20 }} className='netWork'>{network}</span>
        <ConnectButton
          provider={provider}
          isConnected={isConnected}
          signerAddress={address}
          getSigner={getSigner}
        />
    </Box>
  );

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
              <Link style={{ color: '#69728E', fontWeight: 'bold', textDecoration:'none' }} to='/'>Home</Link>
            </Button>
            {navItems.map((item) => (
              <Button key={item}>
                <Link style={{ color: '#69728E', fontWeight: 'bold', textDecoration:'none' }} to={item}>{item}</Link>
              </Button>
            ))}
          </Box>
          <Search sx={{ display: { xs: 'flex', sm: 'none', md: 'none', lg: 'flex' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search tokens and NFT collections"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              <span className='netWork'>{network}</span>
              <ConnectButton
              provider={provider}
              isConnected={isConnected}
              signerAddress={address}
              getSigner={getSigner}
              balance={balance}
              />
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          // container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
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
