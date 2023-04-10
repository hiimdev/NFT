import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { GearFill } from 'react-bootstrap-icons'
import axios from 'axios';
import ConfigModal from '../../components/ConfigModal';
import { connect } from '../../redux/connectSlice';
import { useSelector, useDispatch } from 'react-redux';
import erc20abi from '../../assets/abi.json'

const qs = require('qs')
const { default: BigNumber } = require('bignumber.js');
const Web3 = require('web3');

const Swap = () => {
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined)
  const [signerAddress, setSignerAddress] = useState(undefined)

  const [slippageAmount, setSlippageAmount] = useState(2)
  const [deadlineMinutes, setDeadlineMinutes] = useState(10)
  const [showModal, setShowModal] = useState(undefined)
  const [price, setPrice] = useState()
  const [quote, setQuote] = useState()
  const [valueGas, setValueGas] = useState(null)
  const [side, setSide] = useState('')
  const [valueFrom, setValueFrom] = useState()
  const [currentTradeFrom, setCurrentTradeFrom] = useState('')
  const [currentTradeTo, setCurrentTradeTo] = useState('')
  const [valueSearch, setValueSearch] = useState({ name: '', symbol: '' })
  const [errorValue, setErrorValue] = useState('No results found.')

  const isConnected = useSelector((state) => state.connect.connected)
  const dispatch = useDispatch()

  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
    }
    onLoad()
  }, [])

  const getSigner = async provider => {
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

  if (signer !== undefined) {
    getWalletAddress()
    dispatch(connect(signerAddress))
  }

  // useEffect(() => {
  //   const getTokenData = async () => {
  //     try {
  //       const response = await axios.get('https://tokens.coingecko.com/uniswap/all.json');
  //       setTokenData(response.data.tokens)
  //       setListTokenSearch(response.data.tokens)
  //     }
  //     catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   getTokenData()
  // }, [])

  const boxSelect = (side) => {
    setSide(side)
  }

  const selectToken = (symbol) => {
    if (side === 'from') {
      setCurrentTradeFrom(symbol)
    }
    if (side === 'to') {
      setCurrentTradeTo(symbol)
    }
    document.getElementById('searchInputToken').value = ''
  }

  const handleChangeInputFrom = (e) => {
    setValueFrom(e.target.value)
    if (e.target.value === '') {
      setPrice(0)
    }
  }

  const getPrice = async () => {
    if (!currentTradeFrom || !currentTradeTo || !document.getElementById("from_amount").value) return;
    let amount = Number(valueFrom * 10 ** currentTradeFrom.decimals);
  
    const params = {
      sellToken: currentTradeFrom.address,
      buyToken: currentTradeTo.address,
      sellAmount: amount,
    }

    try {
      const response = await axios.get(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`);
      const swapPriceJSON = response.data;
      setPrice(swapPriceJSON.buyAmount / (10 ** currentTradeTo.decimals))
      setValueGas(swapPriceJSON.estimatedGas)
    }
    catch (error) {
      console.log(error);
    } 
  }

  const getQuote = async (account) => {
    if (!currentTradeFrom || !currentTradeTo || !document.getElementById("from_amount").value) return;
    let amount = Number(valueFrom * 10 ** currentTradeFrom.decimals);
  
    const params = {
      buyToken: currentTradeTo.address,
      sellToken: currentTradeFrom.address,
      sellAmount: amount,
      // takerAddress: account,
    }
  
    // Fetch the swap quote.
      const response = await axios.get(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`);
      const swapQuoteJSON = response.data;
      console.log(response)
      setQuote(swapQuoteJSON.buyAmount / (10 ** currentTradeTo.decimals))
      setValueGas(swapQuoteJSON.estimatedGas)
    
      return swapQuoteJSON
  }

  const trySwap = async () => {
  
    // Only work if MetaMask is connect
    // Connecting to Ethereum: Metamask
    const web3 = new Web3(Web3.givenProvider);
  
    // The address, if any, of the most recently used account that the caller is permitted to access
    let accounts = await window.ethereum.request({ method: "eth_accounts" });
    let takerAddress = accounts[0];
    // console.log(takerAddress)

    //  console.log(await web3.eth.net.getId())
  
    const swapQuoteJSON = await getQuote(takerAddress);
    // console.log(swapQuoteJSON)
    // Set Token Allowance
    // Set up approval amount
    // const fromTokenAddress = currentTradeFrom.address;
    // const maxApproval = new BigNumber(2).pow(256).minus(1);
    const ERC20TokenContract = new web3.eth.Contract(erc20abi, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
    const a = await ERC20TokenContract.methods.symbol().call()
    console.log(a);
    // Grant the allowance target an allowance to spend our tokens.
    // const tx = await ERC20TokenContract.methods.transfer(
    //     '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    //     '10000',
    // )
    // .send({ from: takerAddress })
    // .then(tx => {
    //     console.log("tx: ", tx)
    // });
  }
  // Search Token
  const handleChangeSearchInput = async (e) => {
    const web3 = new Web3(Web3.givenProvider);
    try {
      const ERC20TokenContract = new web3.eth.Contract(erc20abi, e.target.value);
      const getSymbol = await ERC20TokenContract.methods.symbol().call()
      const getName = await ERC20TokenContract.methods.name().call()
      setValueSearch({
        name: getName,
        symbol: getSymbol
      })

    } catch (error) {
      setValueSearch({
        name: '',
        symbol: ''
      })
      setErrorValue('No results found.')
    }
  }

  // reset input search
  const valueSearchInputEl = document.getElementById('searchInputToken')?.value
  useEffect(() => {  
    if (!valueSearchInputEl ) {
      setValueSearch({
        name: '',
        symbol: ''
      })
    }
  }, [valueSearchInputEl])

  return (
    <div className="swap">
      <div className="swapContainer">
        <div className="swapHeader">
          <span className="swapText">Swap</span>
          <span className="gearContainer" onClick={() => setShowModal(true)}>
            <GearFill />
          </span>
          {showModal && (
            <ConfigModal
              onClose={() => setShowModal(false)}
              setDeadlineMinutes={setDeadlineMinutes}
              deadlineMinutes={deadlineMinutes}
              setSlippageAmount={setSlippageAmount}
              slippageAmount={slippageAmount} />
          )}
        </div>

        <div className="swapBody">
          <div className="swapbox">
            <div className="swapbox_select">
              <input onChange={(e) => handleChangeInputFrom(e)} onBlur={() => getPrice()} type='number' className="number form-control" placeholder="0" id="from_amount" />
            </div>
            <button onClick={() => boxSelect('from')} type="button" className={currentTradeFrom ? "swapbox_select token_selected" : "swapbox_select token_select"} id="to_token_select" data-toggle="modal" data-target="#modalSelectToken">
            {currentTradeFrom
              ? 
              (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* <img style={{ borderRadius: '50%', marginRight: 7, width: 24, height: 24 }} src={currentTradeFrom.logoURI} alt={currentTradeFrom.symbol} /> */}
                  <span style={{ marginRight: 20 }}>{currentTradeFrom}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down" viewBox="0 0 16 16">
                    <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>
                  </svg>
                </div>
              )
              : 'Select a token'
            }
            </button>
          </div>
          <div className="swapbox">
              <div className="swapbox_select">
                  <input value={price} type='number' className="number form-control" placeholder="0" id="to_amount" />
              </div>
              <button onClick={() => boxSelect('to')} type="button" className={currentTradeTo ? "swapbox_select token_selected" : "swapbox_select token_select"} id="to_token_select" data-toggle="modal" data-target="#modalSelectToken">
              {currentTradeTo
                ? 
                (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* <img style={{ borderRadius: '50%', marginRight: 7, width: 24, height: 24 }} src={currentTradeTo.logoURI} alt={currentTradeTo.symbol} /> */}
                    <span style={{ marginRight: 20 }}>{currentTradeTo}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down" viewBox="0 0 16 16">
                      <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>
                    </svg>
                  </div>
                )
                : 'Select a token'
              }
              </button>
          </div>
          <div className="gas_estimate_label">Estimated Gas: <span id="gas_estimate">{valueGas}</span></div>       
          <div className="swapButtonContainer">
            {isConnected ? (
              <div
                onClick={() => trySwap()}
                className="swapButton"
              >
                Swap
              </div>
            ) : (
              <div
                onClick={() => getSigner(provider)}
                className="swapButton"
              >
                Connect Wallet
              </div>
            )}
          </div>
        </div>
        <div className="modal fade" id="modalSelectToken" tabIndex="-1" role="dialog" aria-labelledby="modalSelectTokenLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content mt-0">
              <div className="modal-header">
                <h5 className="modal-title" id="modalSelectTokenLabel">Select a token</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="input-group flex-nowrap" style={{ width: '80%', margin: '0 auto 20px' }}>
                <input id='searchInputToken' onChange={(e) => handleChangeSearchInput(e)} type="text" className="form-control" placeholder="Search token with address" aria-label="Tokenname" aria-describedby="addon-wrapping" />
              </div>
              <div className="modal-body2">
                {
                  valueSearch.symbol
                    ? 
                    (
                      <div onClick={() => selectToken(valueSearch.symbol)} className='containerToken' data-dismiss="modal" aria-label="Close">
                        {/* <img className='tokenImg' src={token.logoURI} alt={token.symbol} /> */}
                        <div className='wrapName'>
                          <h3 className='tokenName'>{valueSearch.name}</h3>
                          <p className='tokenSymbol'>{valueSearch.symbol}</p>
                        </div>
                      </div>
                    )
                    : <span style={{ color: 'red' }}>{errorValue}</span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Swap