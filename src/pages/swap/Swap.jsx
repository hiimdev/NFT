import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { GearFill } from 'react-bootstrap-icons'
import axios from 'axios';
import ConfigModal from '../../components/ConfigModal';
import { connect } from '../../redux/connectSlice';
import { useSelector, useDispatch } from 'react-redux';

const qs = require('qs')

const Swap = () => {
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined)
  const [signerAddress, setSignerAddress] = useState(undefined)

  const [slippageAmount, setSlippageAmount] = useState(2)
  const [deadlineMinutes, setDeadlineMinutes] = useState(10)
  const [showModal, setShowModal] = useState(undefined)
  const [valueSelectTo, setValueSelectTo] = useState()
  const [tokenData, setTokenData] = useState()
  const [currentTradeFrom, setCurrentTradeFrom] = useState(null)
  const [currentTradeTo, setCurrentTradeTo] = useState(null)
  const [valueGas, setValueGas] = useState(null)
  const [side, setSide] = useState('')

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

  useEffect(() => {
    const getTokenData = async () => {
      try {
        const response = await axios.get('https://tokens.coingecko.com/uniswap/all.json');
        setTokenData(response.data.tokens)
      }
      catch (error) {
        console.log(error);
      }
    }

    getTokenData()
  }, [])

  const boxSelect = (side) => {
    setSide(side)
  }

  const selectToken = (token) => {
    if (side === 'from') {
      setCurrentTradeFrom(token)
    }
    if (side === 'to') {
      setCurrentTradeTo(token)
    }
  }

  const getPrice = async () => {
    if (!currentTradeFrom || !currentTradeTo || !document.getElementById("from_amount").value) return;
    let amount = Number(document.getElementById("from_amount").value * 10 ** currentTradeFrom.decimals);
  
    const params = {
      sellToken: currentTradeFrom.address,
      buyToken: currentTradeTo.address,
      sellAmount: amount,
    }

    try {
      const response = await axios.get(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`);
      const swapPriceJSON = response.data;
      setValueSelectTo(swapPriceJSON.buyAmount / (10 ** currentTradeTo.decimals))
      setValueGas(swapPriceJSON.estimatedGas)
    }
    catch (error) {
      console.log(error);
    } 
  }

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
              <input onBlur={() => getPrice()} type='number' className="number form-control" placeholder="0" id="from_amount" />
            </div>
            <button onClick={() => boxSelect('from')} type="button" className={currentTradeFrom ? "swapbox_select token_selected" : "swapbox_select token_select"} id="to_token_select" data-toggle="modal" data-target="#modalSelectToken">
            {currentTradeFrom
              ? 
              (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img style={{ borderRadius: '50%', marginRight: 7, width: 24, height: 24 }} src={currentTradeFrom.logoURI} alt={currentTradeFrom.symbol} />
                  <span style={{ marginRight: 20 }}>{currentTradeFrom.symbol}</span>
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
                  <input value={valueSelectTo} type='number' className="number form-control" placeholder="0" id="to_amount" />
              </div>
              <button onClick={() => boxSelect('to')} type="button" className={currentTradeTo ? "swapbox_select token_selected" : "swapbox_select token_select"} id="to_token_select" data-toggle="modal" data-target="#modalSelectToken">
              {currentTradeTo
                ? 
                (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img style={{ borderRadius: '50%', marginRight: 7, width: 24, height: 24 }} src={currentTradeTo.logoURI} alt={currentTradeTo.symbol} />
                    <span style={{ marginRight: 20 }}>{currentTradeTo.symbol}</span>
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
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalSelectTokenLabel">Select a token</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body2">
                {
                  tokenData &&
                  tokenData.map((token, i) => (
                    <div onClick={() => selectToken(token)} key={token.logoURI} className='containerToken' data-dismiss="modal" aria-label="Close">
                      <img className='tokenImg' src={token.logoURI} alt={token.symbol} />
                      <div className='wrapName'>
                        <h3 className='tokenName'>{token.name}</h3>
                        <p className='tokenSymbol'>{token.symbol}</p>
                      </div>
                    </div>
                  ))
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